package com.fitprep.demo.planificacion_semanal.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

interface PlanSemanalJpaRepository extends JpaRepository<PlanSemanalEntity, Long> {
    List<PlanSemanalEntity> findByFechaInicioSemanaAndEstadoPagoInAndNegocioId(LocalDate fecha, List<String> estadosPago, Integer negocioId);

    List<PlanSemanalEntity> findByUsuarioIdOrderByIdDesc(Long usuarioId);

    List<PlanSemanalEntity> findAllByOrderByIdDesc();
}
