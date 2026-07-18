package com.fitprep.demo.gestion_plataforma.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "suscripcion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuscripcionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "negocio_id", nullable = false)
    private Long negocioId;

    @Column(nullable = false, length = 50)
    private String plan;

    @Column(name = "estado_pago", nullable = false, length = 50)
    private String estadoPago; // 'AL_DIA', 'VENCIDO', 'FALLIDO'

    @Column(name = "proximo_cobro")
    private LocalDateTime proximoCobro;

    @Column(name = "stripe_subscription_id")
    private String stripeSubscriptionId;

    @Column(name = "stripe_customer_id")
    private String stripeCustomerId;
}
