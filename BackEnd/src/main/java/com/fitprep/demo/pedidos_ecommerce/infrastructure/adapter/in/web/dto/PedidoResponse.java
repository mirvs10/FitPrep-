package com.fitprep.demo.pedidos_ecommerce.infrastructure.adapter.in.web.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoResponse {
    private Long id;
    private Integer negocioId;
    private Long usuarioId;
    private String estado;
    private double montoTotal;
    private String direccionEntrega;
    private LocalDate fechaEntrega;
    private LocalDateTime fechaCreacion;
    private List<LineaResponse> lineas;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LineaResponse {
        private Long id;
        private Long platoId;
        private String platoNombre;
        private int cantidad;
        private double precioUnitario;
        private double subtotal;
    }
}
