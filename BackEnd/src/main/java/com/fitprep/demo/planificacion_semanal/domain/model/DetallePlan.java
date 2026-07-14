package com.fitprep.demo.planificacion_semanal.domain.model;

import com.fitprep.demo.catalogo_nutricional.domain.model.Plato;

/**
 * Modelo de dominio puro. Una comida programada dentro de un plan semanal.
 */
public class DetallePlan {

    private Long id;
    private Plato plato;
    private String diaSemana;
    private String tipoComida;
    private Integer cantidad;

    public DetallePlan() {
        this.cantidad = 1;
    }

    public double caloriasAportadas() {
        if (plato == null) {
            return 0.0;
        }
        return plato.caloriasPara(cantidad != null ? cantidad : 1);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Plato getPlato() { return plato; }
    public void setPlato(Plato plato) { this.plato = plato; }

    public String getDiaSemana() { return diaSemana; }
    public void setDiaSemana(String diaSemana) { this.diaSemana = diaSemana; }

    public String getTipoComida() { return tipoComida; }
    public void setTipoComida(String tipoComida) { this.tipoComida = tipoComida; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final DetallePlan d = new DetallePlan();
        public Builder id(Long v) { d.id = v; return this; }
        public Builder plato(Plato v) { d.plato = v; return this; }
        public Builder diaSemana(String v) { d.diaSemana = v; return this; }
        public Builder tipoComida(String v) { d.tipoComida = v; return this; }
        public Builder cantidad(Integer v) { d.cantidad = v; return this; }
        public DetallePlan build() { return d; }
    }
}
