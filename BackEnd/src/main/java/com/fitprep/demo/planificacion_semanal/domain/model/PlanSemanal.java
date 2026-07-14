package com.fitprep.demo.planificacion_semanal.domain.model;

import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Raíz de agregado del plan semanal. Modelo de dominio puro: contiene la
 * regla de negocio de validación de macros y no conoce JPA ni Spring.
 */
public class PlanSemanal {

    private Long id;
    private Integer negocioId;
    private Usuario usuario;
    private LocalDate fechaInicioSemana;
    private String estadoPago;
    private Double montoTotal;
    private LocalDateTime fechaCreacion;
    private List<DetallePlan> comidas;

    public PlanSemanal() {
        this.estadoPago = "PENDIENTE";
        this.fechaCreacion = LocalDateTime.now();
        this.comidas = new ArrayList<>();
    }

    public void agregarComida(DetallePlan detalle) {
        if (this.comidas == null) {
            this.comidas = new ArrayList<>();
        }
        this.comidas.add(detalle);
    }

    /**
     * Regla de negocio: la suma de calorías de las comidas no puede superar el
     * requerimiento calórico del usuario.
     */
    public void calcularYValidarMacros() {
        if (comidas == null || usuario == null || usuario.getRequerimientoKcal() == null) {
            return;
        }

        double totalCalorias = comidas.stream()
                .filter(c -> c.getPlato() != null)
                .mapToDouble(DetallePlan::caloriasAportadas)
                .sum();

        double limiteCalorias = usuario.getRequerimientoKcal();

        if (totalCalorias > limiteCalorias) {
            throw new ExcesoCaloriasException(String.format(
                    "El plan semanal excede el límite de calorías permitido. Límite: %.2f kcal, Consumo: %.2f kcal.",
                    limiteCalorias, totalCalorias));
        }
    }

    /** Estados válidos del ciclo de pago del plan. */
    private static final java.util.Set<String> ESTADOS_VALIDOS =
            java.util.Set.of("PENDIENTE", "CONFIRMADO", "PAGADO", "CANCELADO");

    /**
     * Regla de negocio: transiciona el estado de pago validando que sea uno
     * permitido. Un plan cancelado o pagado es terminal y no puede cambiar.
     */
    public void cambiarEstadoPago(String nuevoEstado) {
        if (nuevoEstado == null || !ESTADOS_VALIDOS.contains(nuevoEstado)) {
            throw new IllegalArgumentException("Estado de pago no válido: " + nuevoEstado);
        }
        if ("PAGADO".equals(this.estadoPago) || "CANCELADO".equals(this.estadoPago)) {
            throw new IllegalStateException(
                    "El plan ya está en estado terminal (" + this.estadoPago + ") y no puede cambiarse.");
        }
        this.estadoPago = nuevoEstado;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getNegocioId() { return negocioId; }
    public void setNegocioId(Integer negocioId) { this.negocioId = negocioId; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public LocalDate getFechaInicioSemana() { return fechaInicioSemana; }
    public void setFechaInicioSemana(LocalDate fechaInicioSemana) { this.fechaInicioSemana = fechaInicioSemana; }

    public String getEstadoPago() { return estadoPago; }
    public void setEstadoPago(String estadoPago) { this.estadoPago = estadoPago; }

    public Double getMontoTotal() { return montoTotal; }
    public void setMontoTotal(Double montoTotal) { this.montoTotal = montoTotal; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public List<DetallePlan> getComidas() { return comidas; }
    public void setComidas(List<DetallePlan> comidas) { this.comidas = comidas; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final PlanSemanal p = new PlanSemanal();
        public Builder id(Long v) { p.id = v; return this; }
        public Builder negocioId(Integer v) { p.negocioId = v; return this; }
        public Builder usuario(Usuario v) { p.usuario = v; return this; }
        public Builder fechaInicioSemana(LocalDate v) { p.fechaInicioSemana = v; return this; }
        public Builder estadoPago(String v) { p.estadoPago = v; return this; }
        public Builder montoTotal(Double v) { p.montoTotal = v; return this; }
        public Builder fechaCreacion(LocalDateTime v) { p.fechaCreacion = v; return this; }
        public Builder comidas(List<DetallePlan> v) { p.comidas = v; return this; }
        public PlanSemanal build() { return p; }
    }
}
