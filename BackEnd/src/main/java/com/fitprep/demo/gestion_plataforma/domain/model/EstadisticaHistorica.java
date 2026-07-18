package com.fitprep.demo.gestion_plataforma.domain.model;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class EstadisticaHistorica {
    private Long id;
    private String fecha;
    private BigDecimal mrr;
    private BigDecimal churnRate;
    private Integer nuevosNegocios;
}
