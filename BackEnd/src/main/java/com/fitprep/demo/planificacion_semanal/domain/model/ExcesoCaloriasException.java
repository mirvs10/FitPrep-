package com.fitprep.demo.planificacion_semanal.domain.model;

public class ExcesoCaloriasException extends RuntimeException {
    public ExcesoCaloriasException(String message) {
        super(message);
    }
}
