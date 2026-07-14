package com.fitprep.demo.pedidos_ecommerce.application.service;

import com.fitprep.demo.catalogo_nutricional.domain.model.Plato;
import com.fitprep.demo.catalogo_nutricional.domain.port.out.PlatoRepositoryPort;
import com.fitprep.demo.pedidos_ecommerce.domain.model.LineaPedido;
import com.fitprep.demo.pedidos_ecommerce.domain.model.PedidoEcommerce;
import com.fitprep.demo.pedidos_ecommerce.domain.port.in.ConsultarPedidosUseCase;
import com.fitprep.demo.pedidos_ecommerce.domain.port.in.ProcesarCheckoutUseCase;
import com.fitprep.demo.pedidos_ecommerce.domain.port.out.PedidoRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PedidoEcommerceService implements ProcesarCheckoutUseCase, ConsultarPedidosUseCase {

    private final PedidoRepositoryPort pedidoRepositoryPort;
    private final PlatoRepositoryPort platoRepositoryPort;

    public PedidoEcommerceService(PedidoRepositoryPort pedidoRepositoryPort, PlatoRepositoryPort platoRepositoryPort) {
        this.pedidoRepositoryPort = pedidoRepositoryPort;
        this.platoRepositoryPort = platoRepositoryPort;
    }

    @Override
    @Transactional
    public PedidoEcommerce realizarCheckout(CheckoutCommand command) {
        if (command.items() == null || command.items().isEmpty()) {
            throw new IllegalArgumentException("El carrito no puede estar vacío.");
        }

        PedidoEcommerce pedido = new PedidoEcommerce();
        pedido.setUsuarioId(command.usuarioId());
        pedido.setDireccionEntrega(command.direccionEntrega());
        pedido.setFechaEntrega(command.fechaEntrega());

        Integer negocioId = null;

        for (ItemCheckout item : command.items()) {
            Plato plato = platoRepositoryPort.findById(item.platoId())
                    .orElseThrow(() -> new IllegalArgumentException("Plato no encontrado con ID: " + item.platoId()));
            
            if (negocioId == null) {
                negocioId = plato.getNegocioId();
            } else if (!negocioId.equals(plato.getNegocioId())) {
                throw new IllegalArgumentException("Todos los platos de un pedido deben pertenecer al mismo negocio.");
            }

            LineaPedido linea = new LineaPedido(
                    null,
                    plato.getId(),
                    plato.getNombre(),
                    item.cantidad(),
                    plato.getPrecio()
            );
            pedido.agregarLinea(linea);
        }

        pedido.setNegocioId(negocioId);
        pedido.setEstado("PAGADO"); // Automáticamente pagado para el MVP
        pedido.recalcularMontoTotal();

        return pedidoRepositoryPort.save(pedido);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoEcommerce> listarPedidosUsuario(Long usuarioId) {
        return pedidoRepositoryPort.findByUsuarioId(usuarioId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoEcommerce> listarPedidosNegocio(Integer negocioId) {
        return pedidoRepositoryPort.findByNegocioId(negocioId);
    }

    @Override
    @Transactional
    public PedidoEcommerce cambiarEstadoPedido(Long pedidoId, String nuevoEstado) {
        PedidoEcommerce pedido = pedidoRepositoryPort.findById(pedidoId)
                .orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado con ID: " + pedidoId));
        
        pedido.setEstado(nuevoEstado.toUpperCase());
        return pedidoRepositoryPort.save(pedido);
    }
}
