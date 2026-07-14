package com.fitprep.demo.planificacion_semanal.application.service;

import com.fitprep.demo.catalogo_nutricional.domain.model.Plato;
import com.fitprep.demo.catalogo_nutricional.domain.port.out.PlatoRepositoryPort;
import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.domain.port.out.UsuarioRepositoryPort;
import com.fitprep.demo.planificacion_semanal.domain.model.DetallePlan;
import com.fitprep.demo.planificacion_semanal.domain.model.PlanSemanal;
import com.fitprep.demo.planificacion_semanal.domain.port.in.GestionarPlanSemanalUseCase;
import com.fitprep.demo.planificacion_semanal.domain.port.out.PlanSemanalRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Implementación del caso de uso de planificación. Depende de los puertos de
 * salida del propio contexto y de los de otros contextos (usuarios, catálogo),
 * siempre a través de sus interfaces de dominio.
 */
@Service
@Transactional(readOnly = true)
public class PlanSemanalService implements GestionarPlanSemanalUseCase {

    private final PlanSemanalRepositoryPort planSemanalRepository;
    private final UsuarioRepositoryPort usuarioRepository;
    private final PlatoRepositoryPort platoRepository;

    public PlanSemanalService(PlanSemanalRepositoryPort planSemanalRepository,
                              UsuarioRepositoryPort usuarioRepository,
                              PlatoRepositoryPort platoRepository) {
        this.planSemanalRepository = planSemanalRepository;
        this.usuarioRepository = usuarioRepository;
        this.platoRepository = platoRepository;
    }

    @Override
    @Transactional
    public PlanSemanal guardarPlan(CrearPlanCommand command) {
        String originalTenant = com.fitprep.demo.identidad_inquilino.TenantContext.getCurrentTenant();
        
        Usuario usuario;
        try {
            usuario = usuarioRepository.findById(command.usuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + command.usuarioId()));
        } finally {
            // Keep original tenant for user fetch
        }

        try {
            if (command.negocioId() != null) {
                com.fitprep.demo.identidad_inquilino.TenantContext.setCurrentTenant(String.valueOf(command.negocioId()));
            }

            PlanSemanal plan = PlanSemanal.builder()
                    .usuario(usuario)
                    .fechaInicioSemana(command.fechaInicioSemana())
                    .montoTotal(command.montoTotal())
                    .estadoPago("PAGADO") // Simular pago exitoso automático en MVP
                    .build();

            if (command.comidas() != null) {
                for (ComidaCommand comida : command.comidas()) {
                    Plato plato = platoRepository.findByIdCrossTenant(comida.platoId())
                            .orElseThrow(() -> new IllegalArgumentException("Plato no encontrado con ID: " + comida.platoId()));

                    DetallePlan detalle = DetallePlan.builder()
                            .plato(plato)
                            .diaSemana(comida.diaSemana())
                            .tipoComida(comida.tipoComida())
                            .cantidad(comida.cantidad() != null ? comida.cantidad() : 1)
                            .build();

                    plan.agregarComida(detalle);
                }
            }

            plan.calcularYValidarMacros();

            return planSemanalRepository.save(plan);
        } finally {
            if (originalTenant != null) {
                com.fitprep.demo.identidad_inquilino.TenantContext.setCurrentTenant(originalTenant);
            } else {
                com.fitprep.demo.identidad_inquilino.TenantContext.clear();
            }
        }
    }

    @Override
    public Optional<PlanSemanal> obtenerPlanPorId(Long id) {
        return planSemanalRepository.findById(id);
    }

    @Override
    public List<PlanSemanal> listarPlanesDeUsuario(Long usuarioId) {
        return planSemanalRepository.findByUsuarioId(usuarioId);
    }

    @Override
    public List<PlanSemanal> listarTodosLosPlanes() {
        return planSemanalRepository.findAllPlanes();
    }

    @Override
    @Transactional
    public PlanSemanal cambiarEstadoPago(Long planId, String nuevoEstado) {
        PlanSemanal plan = planSemanalRepository.findById(planId)
                .orElseThrow(() -> new IllegalArgumentException("Plan no encontrado con ID: " + planId));

        plan.cambiarEstadoPago(nuevoEstado);

        return planSemanalRepository.save(plan);
    }
}
