package com.fitprep.demo.logistica_cocina.infrastructure.adapter.in.web.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReporteProduccionResponse {
    private Long platoId;
    private String platoNombre;
    private String diaSemana;
    private String tipoComida;
    private Integer cantidadTotal;
}
