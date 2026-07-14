package com.fitprep.demo.gestion_usuarios.domain.port.in;

import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;

import java.util.List;

/**
 * Puerto de entrada: consultas sobre los clientes (deportistas) del negocio.
 * El filtrado por tenant lo aplica Hibernate mediante {@code @TenantId}.
 */
public interface GestionarClientesUseCase {

    /** Deportistas (rol ATHLETE) del negocio activo. */
    List<Usuario> listarDeportistas();
}
