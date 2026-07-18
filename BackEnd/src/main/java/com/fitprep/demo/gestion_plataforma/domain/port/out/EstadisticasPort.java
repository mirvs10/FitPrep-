package com.fitprep.demo.gestion_plataforma.domain.port.out;

import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;
import java.util.List;

public interface EstadisticasPort {
    long countNegociosActivos();
    long countUsuariosTotales();
    List<Negocio> findNegociosNuevos();
    List<Negocio> findAllNegocios();
    List<com.fitprep.demo.gestion_plataforma.domain.model.EstadisticaHistorica> getHistoricos();
}
