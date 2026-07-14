package com.fitprep.demo.gestion_usuarios.application.service;

import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;
import com.fitprep.demo.gestion_usuarios.domain.model.PasswordHasher;
import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.domain.port.in.AutenticacionUseCase;
import com.fitprep.demo.gestion_usuarios.domain.port.out.NegocioRepositoryPort;
import com.fitprep.demo.gestion_usuarios.domain.port.out.TenantProviderPort;
import com.fitprep.demo.gestion_usuarios.domain.port.out.TokenGeneratorPort;
import com.fitprep.demo.gestion_usuarios.domain.port.out.UsuarioRepositoryPort;
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

    public AuthService(UsuarioRepositoryPort usuarioRepository,
                       NegocioRepositoryPort negocioRepository,
                       TokenGeneratorPort tokenGenerator,
                       PasswordHasher passwordHasher,
                       TenantProviderPort tenantProvider) {
        this.usuarioRepository = usuarioRepository;
        this.negocioRepository = negocioRepository;
        this.tokenGenerator = tokenGenerator;
        this.passwordHasher = passwordHasher;
        this.tenantProvider = tenantProvider;
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
    public Negocio registrarNegocio(RegistroNegocioCommand command) {
        if (negocioRepository.findBySlug(command.slug()).isPresent()) {
            throw new IllegalArgumentException("El slug del negocio ya existe: " + command.slug());
        }

        Negocio negocio = Negocio.builder()
                .nombreComercial(command.nombreComercial())
                .slug(command.slug().toLowerCase().trim())
                .ruc(command.ruc())
                .telefono(command.telefono())
                .build();

        return negocioRepository.save(negocio);
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
