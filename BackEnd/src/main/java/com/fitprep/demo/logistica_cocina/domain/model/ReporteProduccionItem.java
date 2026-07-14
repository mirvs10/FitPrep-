package com.fitprep.demo.logistica_cocina.domain.model;

/**
 * Modelo de dominio puro. Línea consolidada del reporte de producción:
 * cuántas unidades de un plato hay que cocinar para un día y tipo de comida.
 */
public class ReporteProduccionItem {

    private Long platoId;
    private String platoNombre;
    private String diaSemana;
    private String tipoComida;
    private Integer cantidadTotal;

    public ReporteProduccionItem() {
    }

    public ReporteProduccionItem(Long platoId, String platoNombre, String diaSemana,
                                 String tipoComida, Integer cantidadTotal) {
        this.platoId = platoId;
        this.platoNombre = platoNombre;
        this.diaSemana = diaSemana;
        this.tipoComida = tipoComida;
        this.cantidadTotal = cantidadTotal;
    }

    public void acumular(int cantidad) {
        this.cantidadTotal = (this.cantidadTotal != null ? this.cantidadTotal : 0) + cantidad;
    }

    public Long getPlatoId() { return platoId; }
    public void setPlatoId(Long platoId) { this.platoId = platoId; }

    public String getPlatoNombre() { return platoNombre; }
    public void setPlatoNombre(String platoNombre) { this.platoNombre = platoNombre; }

    public String getDiaSemana() { return diaSemana; }
    public void setDiaSemana(String diaSemana) { this.diaSemana = diaSemana; }

    public String getTipoComida() { return tipoComida; }
    public void setTipoComida(String tipoComida) { this.tipoComida = tipoComida; }

    public Integer getCantidadTotal() { return cantidadTotal; }
    public void setCantidadTotal(Integer cantidadTotal) { this.cantidadTotal = cantidadTotal; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final ReporteProduccionItem r = new ReporteProduccionItem();
        public Builder platoId(Long v) { r.platoId = v; return this; }
        public Builder platoNombre(String v) { r.platoNombre = v; return this; }
        public Builder diaSemana(String v) { r.diaSemana = v; return this; }
        public Builder tipoComida(String v) { r.tipoComida = v; return this; }
        public Builder cantidadTotal(Integer v) { r.cantidadTotal = v; return this; }
        public ReporteProduccionItem build() { return r; }
    }
}
