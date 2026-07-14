package com.fitprep.demo.gestion_usuarios.domain.port.out;

import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de salida para la persistencia de usuarios.
 */
public interface UsuarioRepositoryPort {

    Optional<Usuario> findById(Long id);

    Optional<Usuario> findByEmail(String email);

    /** Usuarios con el rol dado, del tenant activo. */
    List<Usuario> findByRol(String rol);

    /** Buscar todos los usuarios por rol ignorando el Tenant (Global) */
    List<Usuario> findAllByRolIgnoringTenant(String rol);

    Usuario save(Usuario usuario);
}
