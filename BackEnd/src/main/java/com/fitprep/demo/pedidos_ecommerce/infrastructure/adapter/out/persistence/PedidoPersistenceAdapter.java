package com.fitprep.demo.pedidos_ecommerce.infrastructure.adapter.out.persistence;

import com.fitprep.demo.catalogo_nutricional.domain.model.Plato;
import com.fitprep.demo.catalogo_nutricional.domain.port.out.PlatoRepositoryPort;
import com.fitprep.demo.pedidos_ecommerce.domain.model.LineaPedido;
import com.fitprep.demo.pedidos_ecommerce.domain.model.PedidoEcommerce;
import com.fitprep.demo.pedidos_ecommerce.domain.port.out.PedidoRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class PedidoPersistenceAdapter implements PedidoRepositoryPort {

    private final PedidoEcommerceJpaRepository repository;
    private final PlatoRepositoryPort platoRepositoryPort;

    public PedidoPersistenceAdapter(PedidoEcommerceJpaRepository repository, PlatoRepositoryPort platoRepositoryPort) {
        this.repository = repository;
        this.platoRepositoryPort = platoRepositoryPort;
    }

    @Override
    public PedidoEcommerce save(PedidoEcommerce domain) {
        PedidoEcommerceEntity entity = toEntity(domain);
        PedidoEcommerceEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<PedidoEcommerce> findById(Long id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public List<PedidoEcommerce> findByUsuarioId(Long usuarioId) {
        return repository.findByUsuarioId(usuarioId).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<PedidoEcommerce> findByNegocioId(Integer negocioId) {
        return repository.findByNegocioId(negocioId).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    private PedidoEcommerceEntity toEntity(PedidoEcommerce domain) {
        if (domain == null) {
            return null;
        }

        PedidoEcommerceEntity entity = PedidoEcommerceEntity.builder()
                .id(domain.getId())
                .negocioId(domain.getNegocioId())
                .usuarioId(domain.getUsuarioId())
                .estado(domain.getEstado())
                .montoTotal(domain.getMontoTotal())
                .direccionEntrega(domain.getDireccionEntrega())
                .fechaEntrega(domain.getFechaEntrega())
                .fechaCreacion(domain.getFechaCreacion())
                .build();

        if (domain.getLineas() != null) {
            for (LineaPedido line : domain.getLineas()) {
                LineaPedidoEntity lineEntity = LineaPedidoEntity.builder()
                        .id(line.getId())
                        .platoId(line.getPlatoId())
                        .cantidad(line.getCantidad())
                        .precioUnitario(line.getPrecioUnitario())
                        .build();
                entity.addLinea(lineEntity);
            }
        }

        return entity;
    }

    private PedidoEcommerce toDomain(PedidoEcommerceEntity entity) {
        if (entity == null) {
            return null;
        }

        List<LineaPedido> lineasDomain = entity.getLineas().stream()
                .map(lineEntity -> {
                    // Cargar nombre del plato dinámicamente para el modelo de dominio
                    String platoNombre = platoRepositoryPort.findById(lineEntity.getPlatoId())
                            .map(Plato::getNombre)
                            .orElse("Plato Descatalogado");

                    return new LineaPedido(
                            lineEntity.getId(),
                            lineEntity.getPlatoId(),
                            platoNombre,
                            lineEntity.getCantidad(),
                            lineEntity.getPrecioUnitario()
                    );
                })
                .collect(Collectors.toList());

        return new PedidoEcommerce(
                entity.getId(),
                entity.getNegocioId(),
                entity.getUsuarioId(),
                entity.getEstado(),
                entity.getMontoTotal(),
                entity.getDireccionEntrega(),
                entity.getFechaEntrega(),
                entity.getFechaCreacion(),
                lineasDomain
        );
    }
}
