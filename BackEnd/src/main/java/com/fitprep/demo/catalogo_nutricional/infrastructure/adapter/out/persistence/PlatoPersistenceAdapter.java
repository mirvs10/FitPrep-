package com.fitprep.demo.catalogo_nutricional.infrastructure.adapter.out.persistence;

import com.fitprep.demo.catalogo_nutricional.domain.model.Plato;
import com.fitprep.demo.catalogo_nutricional.domain.port.out.PlatoRepositoryPort;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Adaptador de salida (driven adapter). Implementa el puerto del dominio
 * usando Spring Data JPA y traduce con {@link PlatoMapper}.
 */
@Component
public class PlatoPersistenceAdapter implements PlatoRepositoryPort {

    private final PlatoJpaRepository jpaRepository;

    public PlatoPersistenceAdapter(PlatoJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public List<Plato> findAll() {
        return jpaRepository.findAll().stream()
                .map(PlatoMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Plato> findAllCrossTenant() {
        return jpaRepository.findAllCrossTenant().stream()
                .map(PlatoMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Plato> findById(Long id) {
        return jpaRepository.findById(id).map(PlatoMapper::toDomain);
    }

    @Override
    public Optional<Plato> findByIdCrossTenant(Long id) {
        return jpaRepository.findByIdCrossTenant(id).map(PlatoMapper::toDomain);
    }

    @Override
    public Plato save(Plato plato) {
        PlatoEntity saved = jpaRepository.save(PlatoMapper.toEntity(plato));
        return PlatoMapper.toDomain(saved);
    }

    @Override
    public void delete(Plato plato) {
        PlatoEntity entity = PlatoMapper.toEntity(plato);
        try {
            jpaRepository.delete(entity);
            // Forzamos el flush para detectar violaciones de FK dentro de la transacción.
            jpaRepository.flush();
        } catch (DataIntegrityViolationException e) {
            // Si el plato está enlazado a planes, se descataloga en lugar de borrarse.
            entity.setDisponible(false);
            jpaRepository.save(entity);
        }
    }
}
