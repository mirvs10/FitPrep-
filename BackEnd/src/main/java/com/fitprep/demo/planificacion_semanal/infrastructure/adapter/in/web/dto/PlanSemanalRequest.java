package com.fitprep.demo.planificacion_semanal.infrastructure.adapter.in.web.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanSemanalRequest {
    private Long usuarioId;
    private Integer negocioId;
    private LocalDate fechaInicioSemana;
    private Double montoTotal;
    private List<ComidaProgramadaDTO> comidas;
}
