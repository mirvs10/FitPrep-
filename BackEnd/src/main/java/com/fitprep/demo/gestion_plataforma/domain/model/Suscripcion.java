package com.fitprep.demo.gestion_plataforma.domain.model;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class Suscripcion {
    private Long id;
    private Long negocioId;
    private String plan;
    private String estadoPago;
    private LocalDateTime proximoCobro;
    private String stripeSubscriptionId;
    private String stripeCustomerId;
}
