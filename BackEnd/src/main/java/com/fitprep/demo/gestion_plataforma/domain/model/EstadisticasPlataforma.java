package com.fitprep.demo.gestion_plataforma.domain.model;

import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;
import java.util.List;

public class EstadisticasPlataforma {

    private long negociosActivos;
    private long usuariosTotales;
    private double mrr;
    private double churn;
    private List<Negocio> negociosNuevos;

    public EstadisticasPlataforma() {
    }

    public EstadisticasPlataforma(long negociosActivos, long usuariosTotales, double mrr, double churn, List<Negocio> negociosNuevos) {
        this.negociosActivos = negociosActivos;
        this.usuariosTotales = usuariosTotales;
        this.mrr = mrr;
        this.churn = churn;
        this.negociosNuevos = negociosNuevos;
    }

    public long getNegociosActivos() { return negociosActivos; }
    public void setNegociosActivos(long negociosActivos) { this.negociosActivos = negociosActivos; }

    public long getUsuariosTotales() { return usuariosTotales; }
    public void setUsuariosTotales(long usuariosTotales) { this.usuariosTotales = usuariosTotales; }

    public double getMrr() { return mrr; }
    public void setMrr(double mrr) { this.mrr = mrr; }

    public double getChurn() { return churn; }
    public void setChurn(double churn) { this.churn = churn; }

    public List<Negocio> getNegociosNuevos() { return negociosNuevos; }
    public void setNegociosNuevos(List<Negocio> negociosNuevos) { this.negociosNuevos = negociosNuevos; }
}
