package com.fitprep.demo.planificacion_semanal.domain.port.out;

import com.fitprep.demo.planificacion_semanal.domain.model.PlanSemanal;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Puerto de salida para la persistencia de planes semanales.
 */
public interface PlanSemanalRepositoryPort {

    PlanSemanal save(PlanSemanal plan);

    Optional<PlanSemanal> findById(Long id);

    List<PlanSemanal> findByUsuarioId(Long usuarioId);

    /** Todos los planes del tenant activo (Hibernate filtra por @TenantId). */
    List<PlanSemanal> findAllPlanes();

    List<PlanSemanal> findByFechaInicioSemanaAndEstadoPagoInAndNegocioId(LocalDate fecha, List<String> estados, Integer negocioId);
}
