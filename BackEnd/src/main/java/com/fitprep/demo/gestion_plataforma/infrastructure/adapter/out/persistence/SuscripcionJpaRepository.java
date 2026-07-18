package com.fitprep.demo.gestion_plataforma.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SuscripcionJpaRepository extends JpaRepository<SuscripcionEntity, Long> {
    Optional<SuscripcionEntity> findByNegocioId(Long negocioId);
}
