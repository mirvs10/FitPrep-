package com.fitprep.demo.catalogo_nutricional.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import java.util.List;

/**
 * Repositorio Spring Data sobre la entidad JPA. Detalle de infraestructura.
 */
interface PlatoJpaRepository extends JpaRepository<PlatoEntity, Long> {
    
    @Query(value = "SELECT p.* FROM plato p JOIN negocio n ON p.negocio_id = n.id WHERE p.disponible = true AND n.estado = 'ACTIVO'", nativeQuery = true)
    List<PlatoEntity> findAllCrossTenant();

    @Query(value = "SELECT * FROM plato WHERE id = :id", nativeQuery = true)
    java.util.Optional<PlatoEntity> findByIdCrossTenant(@org.springframework.data.repository.query.Param("id") Long id);
}
