package com.fitprep.demo.planificacion_semanal.infrastructure.adapter.out.persistence;

import com.fitprep.demo.planificacion_semanal.domain.model.PlanSemanal;
import com.fitprep.demo.planificacion_semanal.domain.port.out.PlanSemanalRepositoryPort;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class PlanSemanalPersistenceAdapter implements PlanSemanalRepositoryPort {

    private final PlanSemanalJpaRepository jpaRepository;

    public PlanSemanalPersistenceAdapter(PlanSemanalJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public PlanSemanal save(PlanSemanal plan) {
        PlanSemanalEntity saved = jpaRepository.save(PlanSemanalMapper.toEntity(plan));
        return PlanSemanalMapper.toDomain(saved);
    }

    @Override
    public Optional<PlanSemanal> findById(Long id) {
        return jpaRepository.findById(id).map(PlanSemanalMapper::toDomain);
    }

    @Override
    public List<PlanSemanal> findByUsuarioId(Long usuarioId) {
        return jpaRepository.findByUsuarioIdOrderByIdDesc(usuarioId).stream()
                .map(PlanSemanalMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<PlanSemanal> findAllPlanes() {
        return jpaRepository.findAllByOrderByIdDesc().stream()
                .map(PlanSemanalMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<PlanSemanal> findByFechaInicioSemanaAndEstadoPagoInAndNegocioId(LocalDate fecha, List<String> estadosPago, Integer negocioId) {
        return jpaRepository.findByFechaInicioSemanaAndEstadoPagoInAndNegocioId(fecha, estadosPago, negocioId).stream()
                .map(PlanSemanalMapper::toDomain)
                .collect(Collectors.toList());
    }
}
