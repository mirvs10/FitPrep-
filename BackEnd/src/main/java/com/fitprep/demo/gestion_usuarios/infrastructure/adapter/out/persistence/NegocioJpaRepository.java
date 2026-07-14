package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

interface NegocioJpaRepository extends JpaRepository<NegocioEntity, Long> {
    Optional<NegocioEntity> findBySlug(String slug);
}
