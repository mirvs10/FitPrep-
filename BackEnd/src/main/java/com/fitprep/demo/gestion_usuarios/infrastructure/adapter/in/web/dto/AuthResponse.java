package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.in.web.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private Long id;
    private Integer negocioId;
    private String nombres;
    private String apellidos;
    private String email;
    private String rol;
    private String objetivoFitness;
    private Double requerimientoKcal;
    private Double reqProteinasG;
    private Double reqCarbohidratosG;
    private Double reqGrasasG;
}
