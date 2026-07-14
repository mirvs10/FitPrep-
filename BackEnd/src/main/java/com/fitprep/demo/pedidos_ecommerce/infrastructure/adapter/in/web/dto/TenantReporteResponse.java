package com.fitprep.demo.pedidos_ecommerce.infrastructure.adapter.in.web.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TenantReporteResponse {
    private Double ventasDelMes;
    private Integer totalPedidosMes;
    private String platoEstrella;
    private Integer cantidadPlatoEstrella;
}
