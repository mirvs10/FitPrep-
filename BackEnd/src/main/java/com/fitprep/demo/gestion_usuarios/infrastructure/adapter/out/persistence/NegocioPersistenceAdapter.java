package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.out.persistence;

import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;
import com.fitprep.demo.gestion_usuarios.domain.port.out.NegocioRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class NegocioPersistenceAdapter implements NegocioRepositoryPort {

    private final NegocioJpaRepository jpaRepository;

    public NegocioPersistenceAdapter(NegocioJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Optional<Negocio> findById(Long id) {
        return jpaRepository.findById(id).map(NegocioMapper::toDomain);
    }

    @Override
    public Optional<Negocio> findBySlug(String slug) {
        return jpaRepository.findBySlug(slug).map(NegocioMapper::toDomain);
    }

    @Override
    public Optional<Negocio> findByRuc(String ruc) {
        return jpaRepository.findByRuc(ruc).map(NegocioMapper::toDomain);
    }

    @Override
    public java.util.List<Negocio> findAll() {
        return jpaRepository.findAll().stream().map(NegocioMapper::toDomain).collect(java.util.stream.Collectors.toList());
    }

    @Override
    public Negocio save(Negocio negocio) {
        NegocioEntity saved = jpaRepository.save(NegocioMapper.toEntity(negocio));
        return NegocioMapper.toDomain(saved);
    }
}
