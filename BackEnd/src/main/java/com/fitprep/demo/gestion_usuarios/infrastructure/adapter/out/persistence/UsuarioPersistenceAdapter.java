package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.out.persistence;

import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.domain.port.out.UsuarioRepositoryPort;
import com.fitprep.demo.identidad_inquilino.TenantContext;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class UsuarioPersistenceAdapter implements UsuarioRepositoryPort {

    private final UsuarioJpaRepository jpaRepository;
    private final org.springframework.transaction.PlatformTransactionManager transactionManager;

    public UsuarioPersistenceAdapter(UsuarioJpaRepository jpaRepository, org.springframework.transaction.PlatformTransactionManager transactionManager) {
        this.jpaRepository = jpaRepository;
        this.transactionManager = transactionManager;
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
    public List<Usuario> findAllIgnoringTenant() {
        return jpaRepository.findAllIgnoringTenant().stream()
                .map(UsuarioMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Usuario save(Usuario usuario) {
        UsuarioEntity saved = jpaRepository.save(UsuarioMapper.toEntity(usuario));
        return UsuarioMapper.toDomain(saved);
    }
    
    @Override
    public Usuario saveWithTenant(Usuario usuario, Integer tenantId) {
        String previousTenant = TenantContext.getCurrentTenant();
        try {
            TenantContext.setCurrentTenant(String.valueOf(tenantId));
            
            UsuarioEntity entity = UsuarioMapper.toEntity(usuario);
            jpaRepository.insertNative(entity);
            
            // Fetch back to get the generated ID
            UsuarioEntity saved = jpaRepository.findByEmailIgnoreCase(usuario.getEmail())
                .orElseThrow(() -> new IllegalStateException("Could not fetch user after native insert"));
                
            return UsuarioMapper.toDomain(saved);
        } finally {
            TenantContext.setCurrentTenant(previousTenant);
        }
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteByIdIgnoringTenant(id);
    }
}
