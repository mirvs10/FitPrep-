package com.fitprep.demo.planificacion_semanal.infrastructure.adapter.out.persistence;

import com.fitprep.demo.catalogo_nutricional.infrastructure.adapter.out.persistence.PlatoEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "detalle_plan")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetallePlanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_semanal_id", nullable = false)
    private PlanSemanalEntity planSemanal;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "plato_id", nullable = false)
    private PlatoEntity plato;

    @Column(name = "dia_semana", nullable = false, length = 15)
    private String diaSemana;

    @Column(name = "tipo_comida", nullable = false, length = 20)
    private String tipoComida;

    @Column(name = "cantidad", nullable = false)
    @Builder.Default
    private Integer cantidad = 1;
}
