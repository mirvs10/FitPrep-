package com.fitprep.demo.gestion_plataforma.infrastructure.adapter.out.persistence;

import com.fitprep.demo.gestion_plataforma.domain.port.out.EstadisticasPort;
import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;
import com.fitprep.demo.gestion_usuarios.infrastructure.adapter.out.persistence.NegocioEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class EstadisticasPersistenceAdapter implements EstadisticasPort {

    @PersistenceContext
    private EntityManager entityManager;
    
    private final EstadisticaHistoricaJpaRepository historicaJpaRepository;

    public EstadisticasPersistenceAdapter(EstadisticaHistoricaJpaRepository historicaJpaRepository) {
        this.historicaJpaRepository = historicaJpaRepository;
    }

    @Override
    public long countNegociosActivos() {
        return entityManager.createQuery(
                "SELECT COUNT(n) FROM NegocioEntity n WHERE n.estado = 'ACTIVO'", Long.class)
                .getSingleResult();
    }

    @Override
    public long countUsuariosTotales() {
        // Usamos una consulta nativa para evitar que Hibernate aplique el filtro @TenantId
        // Excluimos al SuperAdmin
        Object result = entityManager.createNativeQuery("SELECT COUNT(*) FROM usuario WHERE rol != 'ADMIN'").getSingleResult();
        return ((Number) result).longValue();
    }

    @Override
    public List<Negocio> findNegociosNuevos() {
        List<NegocioEntity> entities = entityManager.createQuery(
                "SELECT n FROM NegocioEntity n ORDER BY n.fechaRegistro DESC", NegocioEntity.class)
                .setMaxResults(5)
                .getResultList();
        return entities.stream().map(this::mapToDomain).collect(Collectors.toList());
    }

    @Override
    public List<Negocio> findAllNegocios() {
        List<NegocioEntity> entities = entityManager.createQuery(
                "SELECT n FROM NegocioEntity n ORDER BY n.id ASC", NegocioEntity.class)
                .getResultList();
        return entities.stream().map(this::mapToDomain).collect(Collectors.toList());
    }

    private Negocio mapToDomain(NegocioEntity entity) {
        if (entity == null) {
            return null;
        }
        return Negocio.builder()
                .id(entity.getId())
                .nombreComercial(entity.getNombreComercial())
                .slug(entity.getSlug())
                .ruc(entity.getRuc())
                .telefono(entity.getTelefono())
                .estado(entity.getEstado())
                .plan(entity.getPlan())
                .ciudad(entity.getCiudad())
                .fechaRegistro(entity.getFechaRegistro())
                .build();
    }

    @Override
    public List<com.fitprep.demo.gestion_plataforma.domain.model.EstadisticaHistorica> getHistoricos() {
        return historicaJpaRepository.findAllByOrderByFechaAsc().stream()
                .map(entity -> com.fitprep.demo.gestion_plataforma.domain.model.EstadisticaHistorica.builder()
                        .id(entity.getId())
                        .fecha(entity.getFecha())
                        .mrr(entity.getMrr())
                        .churnRate(entity.getChurnRate())
                        .nuevosNegocios(entity.getNuevosNegocios())
                        .build())
                .collect(Collectors.toList());
    }
}
