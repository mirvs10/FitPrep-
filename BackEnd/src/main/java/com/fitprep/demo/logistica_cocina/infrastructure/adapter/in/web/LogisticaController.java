package com.fitprep.demo.logistica_cocina.infrastructure.adapter.in.web;

import com.fitprep.demo.logistica_cocina.domain.model.ReporteProduccionItem;
import com.fitprep.demo.logistica_cocina.domain.port.in.ConsultarProduccionUseCase;
import com.fitprep.demo.logistica_cocina.infrastructure.adapter.in.web.dto.ReporteProduccionResponse;
import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.domain.port.in.AutenticacionUseCase;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/logistica")
public class LogisticaController {

    private final ConsultarProduccionUseCase consultarProduccion;
    private final AutenticacionUseCase autenticacionUseCase;

    public LogisticaController(ConsultarProduccionUseCase consultarProduccion,
                               AutenticacionUseCase autenticacionUseCase) {
        this.consultarProduccion = consultarProduccion;
        this.autenticacionUseCase = autenticacionUseCase;
    }

    @GetMapping("/produccion")
    public ResponseEntity<?> obtenerProduccion(
            @RequestParam("fechaSemana") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaSemana) {
        
        Usuario actual = usuarioActual();
        if (actual == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }
        if (actual.getNegocioId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No pertenece a un negocio");
        }
        if (fechaSemana == null) {
            return ResponseEntity.badRequest().build();
        }

        List<ReporteProduccionResponse> reporte = consultarProduccion.obtenerConsolidadoProduccion(fechaSemana, actual.getNegocioId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reporte);
    }

    private Usuario usuarioActual() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (email == null || "anonymousUser".equals(email)) {
            return null;
        }
        return autenticacionUseCase.obtenerPerfilPorEmail(email);
    }

    private ReporteProduccionResponse mapToResponse(ReporteProduccionItem item) {
        return ReporteProduccionResponse.builder()
                .platoId(item.getPlatoId())
                .platoNombre(item.getPlatoNombre())
                .diaSemana(item.getDiaSemana())
                .tipoComida(item.getTipoComida())
                .cantidadTotal(item.getCantidadTotal())
                .build();
    }
}
