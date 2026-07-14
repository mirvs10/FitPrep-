package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.in.web.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActualizarObjetivosRequest {
    private String objetivoFitness;
    private Double requerimientoKcal;
    private Double reqProteinasG;
    private Double reqCarbohidratosG;
    private Double reqGrasasG;
}
