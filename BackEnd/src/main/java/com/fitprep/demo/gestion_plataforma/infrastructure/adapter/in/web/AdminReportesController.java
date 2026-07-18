package com.fitprep.demo.gestion_plataforma.infrastructure.adapter.in.web;

import com.fitprep.demo.gestion_plataforma.domain.model.EstadisticaHistorica;
import com.fitprep.demo.gestion_plataforma.domain.port.in.ConsultarEstadisticasUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/reportes")
public class AdminReportesController {

    private final ConsultarEstadisticasUseCase consultarEstadisticasUseCase;

    public AdminReportesController(ConsultarEstadisticasUseCase consultarEstadisticasUseCase) {
        this.consultarEstadisticasUseCase = consultarEstadisticasUseCase;
    }

    @GetMapping("/historico")
    public ResponseEntity<List<EstadisticaHistorica>> getHistorico() {
        return ResponseEntity.ok(consultarEstadisticasUseCase.obtenerHistorico());
    }
}
