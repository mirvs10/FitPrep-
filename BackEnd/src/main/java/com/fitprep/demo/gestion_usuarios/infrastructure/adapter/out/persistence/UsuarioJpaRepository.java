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

    @Query(value = "SELECT * FROM usuario ORDER BY id DESC", nativeQuery = true)
    List<UsuarioEntity> findAllIgnoringTenant();

    @org.springframework.data.jpa.repository.Modifying
    @Query(value = "INSERT INTO usuario (negocio_id, nombres, apellidos, email, password_hash, rol) VALUES (:#{#u.negocioId}, :#{#u.nombres}, :#{#u.apellidos}, :#{#u.email}, :#{#u.passwordHash}, :#{#u.rol})", nativeQuery = true)
    void insertNative(@Param("u") UsuarioEntity u);

    @org.springframework.data.jpa.repository.Modifying
    @Query(value = "UPDATE usuario SET estado = 'INACTIVO' WHERE id = :id", nativeQuery = true)
    void deleteByIdIgnoringTenant(@Param("id") Long id);
}
