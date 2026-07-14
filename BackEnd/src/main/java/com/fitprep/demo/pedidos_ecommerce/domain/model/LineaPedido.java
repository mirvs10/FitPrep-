package com.fitprep.demo.pedidos_ecommerce.domain.model;

public class LineaPedido {
    private Long id;
    private Long platoId;
    private String platoNombre; // Para evitar consultas pesadas al pintar
    private int cantidad;
    private double precioUnitario;

    public LineaPedido() {
    }

    public LineaPedido(Long id, Long platoId, String platoNombre, int cantidad, double precioUnitario) {
        this.id = id;
        this.platoId = platoId;
        this.platoNombre = platoNombre;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPlatoId() { return platoId; }
    public void setPlatoId(Long platoId) { this.platoId = platoId; }

    public String getPlatoNombre() { return platoNombre; }
    public void setPlatoNombre(String platoNombre) { this.platoNombre = platoNombre; }

    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }

    public double getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(double precioUnitario) { this.precioUnitario = precioUnitario; }

    public double getSubtotal() {
        return this.cantidad * this.precioUnitario;
    }
}
