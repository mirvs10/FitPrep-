package com.fitprep.demo.gestion_usuarios.domain.port.out;

import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;

import java.util.Optional;

/**
 * Puerto de salida para la persistencia de negocios (tenants).
 */
public interface NegocioRepositoryPort {

    Optional<Negocio> findById(Long id);

    Optional<Negocio> findBySlug(String slug);

    Optional<Negocio> findByRuc(String ruc);

    java.util.List<Negocio> findAll();

    Negocio save(Negocio negocio);
}
