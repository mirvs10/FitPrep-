package com.fitprep.demo.logistica_cocina.domain.port.in;

import com.fitprep.demo.logistica_cocina.domain.model.ReporteProduccionItem;

import java.time.LocalDate;
import java.util.List;

/**
 * Puerto de entrada: consulta del consolidado de producción de cocina.
 */
public interface ConsultarProduccionUseCase {

    List<ReporteProduccionItem> obtenerConsolidadoProduccion(LocalDate fechaSemana, Integer negocioId);
}
