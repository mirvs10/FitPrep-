package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.in.web;

import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;
import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.domain.port.in.AutenticacionUseCase;
import com.fitprep.demo.gestion_usuarios.domain.port.in.AutenticacionUseCase.ActualizarObjetivosCommand;
import com.fitprep.demo.gestion_usuarios.domain.port.in.AutenticacionUseCase.RegistroNegocioCommand;
import com.fitprep.demo.gestion_usuarios.domain.port.in.AutenticacionUseCase.RegistroUsuarioCommand;
import com.fitprep.demo.gestion_usuarios.domain.port.in.AutenticacionUseCase.ResultadoLogin;
import com.fitprep.demo.gestion_usuarios.infrastructure.adapter.in.web.dto.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AutenticacionUseCase autenticacion;

    public AuthController(AutenticacionUseCase autenticacion) {
        this.autenticacion = autenticacion;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            ResultadoLogin resultado = autenticacion.login(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(mapToAuthResponse(resultado.usuario(), resultado.token()));
        } catch (IllegalArgumentException e) {
            return errorBody("Error de Autenticación", e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/register/deportista")
    public ResponseEntity<?> registrarDeportista(@RequestBody RegisterDeportistaRequest request) {
        try {
            RegistroUsuarioCommand command = new RegistroUsuarioCommand(
                    request.getNombres(),
                    request.getApellidos(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getObjetivoFitness(),
                    request.getRequerimientoKcal(),
                    request.getReqProteinasG(),
                    request.getReqCarbohidratosG(),
                    request.getReqGrasasG()
            );
            Usuario usuario = autenticacion.registrarUsuario(command, "ATHLETE");
            return ResponseEntity.status(HttpStatus.CREATED).body(mapToAuthResponse(usuario, null));
        } catch (IllegalArgumentException e) {
            return errorBody("Error de Registro", e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/register/negocio")
    public ResponseEntity<?> registrarNegocio(@RequestBody RegisterNegocioRequest request) {
        try {
            RegistroNegocioCommand command = new RegistroNegocioCommand(
                    request.getNombreComercial(),
                    request.getSlug(),
                    request.getRuc(),
                    request.getTelefono()
            );
            Negocio negocio = autenticacion.registrarNegocio(command);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapToNegocioResponse(negocio));
        } catch (IllegalArgumentException e) {
            return errorBody("Error de Registro de Negocio", e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> obtenerMiPerfil() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (email == null || "anonymousUser".equals(email)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }

        try {
            Usuario usuario = autenticacion.obtenerPerfilPorEmail(email);
            return ResponseEntity.ok(mapToAuthResponse(usuario, null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/me")
    public ResponseEntity<?> actualizarMisObjetivos(@RequestBody ActualizarObjetivosRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (email == null || "anonymousUser".equals(email)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }

        try {
            ActualizarObjetivosCommand command = new ActualizarObjetivosCommand(
                    request.getObjetivoFitness(),
                    request.getRequerimientoKcal(),
                    request.getReqProteinasG(),
                    request.getReqCarbohidratosG(),
                    request.getReqGrasasG());
            Usuario actualizado = autenticacion.actualizarObjetivos(email, command);
            return ResponseEntity.ok(mapToAuthResponse(actualizado, null));
        } catch (IllegalArgumentException e) {
            return errorBody("Datos no válidos", e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    private AuthResponse mapToAuthResponse(Usuario usuario, String token) {
        return AuthResponse.builder()
                .token(token)
                .id(usuario.getId())
                .negocioId(usuario.getNegocioId())
                .nombres(usuario.getNombres())
                .apellidos(usuario.getApellidos())
                .email(usuario.getEmail())
                .rol(usuario.getRol())
                .objetivoFitness(usuario.getObjetivoFitness())
                .requerimientoKcal(usuario.getRequerimientoKcal())
                .reqProteinasG(usuario.getReqProteinasG())
                .reqCarbohidratosG(usuario.getReqCarbohidratosG())
                .reqGrasasG(usuario.getReqGrasasG())
                .build();
    }

    private NegocioResponse mapToNegocioResponse(Negocio negocio) {
        return NegocioResponse.builder()
                .id(negocio.getId())
                .nombreComercial(negocio.getNombreComercial())
                .slug(negocio.getSlug())
                .ruc(negocio.getRuc())
                .telefono(negocio.getTelefono())
                .estado(negocio.getEstado())
                .fechaRegistro(negocio.getFechaRegistro())
                .build();
    }

    /**
     * Violaciones de integridad (RUC/slug/email duplicado o dato demasiado largo)
     * se traducen a 409 con un mensaje legible en vez de un 500 genérico.
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrity(DataIntegrityViolationException ex) {
        return errorBody(
                "Datos en conflicto",
                "El registro no se pudo completar: es posible que algún dato único (RUC, slug o email) ya exista o no sea válido.",
                HttpStatus.CONFLICT);
    }

    private ResponseEntity<Map<String, Object>> errorBody(String error, String message, HttpStatus status) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", error);
        body.put("message", message);
        body.put("status", status.value());
        return ResponseEntity.status(status).body(body);
    }
}
