package com.fitprep.demo.gestion_plataforma.domain.port.out;

import com.fitprep.demo.gestion_plataforma.domain.model.Suscripcion;
import java.util.List;
import java.util.Optional;

public interface SuscripcionPort {
    Suscripcion save(Suscripcion suscripcion);
    Optional<Suscripcion> findByNegocioId(Long negocioId);
    List<Suscripcion> findAll();
}
