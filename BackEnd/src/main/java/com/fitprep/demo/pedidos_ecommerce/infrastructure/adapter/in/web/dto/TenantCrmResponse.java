package com.fitprep.demo.pedidos_ecommerce.infrastructure.adapter.in.web.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TenantCrmResponse {
    private Long usuarioId;
    private String nombre;
    private String email;
    private String objetivo; // Volumen, Definición, etc.
    private Integer totalPedidos;
    private Double ltv; // Dinero gastado (Life Time Value)
    private String estado;
}
