package com.fitprep.demo.pedidos_ecommerce.infrastructure.adapter.in.web.dto;

import java.util.List;

public class TenantDashboardResponse {
    private double ventasSemanales;
    private int pedidosActivos;
    private List<PedidoRecienteDto> pedidosRecientes;
    private List<PlatoTopDto> platosMasVendidos;
    private List<Double> historialIngresos;

    public static class PedidoRecienteDto {
        private String idPedido;
        private String cliente;
        private String estado;
        private String monto;
        private String colorBadge;

        // Getters and setters
        public String getIdPedido() { return idPedido; }
        public void setIdPedido(String idPedido) { this.idPedido = idPedido; }
        public String getCliente() { return cliente; }
        public void setCliente(String cliente) { this.cliente = cliente; }
        public String getEstado() { return estado; }
        public void setEstado(String estado) { this.estado = estado; }
        public String getMonto() { return monto; }
        public void setMonto(String monto) { this.monto = monto; }
        public String getColorBadge() { return colorBadge; }
        public void setColorBadge(String colorBadge) { this.colorBadge = colorBadge; }
    }

    public static class PlatoTopDto {
        private String nombre;
        private String unidades;
        private String porcentaje;

        // Getters and setters
        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }
        public String getUnidades() { return unidades; }
        public void setUnidades(String unidades) { this.unidades = unidades; }
        public String getPorcentaje() { return porcentaje; }
        public void setPorcentaje(String porcentaje) { this.porcentaje = porcentaje; }
    }

    // Getters and setters
    public double getVentasSemanales() { return ventasSemanales; }
    public void setVentasSemanales(double ventasSemanales) { this.ventasSemanales = ventasSemanales; }
    public int getPedidosActivos() { return pedidosActivos; }
    public void setPedidosActivos(int pedidosActivos) { this.pedidosActivos = pedidosActivos; }
    public List<PedidoRecienteDto> getPedidosRecientes() { return pedidosRecientes; }
    public void setPedidosRecientes(List<PedidoRecienteDto> pedidosRecientes) { this.pedidosRecientes = pedidosRecientes; }
    public List<PlatoTopDto> getPlatosMasVendidos() { return platosMasVendidos; }
    public void setPlatosMasVendidos(List<PlatoTopDto> platosMasVendidos) { this.platosMasVendidos = platosMasVendidos; }
    public List<Double> getHistorialIngresos() { return historialIngresos; }
    public void setHistorialIngresos(List<Double> historialIngresos) { this.historialIngresos = historialIngresos; }
}
