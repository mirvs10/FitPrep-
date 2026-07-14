package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "negocio")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NegocioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_comercial", nullable = false, length = 150)
    private String nombreComercial;

    @Column(name = "slug", nullable = false, unique = true, length = 50)
    private String slug;

    @Column(name = "ruc", nullable = false, unique = true, length = 11)
    private String ruc;

    @Column(name = "telefono", length = 15)
    private String telefono;

    @Column(name = "estado", nullable = false, length = 20)
    @Builder.Default
    private String estado = "ACTIVO";

    @Column(name = "plan", nullable = false, length = 50)
    @Builder.Default
    private String plan = "Starter";

    @Column(name = "ciudad", nullable = false, length = 100)
    @Builder.Default
    private String ciudad = "Madrid";

    @Column(name = "fecha_registro", nullable = false)
    @Builder.Default
    private LocalDateTime fechaRegistro = LocalDateTime.now();
}
