package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.in.web.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NegocioResponse {
    private Long id;
    private String nombreComercial;
    private String slug;
    private String ruc;
    private String telefono;
    private String estado;
    private String plan;
    private String ciudad;
    private LocalDateTime fechaRegistro;
}
