package com.fitprep.demo.gestion_plataforma.infrastructure.adapter.out.persistence;

import com.fitprep.demo.gestion_plataforma.domain.model.Suscripcion;
import com.fitprep.demo.gestion_plataforma.domain.port.out.SuscripcionPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class SuscripcionPersistenceAdapter implements SuscripcionPort {

    private final SuscripcionJpaRepository jpaRepository;

    public SuscripcionPersistenceAdapter(SuscripcionJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Suscripcion save(Suscripcion suscripcion) {
        SuscripcionEntity entity = mapToEntity(suscripcion);
        SuscripcionEntity saved = jpaRepository.save(entity);
        return mapToDomain(saved);
    }

    @Override
    public Optional<Suscripcion> findByNegocioId(Long negocioId) {
        return jpaRepository.findByNegocioId(negocioId).map(this::mapToDomain);
    }

    @Override
    public List<Suscripcion> findAll() {
        return jpaRepository.findAll().stream().map(this::mapToDomain).collect(Collectors.toList());
    }

    private SuscripcionEntity mapToEntity(Suscripcion model) {
        return SuscripcionEntity.builder()
                .id(model.getId())
                .negocioId(model.getNegocioId())
                .plan(model.getPlan())
                .estadoPago(model.getEstadoPago())
                .proximoCobro(model.getProximoCobro())
                .stripeSubscriptionId(model.getStripeSubscriptionId())
                .stripeCustomerId(model.getStripeCustomerId())
                .build();
    }

    private Suscripcion mapToDomain(SuscripcionEntity entity) {
        return Suscripcion.builder()
                .id(entity.getId())
                .negocioId(entity.getNegocioId())
                .plan(entity.getPlan())
                .estadoPago(entity.getEstadoPago())
                .proximoCobro(entity.getProximoCobro())
                .stripeSubscriptionId(entity.getStripeSubscriptionId())
                .stripeCustomerId(entity.getStripeCustomerId())
                .build();
    }
}
