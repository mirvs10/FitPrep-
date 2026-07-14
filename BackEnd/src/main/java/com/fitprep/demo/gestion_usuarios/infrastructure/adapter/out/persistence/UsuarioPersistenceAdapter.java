package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.out.persistence;

import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.domain.port.out.UsuarioRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class UsuarioPersistenceAdapter implements UsuarioRepositoryPort {

    private final UsuarioJpaRepository jpaRepository;

    public UsuarioPersistenceAdapter(UsuarioJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Optional<Usuario> findById(Long id) {
        return jpaRepository.findById(id).map(UsuarioMapper::toDomain);
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        return jpaRepository.findByEmailIgnoreCase(email).map(UsuarioMapper::toDomain);
    }

    @Override
    public List<Usuario> findByRol(String rol) {
        return jpaRepository.findByRolOrderByNombresAsc(rol).stream()
                .map(UsuarioMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Usuario> findAllByRolIgnoringTenant(String rol) {
        return jpaRepository.findAllByRolIgnoringTenant(rol).stream()
                .map(UsuarioMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Usuario save(Usuario usuario) {
        UsuarioEntity saved = jpaRepository.save(UsuarioMapper.toEntity(usuario));
        return UsuarioMapper.toDomain(saved);
    }
}
