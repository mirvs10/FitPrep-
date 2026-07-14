package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.TenantId;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @TenantId
    @Column(name = "negocio_id", nullable = false)
    private Integer negocioId;

    @Column(name = "nombres", nullable = false, length = 100)
    private String nombres;

    @Column(name = "apellidos", nullable = false, length = 100)
    private String apellidos;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "rol", nullable = false, length = 20)
    @Builder.Default
    private String rol = "ATHLETE";

    @Column(name = "objetivo_fitness", length = 50)
    private String objetivoFitness;

    @Column(name = "requerimiento_kcal")
    private Double requerimientoKcal;

    @Column(name = "req_proteinas_g")
    private Double reqProteinasG;

    @Column(name = "req_carbohidratos_g")
    private Double reqCarbohidratosG;

    @Column(name = "req_grasas_g")
    private Double reqGrasasG;
}
