package com.fitprep.demo.gestion_usuarios.application.service;

import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;
import com.fitprep.demo.gestion_usuarios.domain.model.PasswordHasher;
import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.domain.port.in.AutenticacionUseCase;
import com.fitprep.demo.gestion_usuarios.domain.port.out.NegocioRepositoryPort;
import com.fitprep.demo.gestion_usuarios.domain.port.out.TenantProviderPort;
import com.fitprep.demo.gestion_usuarios.domain.port.out.TokenGeneratorPort;
import com.fitprep.demo.gestion_usuarios.domain.port.out.UsuarioRepositoryPort;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Implementación de los casos de uso de autenticación. Depende exclusivamente
 * de puertos del dominio, nunca de tecnologías concretas.
 */
@Service
@Transactional(readOnly = true)
public class AuthService implements AutenticacionUseCase {

    private final UsuarioRepositoryPort usuarioRepository;
    private final NegocioRepositoryPort negocioRepository;
    private final TokenGeneratorPort tokenGenerator;
    private final PasswordHasher passwordHasher;
    private final TenantProviderPort tenantProvider;
    private final ApplicationEventPublisher eventPublisher;

    public AuthService(UsuarioRepositoryPort usuarioRepository,
                       NegocioRepositoryPort negocioRepository,
                       TokenGeneratorPort tokenGenerator,
                       PasswordHasher passwordHasher,
                       TenantProviderPort tenantProvider,
                       ApplicationEventPublisher eventPublisher) {
        this.usuarioRepository = usuarioRepository;
        this.negocioRepository = negocioRepository;
        this.tokenGenerator = tokenGenerator;
        this.passwordHasher = passwordHasher;
        this.tenantProvider = tenantProvider;
        this.eventPublisher = eventPublisher;
    }

    @Override
    @Transactional
    public ResultadoLogin login(String email, String password) {
        String normalizedEmail = email != null ? email.toLowerCase().trim() : "";
        Usuario usuario = usuarioRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("Credenciales incorrectas"));

        if (!usuario.passwordCoincide(password, passwordHasher)) {
            throw new IllegalArgumentException("Contraseña incorrecta");
        }

        String token = tokenGenerator.generateToken(
                usuario.getEmail(),
                List.of(usuario.getRol()),
                String.valueOf(usuario.getNegocioId())
        );

        return new ResultadoLogin(token, usuario);
    }

    @Override
    @Transactional
    public Usuario registrarUsuario(RegistroUsuarioCommand command, String rol) {
        if (usuarioRepository.findByEmail(command.email()).isPresent()) {
            throw new IllegalArgumentException("El email ya está registrado: " + command.email());
        }

        Integer negocioId = tenantProvider.currentTenantId();
        if (negocioId == null) {
            negocioId = 1;
        }

        Usuario usuario = Usuario.builder()
                .negocioId(negocioId)
                .nombres(command.nombres())
                .apellidos(command.apellidos())
                .email(command.email())
                .passwordHash(passwordHasher.hash(command.password()))
                .rol(rol != null ? rol.toUpperCase() : "ATHLETE")
                .objetivoFitness(command.objetivoFitness())
                .requerimientoKcal(command.requerimientoKcal())
                .reqProteinasG(command.reqProteinasG())
                .reqCarbohidratosG(command.reqCarbohidratosG())
                .reqGrasasG(command.reqGrasasG())
                .build();

        return usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public ResultadoLogin registrarNegocio(RegistroNegocioCommand command) {
        if (negocioRepository.findBySlug(command.slug()).isPresent()) {
            throw new IllegalArgumentException("El slug del negocio ya existe: " + command.slug());
        }
        
        if (command.ruc() != null && command.ruc().length() != 11) {
            throw new IllegalArgumentException("El RUC debe tener exactamente 11 caracteres.");
        }

        if (negocioRepository.findByRuc(command.ruc()).isPresent()) {
            throw new IllegalArgumentException("El RUC ya está registrado en otro negocio.");
        }
        
        if (usuarioRepository.findByEmail(command.email()).isPresent()) {
            throw new IllegalArgumentException("El email ya está registrado: " + command.email());
        }

        Negocio negocio = Negocio.builder()
                .nombreComercial(command.nombreComercial())
                .slug(command.slug().toLowerCase().trim())
                .ruc(command.ruc())
                .telefono(command.telefono())
                .plan(command.plan())
                .estado("ACTIVO") // Comienza activo al pagar
                .build();

        Negocio savedNegocio = negocioRepository.save(negocio);
        
        Usuario adminUsuario = Usuario.builder()
                .nombres("Admin")
                .apellidos(command.nombreComercial())
                .email(command.email())
                .passwordHash(passwordHasher.hash(command.password()))
                .rol("TENANT")
                .negocioId(savedNegocio.getId().intValue())
                .build();
                
        Usuario savedUsuario = usuarioRepository.saveWithTenant(adminUsuario, savedNegocio.getId().intValue());

        // Emitimos el evento para que el módulo de Plataforma (SaaS) le cree su suscripción.
        eventPublisher.publishEvent(new com.fitprep.demo.gestion_usuarios.domain.event.NegocioRegistradoEvent(
                savedNegocio.getId(), 
                command.plan(), 
                command.metodoPago()
        ));

        String token = tokenGenerator.generateToken(
                savedUsuario.getEmail(),
                List.of(savedUsuario.getRol()),
                String.valueOf(savedUsuario.getNegocioId())
        );

        return new ResultadoLogin(token, savedUsuario);
    }

    @Override
    public Usuario obtenerPerfilPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Perfil no encontrado para el usuario: " + email));
    }

    @Override
    @Transactional
    public Usuario actualizarObjetivos(String email, ActualizarObjetivosCommand command) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Perfil no encontrado para el usuario: " + email));

        usuario.actualizarObjetivos(
                command.objetivoFitness(),
                command.requerimientoKcal(),
                command.reqProteinasG(),
                command.reqCarbohidratosG(),
                command.reqGrasasG());

        return usuarioRepository.save(usuario);
    }
}
