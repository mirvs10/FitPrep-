package com.fitprep.demo.gestion_plataforma.domain.port.in;

import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;
import java.util.List;

public interface GestionarSuscripcionesUseCase {
    List<Negocio> listarTodosLosNegocios();
    Negocio cambiarEstadoNegocio(Long negocioId, String nuevoEstado);
    Negocio cambiarPlanNegocio(Long negocioId, String nuevoPlan);
}
