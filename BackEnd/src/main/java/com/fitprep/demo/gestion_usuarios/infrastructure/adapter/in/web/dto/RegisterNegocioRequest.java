package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.in.web.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterNegocioRequest {
    private String nombreComercial;
    private String slug;
    private String ruc;
    private String telefono;
    private String email;
    private String password;
    private String plan;
    private String metodoPago;
}
