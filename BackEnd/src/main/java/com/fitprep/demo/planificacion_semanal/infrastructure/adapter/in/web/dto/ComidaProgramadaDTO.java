package com.fitprep.demo.planificacion_semanal.infrastructure.adapter.in.web.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComidaProgramadaDTO {
    private Long platoId;
    private String diaSemana;
    private String tipoComida;
    @Builder.Default
    private Integer cantidad = 1;
}
