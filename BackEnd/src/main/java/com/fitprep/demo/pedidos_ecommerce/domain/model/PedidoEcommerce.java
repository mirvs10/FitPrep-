package com.fitprep.demo.pedidos_ecommerce.domain.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class PedidoEcommerce {
    private Long id;
    private Integer negocioId;
    private Long usuarioId;
    private String estado;
    private double montoTotal;
    private String direccionEntrega;
    private LocalDate fechaEntrega;
    private LocalDateTime fechaCreacion;
    private List<LineaPedido> lineas = new ArrayList<>();

    public PedidoEcommerce() {
        this.estado = "PENDIENTE";
        this.fechaCreacion = LocalDateTime.now();
    }

    public PedidoEcommerce(Long id, Integer negocioId, Long usuarioId, String estado, double montoTotal,
                           String direccionEntrega, LocalDate fechaEntrega, LocalDateTime fechaCreacion,
                           List<LineaPedido> lineas) {
        this.id = id;
        this.negocioId = negocioId;
        this.usuarioId = usuarioId;
        this.estado = estado;
        this.montoTotal = montoTotal;
        this.direccionEntrega = direccionEntrega;
        this.fechaEntrega = fechaEntrega;
        this.fechaCreacion = fechaCreacion;
        this.lineas = lineas != null ? lineas : new ArrayList<>();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getNegocioId() { return negocioId; }
    public void setNegocioId(Integer negocioId) { this.negocioId = negocioId; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public double getMontoTotal() { return montoTotal; }
    public void setMontoTotal(double montoTotal) { this.montoTotal = montoTotal; }

    public String getDireccionEntrega() { return direccionEntrega; }
    public void setDireccionEntrega(String direccionEntrega) { this.direccionEntrega = direccionEntrega; }

    public LocalDate getFechaEntrega() { return fechaEntrega; }
    public void setFechaEntrega(LocalDate fechaEntrega) { this.fechaEntrega = fechaEntrega; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public List<LineaPedido> getLineas() { return lineas; }
    public void setLineas(List<LineaPedido> lineas) { this.lineas = lineas; }

    public void agregarLinea(LineaPedido linea) {
        this.lineas.add(linea);
        recalcularMontoTotal();
    }

    public void recalcularMontoTotal() {
        this.montoTotal = this.lineas.stream()
                .mapToDouble(LineaPedido::getSubtotal)
                .sum();
    }
}
