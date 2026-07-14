package com.fitprep.demo.logistica_cocina.application.service;

import com.fitprep.demo.logistica_cocina.domain.model.ReporteProduccionItem;
import com.fitprep.demo.logistica_cocina.domain.port.in.ConsultarProduccionUseCase;
import com.fitprep.demo.planificacion_semanal.domain.model.DetallePlan;
import com.fitprep.demo.planificacion_semanal.domain.model.PlanSemanal;
import com.fitprep.demo.planificacion_semanal.domain.port.out.PlanSemanalRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Caso de uso de logística. Consume el puerto de salida de planificación para
 * consolidar la producción de cocina de la semana.
 */
@Service
@Transactional(readOnly = true)
public class LogisticaService implements ConsultarProduccionUseCase {

    private static final List<String> ESTADOS_PRODUCIBLES = List.of("CONFIRMADO", "PAGADO");

    private final PlanSemanalRepositoryPort planSemanalRepository;

    public LogisticaService(PlanSemanalRepositoryPort planSemanalRepository) {
        this.planSemanalRepository = planSemanalRepository;
    }

    @Override
    public List<ReporteProduccionItem> obtenerConsolidadoProduccion(LocalDate fechaSemana, Integer negocioId) {
        List<PlanSemanal> planes = planSemanalRepository
                .findByFechaInicioSemanaAndEstadoPagoInAndNegocioId(fechaSemana, ESTADOS_PRODUCIBLES, negocioId);

        Map<String, ReporteProduccionItem> consolidado = new HashMap<>();

        for (PlanSemanal plan : planes) {
            for (DetallePlan detalle : plan.getComidas()) {
                if (detalle.getPlato() == null) {
                    continue;
                }

                String key = String.format("%d|%s|%s|%s",
                        detalle.getPlato().getId(),
                        detalle.getPlato().getNombre(),
                        detalle.getDiaSemana(),
                        detalle.getTipoComida());

                int cantidad = detalle.getCantidad() != null ? detalle.getCantidad() : 1;

                ReporteProduccionItem item = consolidado.get(key);
                if (item != null) {
                    item.acumular(cantidad);
                } else {
                    consolidado.put(key, ReporteProduccionItem.builder()
                            .platoId(detalle.getPlato().getId())
                            .platoNombre(detalle.getPlato().getNombre())
                            .diaSemana(detalle.getDiaSemana())
                            .tipoComida(detalle.getTipoComida())
                            .cantidadTotal(cantidad)
                            .build());
                }
            }
        }

        return new ArrayList<>(consolidado.values());
    }
}
