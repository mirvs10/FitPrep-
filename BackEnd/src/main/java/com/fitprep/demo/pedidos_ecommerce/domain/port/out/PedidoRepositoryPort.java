package com.fitprep.demo.pedidos_ecommerce.domain.port.out;

import com.fitprep.demo.pedidos_ecommerce.domain.model.PedidoEcommerce;
import java.util.List;
import java.util.Optional;

public interface PedidoRepositoryPort {
    PedidoEcommerce save(PedidoEcommerce pedido);
    Optional<PedidoEcommerce> findById(Long id);
    List<PedidoEcommerce> findByUsuarioId(Long usuarioId);
    List<PedidoEcommerce> findByNegocioId(Integer negocioId);
}
