package com.fitprep.demo.pedidos_ecommerce.infrastructure.adapter.in.web.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class CheckoutRequest {
    private String direccionEntrega;
    private String fechaEntrega; // YYYY-MM-DD
    private List<ItemRequest> items;

    @Getter
    @Setter
    public static class ItemRequest {
        private Long platoId;
        private Integer cantidad;
    }
}
