package com.fitprep.demo.planificacion_semanal.infrastructure.adapter.in.web.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanSemanalResponse {
    private Long id;
    private Integer negocioId;
    private Long usuarioId;
    private String usuarioNombre;
    private LocalDate fechaInicioSemana;
    private String estadoPago;
    private Double montoTotal;
    private List<ComidaProgramadaDTO> comidas;
}
