package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.in.web.dto;

import lombok.*;

/**
 * Vista de un cliente (deportista) para el negocio. No expone datos sensibles
 * como el hash de contraseña.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteResponse {
    private Long id;
    private String nombres;
    private String apellidos;
    private String email;
    private String objetivoFitness;
    private Double requerimientoKcal;
}
