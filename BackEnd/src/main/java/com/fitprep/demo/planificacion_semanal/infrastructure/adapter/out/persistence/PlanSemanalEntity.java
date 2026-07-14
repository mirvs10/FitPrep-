package com.fitprep.demo.planificacion_semanal.infrastructure.adapter.out.persistence;

import com.fitprep.demo.gestion_usuarios.infrastructure.adapter.out.persistence.UsuarioEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.TenantId;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "plan_semanal")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanSemanalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @TenantId
    @Column(name = "negocio_id", nullable = false)
    private Integer negocioId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioEntity usuario;

    @Column(name = "fecha_inicio_semana", nullable = false)
    private LocalDate fechaInicioSemana;

    @Column(name = "estado_pago", nullable = false, length = 20)
    @Builder.Default
    private String estadoPago = "PENDIENTE";

    @Column(name = "monto_total", nullable = false)
    private Double montoTotal;

    @Column(name = "fecha_creacion", nullable = false)
    @Builder.Default
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @OneToMany(mappedBy = "planSemanal", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DetallePlanEntity> comidas = new ArrayList<>();
}
