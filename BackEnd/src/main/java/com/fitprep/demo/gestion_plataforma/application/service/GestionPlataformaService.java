package com.fitprep.demo.gestion_plataforma.application.service;

import com.fitprep.demo.gestion_plataforma.domain.model.EstadisticasPlataforma;
import com.fitprep.demo.gestion_plataforma.domain.port.in.ConsultarEstadisticasUseCase;
import com.fitprep.demo.gestion_plataforma.domain.port.in.GestionarSuscripcionesUseCase;
import com.fitprep.demo.gestion_plataforma.domain.port.in.GestionarUsuariosUseCase;
import com.fitprep.demo.gestion_plataforma.domain.port.out.EstadisticasPort;
import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;
import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.domain.port.out.NegocioRepositoryPort;
import com.fitprep.demo.gestion_usuarios.domain.port.out.UsuarioRepositoryPort;
import com.fitprep.demo.gestion_plataforma.domain.port.out.SuscripcionPort;
import com.fitprep.demo.gestion_plataforma.domain.model.Suscripcion;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GestionPlataformaService implements ConsultarEstadisticasUseCase, GestionarSuscripcionesUseCase, GestionarUsuariosUseCase {

    private final EstadisticasPort estadisticasPort;
    private final NegocioRepositoryPort negocioRepositoryPort;
    private final UsuarioRepositoryPort usuarioRepositoryPort;
    private final SuscripcionPort suscripcionPort;

    public GestionPlataformaService(EstadisticasPort estadisticasPort, 
                                    NegocioRepositoryPort negocioRepositoryPort, 
                                    UsuarioRepositoryPort usuarioRepositoryPort,
                                    SuscripcionPort suscripcionPort) {
        this.estadisticasPort = estadisticasPort;
        this.negocioRepositoryPort = negocioRepositoryPort;
        this.usuarioRepositoryPort = usuarioRepositoryPort;
        this.suscripcionPort = suscripcionPort;
    }

    @Override
    @Transactional(readOnly = true)
    public EstadisticasPlataforma obtenerEstadisticasGlobales() {
        long activos = estadisticasPort.countNegociosActivos();
        long usuarios = estadisticasPort.countUsuariosTotales();
        List<Negocio> todos = estadisticasPort.findAllNegocios();
        List<Negocio> nuevos = estadisticasPort.findNegociosNuevos();

        double mrr = 0.0;
        java.util.Map<String, Long> distribucionPlanes = new java.util.HashMap<>();
        distribucionPlanes.put("Starter", 0L);
        distribucionPlanes.put("Growth", 0L);
        distribucionPlanes.put("Scale", 0L);

        for (Negocio n : todos) {
            if ("ACTIVO".equalsIgnoreCase(n.getEstado())) {
                String plan = n.getPlan() != null ? n.getPlan() : "Starter";
                distribucionPlanes.put(plan, distribucionPlanes.getOrDefault(plan, 0L) + 1L);

                if ("Growth".equalsIgnoreCase(plan)) {
                    mrr += 49.0;
                } else if ("Scale".equalsIgnoreCase(plan)) {
                    mrr += 149.0;
                }
            }
        }

        double churn = 0.0;
        if (!todos.isEmpty()) {
            long inactivos = todos.stream().filter(n -> "INACTIVO".equalsIgnoreCase(n.getEstado()) || "CANCELADO".equalsIgnoreCase(n.getEstado())).count();
            churn = ((double) inactivos / todos.size()) * 100.0;
            churn = Math.round(churn * 10.0) / 10.0;
        }
        
        return new EstadisticasPlataforma(activos, usuarios, mrr, churn, nuevos, distribucionPlanes);
    }

    @Override
    @Transactional(readOnly = true)
    public List<com.fitprep.demo.gestion_plataforma.domain.model.EstadisticaHistorica> obtenerHistorico() {
        return estadisticasPort.getHistoricos();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Negocio> listarTodosLosNegocios() {
        return estadisticasPort.findAllNegocios();
    }

    @Override
    @Transactional
    public Negocio cambiarEstadoNegocio(Long negocioId, String nuevoEstado) {
        Negocio negocio = negocioRepositoryPort.findById(negocioId)
                .orElseThrow(() -> new IllegalArgumentException("Negocio no encontrado con ID: " + negocioId));
        negocio.setEstado(nuevoEstado.toUpperCase());
        return negocioRepositoryPort.save(negocio);
    }

    @Override
    @Transactional
    public Negocio cambiarPlanNegocio(Long negocioId, String nuevoPlan) {
        Negocio negocio = negocioRepositoryPort.findById(negocioId)
                .orElseThrow(() -> new IllegalArgumentException("Negocio no encontrado con ID: " + negocioId));
        negocio.setPlan(nuevoPlan);
        Negocio savedNegocio = negocioRepositoryPort.save(negocio);

        // Actualizar o crear suscripción
        Suscripcion suscripcion = suscripcionPort.findByNegocioId(negocioId).orElse(
                Suscripcion.builder()
                        .negocioId(negocioId)
                        .estadoPago("AL_DIA")
                        .proximoCobro(java.time.LocalDateTime.now().plusMonths(1))
                        .build()
        );
        suscripcion.setPlan(nuevoPlan);
        suscripcionPort.save(suscripcion);

        return savedNegocio;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> listarTodosLosUsuarios() {
        return usuarioRepositoryPort.findAllIgnoringTenant();
    }

    @Override
    @Transactional
    public void eliminarUsuario(Long usuarioId) {
        usuarioRepositoryPort.deleteById(usuarioId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Suscripcion> listarSuscripciones() {
        return suscripcionPort.findAll();
    }

    @Override
    @Transactional
    public void procesarWebhookPagoFallido(Long negocioId) {
        // En un caso real, esto se buscaría por Stripe Customer ID
        Suscripcion suscripcion = suscripcionPort.findByNegocioId(negocioId)
                .orElseThrow(() -> new IllegalArgumentException("Suscripción no encontrada para el negocio: " + negocioId));
        
        suscripcion.setEstadoPago("FALLIDO");
        suscripcionPort.save(suscripcion);

        // Automáticamente suspender el negocio si el pago falla
        Negocio negocio = negocioRepositoryPort.findById(negocioId).orElse(null);
        if (negocio != null) {
            negocio.setEstado("SUSPENDIDO");
            negocioRepositoryPort.save(negocio);
        }
    }
}
