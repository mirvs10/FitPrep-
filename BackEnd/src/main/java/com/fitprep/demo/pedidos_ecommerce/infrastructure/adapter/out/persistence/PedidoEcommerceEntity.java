package com.fitprep.demo.pedidos_ecommerce.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.TenantId;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedido_ecommerce")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoEcommerceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @TenantId
    @Column(name = "negocio_id", nullable = false)
    private Integer negocioId;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "estado", nullable = false, length = 30)
    @Builder.Default
    private String estado = "PENDIENTE";

    @Column(name = "monto_total", nullable = false)
    private Double montoTotal;

    @Column(name = "direccion_entrega")
    private String direccionEntrega;

    @Column(name = "fecha_entrega")
    private LocalDate fechaEntrega;

    @Column(name = "fecha_creacion", nullable = false)
    @Builder.Default
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<LineaPedidoEntity> lineas = new ArrayList<>();

    public void addLinea(LineaPedidoEntity linea) {
        if (this.lineas == null) {
            this.lineas = new ArrayList<>();
        }
        this.lineas.add(linea);
        linea.setPedido(this);
    }
}
