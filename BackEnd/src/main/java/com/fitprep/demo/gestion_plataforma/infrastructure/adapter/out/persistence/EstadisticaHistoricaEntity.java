package com.fitprep.demo.gestion_plataforma.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "estadisticas_historicas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstadisticaHistoricaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 7)
    private String fecha; // Format: YYYY-MM

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal mrr;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal churnRate;

    @Column(nullable = false)
    private Integer nuevosNegocios;
}
