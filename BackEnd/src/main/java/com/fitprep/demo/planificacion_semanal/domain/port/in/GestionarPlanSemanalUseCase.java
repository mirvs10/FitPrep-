package com.fitprep.demo.planificacion_semanal.domain.port.in;

import com.fitprep.demo.planificacion_semanal.domain.model.PlanSemanal;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Puerto de entrada: casos de uso de planificación semanal.
 */
public interface GestionarPlanSemanalUseCase {

    PlanSemanal guardarPlan(CrearPlanCommand command);

    Optional<PlanSemanal> obtenerPlanPorId(Long id);

    /** Planes de un usuario, del más reciente al más antiguo. */
    List<PlanSemanal> listarPlanesDeUsuario(Long usuarioId);

    /** Todos los planes del negocio activo (filtrado por tenant). */
    List<PlanSemanal> listarTodosLosPlanes();

    /** Cambia el estado de pago de un plan (confirmar, pagar, cancelar). */
    PlanSemanal cambiarEstadoPago(Long planId, String nuevoEstado);

    /** Comando para crear un plan sin acoplar el caso de uso a DTOs web. */
    record CrearPlanCommand(
            Long usuarioId,
            Integer negocioId,
            LocalDate fechaInicioSemana,
            Double montoTotal,
            List<ComidaCommand> comidas
    ) {
    }

    record ComidaCommand(
            Long platoId,
            String diaSemana,
            String tipoComida,
            Integer cantidad
    ) {
    }
}
