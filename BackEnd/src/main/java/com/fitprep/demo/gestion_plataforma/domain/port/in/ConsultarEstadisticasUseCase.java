package com.fitprep.demo.gestion_plataforma.domain.port.in;

import com.fitprep.demo.gestion_plataforma.domain.model.EstadisticasPlataforma;

public interface ConsultarEstadisticasUseCase {
    EstadisticasPlataforma obtenerEstadisticasGlobales();
}
