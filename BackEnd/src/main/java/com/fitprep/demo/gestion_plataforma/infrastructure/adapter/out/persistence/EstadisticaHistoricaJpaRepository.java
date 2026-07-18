package com.fitprep.demo.gestion_plataforma.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EstadisticaHistoricaJpaRepository extends JpaRepository<EstadisticaHistoricaEntity, Long> {
    List<EstadisticaHistoricaEntity> findAllByOrderByFechaAsc();
}
