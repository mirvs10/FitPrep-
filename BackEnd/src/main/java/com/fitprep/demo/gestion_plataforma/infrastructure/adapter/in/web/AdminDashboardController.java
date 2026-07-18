package com.fitprep.demo.gestion_plataforma.infrastructure.adapter.in.web;

import com.fitprep.demo.gestion_plataforma.domain.model.EstadisticasPlataforma;
import com.fitprep.demo.gestion_plataforma.domain.port.in.ConsultarEstadisticasUseCase;
import com.fitprep.demo.gestion_plataforma.infrastructure.adapter.in.web.dto.AdminDashboardResponse;
import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;
import com.fitprep.demo.gestion_usuarios.infrastructure.adapter.in.web.dto.NegocioResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
public class AdminDashboardController {

    private final ConsultarEstadisticasUseCase consultarEstadisticasUseCase;

    public AdminDashboardController(ConsultarEstadisticasUseCase consultarEstadisticasUseCase) {
        this.consultarEstadisticasUseCase = consultarEstadisticasUseCase;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardResponse> getStats() {
        EstadisticasPlataforma stats = consultarEstadisticasUseCase.obtenerEstadisticasGlobales();
        
        List<NegocioResponse> nuevosResponse = stats.getNegociosNuevos().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        AdminDashboardResponse response = AdminDashboardResponse.builder()
                .negociosActivos(stats.getNegociosActivos())
                .usuariosTotales(stats.getUsuariosTotales())
                .mrr(stats.getMrr())
                .churn(stats.getChurn())
                .negociosNuevos(nuevosResponse)
                .distribucionPlanes(stats.getDistribucionPlanes())
                .build();

        return ResponseEntity.ok(response);
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
}
