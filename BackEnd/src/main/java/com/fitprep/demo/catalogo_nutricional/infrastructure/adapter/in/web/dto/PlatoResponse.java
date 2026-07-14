package com.fitprep.demo.catalogo_nutricional.infrastructure.adapter.in.web.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlatoResponse {
    private Long id;
    private Integer negocioId;
    private String nombre;
    private String descripcion;
    private Double precio;
    private Double calorias;
    private Double proteinas;
    private Double carbohidratos;
    private Double grasas;
    private Boolean disponible;
}
