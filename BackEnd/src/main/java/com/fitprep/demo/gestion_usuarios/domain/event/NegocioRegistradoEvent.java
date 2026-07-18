package com.fitprep.demo.gestion_usuarios.domain.event;

public record NegocioRegistradoEvent(
        Long negocioId,
        String plan,
        String metodoPago
) {
}
