package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface UsuarioJpaRepository extends JpaRepository<UsuarioEntity, Long> {
    @Query(value = "SELECT * FROM usuario WHERE lower(email) = lower(:email)", nativeQuery = true)
    Optional<UsuarioEntity> findByEmailIgnoreCase(@Param("email") String email);

    List<UsuarioEntity> findByRolOrderByNombresAsc(String rol);

    @Query(value = "SELECT * FROM usuario WHERE rol = :rol ORDER BY nombres ASC", nativeQuery = true)
    List<UsuarioEntity> findAllByRolIgnoringTenant(@Param("rol") String rol);
}
