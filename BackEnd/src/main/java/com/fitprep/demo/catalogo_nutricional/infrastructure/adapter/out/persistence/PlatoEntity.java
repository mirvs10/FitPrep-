package com.fitprep.demo.catalogo_nutricional.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.TenantId;

/**
 * Entidad de persistencia JPA. Vive en la capa de infraestructura y está
 * completamente separada del modelo de dominio {@code Plato}.
 */
@Entity
@Table(name = "plato")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlatoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @TenantId
    @Column(name = "negocio_id", nullable = false)
    private Integer negocioId;

    @Column(name = "nombre", nullable = false, length = 120)
    private String nombre;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "precio", nullable = false)
    private Double precio;

    @Column(name = "calorias", nullable = false)
    private Double calorias;

    @Column(name = "proteinas", nullable = false)
    private Double proteinas;

    @Column(name = "carbohidratos", nullable = false)
    private Double carbohidratos;

    @Column(name = "grasas", nullable = false)
    private Double grasas;

    @Column(name = "disponible", nullable = false)
    @Builder.Default
    private Boolean disponible = true;
}
