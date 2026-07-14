package com.fitprep.demo.gestion_plataforma.application.service;

import com.fitprep.demo.gestion_plataforma.domain.model.EstadisticasPlataforma;
import com.fitprep.demo.gestion_plataforma.domain.port.in.ConsultarEstadisticasUseCase;
import com.fitprep.demo.gestion_plataforma.domain.port.in.GestionarSuscripcionesUseCase;
import com.fitprep.demo.gestion_plataforma.domain.port.out.EstadisticasPort;
import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;
import com.fitprep.demo.gestion_usuarios.domain.port.out.NegocioRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GestionPlataformaService implements ConsultarEstadisticasUseCase, GestionarSuscripcionesUseCase {

    private final EstadisticasPort estadisticasPort;
    private final NegocioRepositoryPort negocioRepositoryPort;

    public GestionPlataformaService(EstadisticasPort estadisticasPort, NegocioRepositoryPort negocioRepositoryPort) {
        this.estadisticasPort = estadisticasPort;
        this.negocioRepositoryPort = negocioRepositoryPort;
    }

    @Override
    @Transactional(readOnly = true)
    public EstadisticasPlataforma obtenerEstadisticasGlobales() {
        long activos = estadisticasPort.countNegociosActivos();
        long usuarios = estadisticasPort.countUsuariosTotales();
        List<Negocio> todos = estadisticasPort.findAllNegocios();
        List<Negocio> nuevos = estadisticasPort.findNegociosNuevos();

        // Calcular MRR dinámicamente según el plan de cada negocio activo
        double mrr = 0.0;
        for (Negocio n : todos) {
            if ("ACTIVO".equalsIgnoreCase(n.getEstado())) {
                if ("Growth".equalsIgnoreCase(n.getPlan())) {
                    mrr += 49.0;
                } else if ("Scale".equalsIgnoreCase(n.getPlan())) {
                    mrr += 149.0;
                }
            }
        }

        double churn = 2.4; // Mock de valor bajo histórico constante para la vista

        return new EstadisticasPlataforma(activos, usuarios, mrr, churn, nuevos);
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
        return negocioRepositoryPort.save(negocio);
    }
}
