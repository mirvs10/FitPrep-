package com.fitprep.demo.planificacion_semanal.infrastructure.adapter.in.web.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CambiarEstadoRequest {
    private String estadoPago;
}
