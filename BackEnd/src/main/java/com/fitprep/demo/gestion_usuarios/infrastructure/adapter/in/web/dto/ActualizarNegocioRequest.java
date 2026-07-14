package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.in.web.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActualizarNegocioRequest {
    private String nombreComercial;
    private String telefono;
}
