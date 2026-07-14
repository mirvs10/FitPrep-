package com.fitprep.demo.pedidos_ecommerce.domain.port.in;

import com.fitprep.demo.pedidos_ecommerce.domain.model.PedidoEcommerce;
import java.time.LocalDate;
import java.util.List;

public interface ProcesarCheckoutUseCase {

    PedidoEcommerce realizarCheckout(CheckoutCommand command);

    record CheckoutCommand(
            Long usuarioId,
            String direccionEntrega,
            LocalDate fechaEntrega,
            List<ItemCheckout> items
    ) {}

    record ItemCheckout(
            Long platoId,
            int cantidad
    ) {}
}
