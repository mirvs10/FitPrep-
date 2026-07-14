package com.fitprep.demo.gestion_usuarios.domain.model;

import java.time.LocalDateTime;

/**
 * Modelo de dominio puro del negocio (tenant del SaaS).
 */
public class Negocio {

    private Long id;
    private String nombreComercial;
    private String slug;
    private String ruc;
    private String telefono;
    private String estado;
    private String plan;
    private String ciudad;
    private LocalDateTime fechaRegistro;

    public Negocio() {
        this.estado = "ACTIVO";
        this.plan = "Starter";
        this.ciudad = "Madrid";
        this.fechaRegistro = LocalDateTime.now();
    }

    /**
     * Regla de negocio: actualiza los datos editables del negocio. El slug y el
     * RUC son identificadores y no se modifican. El nombre comercial es
     * obligatorio.
     */
    public void actualizarDatos(String nombreComercial, String telefono) {
        if (nombreComercial == null || nombreComercial.isBlank()) {
            throw new IllegalArgumentException("El nombre comercial es obligatorio.");
        }
        this.nombreComercial = nombreComercial.trim();
        this.telefono = telefono;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombreComercial() { return nombreComercial; }
    public void setNombreComercial(String nombreComercial) { this.nombreComercial = nombreComercial; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getRuc() { return ruc; }
    public void setRuc(String ruc) { this.ruc = ruc; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }

    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }

    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Negocio n = new Negocio();
        public Builder id(Long v) { n.id = v; return this; }
        public Builder nombreComercial(String v) { n.nombreComercial = v; return this; }
        public Builder slug(String v) { n.slug = v; return this; }
        public Builder ruc(String v) { n.ruc = v; return this; }
        public Builder telefono(String v) { n.telefono = v; return this; }
        public Builder estado(String v) { n.estado = v; return this; }
        public Builder plan(String v) { n.plan = v; return this; }
        public Builder ciudad(String v) { n.ciudad = v; return this; }
        public Builder fechaRegistro(LocalDateTime v) { n.fechaRegistro = v; return this; }
        public Negocio build() { return n; }
    }
}
