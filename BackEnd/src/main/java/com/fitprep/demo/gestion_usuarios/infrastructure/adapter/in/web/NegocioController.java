package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.in.web;

import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;
import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.domain.port.in.AutenticacionUseCase;
import com.fitprep.demo.gestion_usuarios.domain.port.in.GestionarNegocioUseCase;
import com.fitprep.demo.gestion_usuarios.domain.port.in.GestionarNegocioUseCase.ActualizarNegocioCommand;
import com.fitprep.demo.gestion_usuarios.infrastructure.adapter.in.web.dto.ActualizarNegocioRequest;
import com.fitprep.demo.gestion_usuarios.infrastructure.adapter.in.web.dto.NegocioResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Adaptador de entrada HTTP para la gestión del propio negocio (tenant).
 */
@RestController
@RequestMapping("/api/v1/negocios")
public class NegocioController {

    private final GestionarNegocioUseCase gestionarNegocio;
    private final AutenticacionUseCase autenticacion;

    public NegocioController(GestionarNegocioUseCase gestionarNegocio,
                             AutenticacionUseCase autenticacion) {
        this.gestionarNegocio = gestionarNegocio;
        this.autenticacion = autenticacion;
    }

    /** Datos del negocio del tenant autenticado. */
    @GetMapping("/mi-negocio")
    public ResponseEntity<?> miNegocio() {
        Long negocioId = negocioIdActual();
        if (negocioId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }
        try {
            Negocio negocio = gestionarNegocio.obtenerNegocio(negocioId);
            return ResponseEntity.ok(mapToResponse(negocio));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<java.util.List<NegocioResponse>> listarTodos() {
        return ResponseEntity.ok(
            gestionarNegocio.listarTodosLosNegocios().stream()
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList())
        );
    }

    /** Actualiza los datos editables del negocio. */
    @PutMapping("/mi-negocio")
    public ResponseEntity<?> actualizarMiNegocio(@RequestBody ActualizarNegocioRequest request) {
        Long negocioId = negocioIdActual();
        if (negocioId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }
        try {
            ActualizarNegocioCommand command = new ActualizarNegocioCommand(
                    request.getNombreComercial(), request.getTelefono());
            Negocio actualizado = gestionarNegocio.actualizarNegocio(negocioId, command);
            return ResponseEntity.ok(mapToResponse(actualizado));
        } catch (IllegalArgumentException e) {
            return errorBody("Datos no válidos", e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /** Resuelve el negocioId del usuario autenticado. */
    private Long negocioIdActual() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (email == null || "anonymousUser".equals(email)) {
            return null;
        }
        Usuario usuario = autenticacion.obtenerPerfilPorEmail(email);
        return usuario.getNegocioId() != null ? usuario.getNegocioId().longValue() : null;
    }

    private NegocioResponse mapToResponse(Negocio negocio) {
        return NegocioResponse.builder()
                .id(negocio.getId())
                .nombreComercial(negocio.getNombreComercial())
                .slug(negocio.getSlug())
                .ruc(negocio.getRuc())
                .telefono(negocio.getTelefono())
                .estado(negocio.getEstado())
                .plan(negocio.getPlan())
                .ciudad(negocio.getCiudad())
                .fechaRegistro(negocio.getFechaRegistro())
                .build();
    }

    private ResponseEntity<Map<String, Object>> errorBody(String error, String message, HttpStatus status) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", error);
        body.put("message", message);
        body.put("status", status.value());
        return ResponseEntity.status(status).body(body);
    }
}
