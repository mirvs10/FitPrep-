package com.fitprep.demo.pedidos_ecommerce.domain.port.in;

import com.fitprep.demo.pedidos_ecommerce.domain.model.PedidoEcommerce;
import java.util.List;

public interface ConsultarPedidosUseCase {
    List<PedidoEcommerce> listarPedidosUsuario(Long usuarioId);
    List<PedidoEcommerce> listarPedidosNegocio(Integer negocioId);
    PedidoEcommerce cambiarEstadoPedido(Long pedidoId, String nuevoEstado);
}
