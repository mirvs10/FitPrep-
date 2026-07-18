package com.fitprep.demo.gestion_plataforma.domain.port.in;

import com.fitprep.demo.gestion_plataforma.domain.model.EstadisticasPlataforma;
import com.fitprep.demo.gestion_plataforma.domain.model.EstadisticaHistorica;
import java.util.List;

public interface ConsultarEstadisticasUseCase {
    EstadisticasPlataforma obtenerEstadisticasGlobales();
    List<EstadisticaHistorica> obtenerHistorico();
}
