package com.fitprep.demo.catalogo_nutricional.domain.model;

/**
 * Modelo de dominio puro. No conoce JPA, Spring ni ninguna tecnología de
 * infraestructura. Encapsula las reglas de negocio del plato.
 */
public class Plato {

    private Long id;
    private Integer negocioId;
    private String nombre;
    private String descripcion;
    private Double precio;
    private Double calorias;
    private Double proteinas;
    private Double carbohidratos;
    private Double grasas;
    private Boolean disponible;

    public Plato() {
        this.disponible = true;
    }

    public Plato(Long id, Integer negocioId, String nombre, String descripcion, Double precio,
                 Double calorias, Double proteinas, Double carbohidratos, Double grasas,
                 Boolean disponible) {
        this.id = id;
        this.negocioId = negocioId;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.calorias = calorias;
        this.proteinas = proteinas;
        this.carbohidratos = carbohidratos;
        this.grasas = grasas;
        this.disponible = disponible != null ? disponible : true;
    }

    /**
     * Regla de negocio: aplicar los nuevos datos sobre el plato existente,
     * preservando la identidad y el tenant.
     */
    public void actualizarDatos(Plato datosNuevos) {
        this.nombre = datosNuevos.nombre;
        this.descripcion = datosNuevos.descripcion;
        this.precio = datosNuevos.precio;
        this.calorias = datosNuevos.calorias;
        this.proteinas = datosNuevos.proteinas;
        this.carbohidratos = datosNuevos.carbohidratos;
        this.grasas = datosNuevos.grasas;
        this.disponible = datosNuevos.disponible != null ? datosNuevos.disponible : true;
    }

    /** Regla de negocio: descatalogar en lugar de eliminar. */
    public void descatalogar() {
        this.disponible = false;
    }

    /** Calorías aportadas por una cantidad dada de este plato. */
    public double caloriasPara(int cantidad) {
        return calorias != null ? calorias * cantidad : 0.0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getNegocioId() { return negocioId; }
    public void setNegocioId(Integer negocioId) { this.negocioId = negocioId; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public Double getCalorias() { return calorias; }
    public void setCalorias(Double calorias) { this.calorias = calorias; }

    public Double getProteinas() { return proteinas; }
    public void setProteinas(Double proteinas) { this.proteinas = proteinas; }

    public Double getCarbohidratos() { return carbohidratos; }
    public void setCarbohidratos(Double carbohidratos) { this.carbohidratos = carbohidratos; }

    public Double getGrasas() { return grasas; }
    public void setGrasas(Double grasas) { this.grasas = grasas; }

    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Plato p = new Plato();
        public Builder id(Long id) { p.id = id; return this; }
        public Builder negocioId(Integer v) { p.negocioId = v; return this; }
        public Builder nombre(String v) { p.nombre = v; return this; }
        public Builder descripcion(String v) { p.descripcion = v; return this; }
        public Builder precio(Double v) { p.precio = v; return this; }
        public Builder calorias(Double v) { p.calorias = v; return this; }
        public Builder proteinas(Double v) { p.proteinas = v; return this; }
        public Builder carbohidratos(Double v) { p.carbohidratos = v; return this; }
        public Builder grasas(Double v) { p.grasas = v; return this; }
        public Builder disponible(Boolean v) { p.disponible = v; return this; }
        public Plato build() { return p; }
    }
}
