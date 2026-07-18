package com.fitprep.demo.gestion_plataforma.application.service;

import com.fitprep.demo.gestion_plataforma.domain.model.Suscripcion;
import com.fitprep.demo.gestion_plataforma.domain.port.out.SuscripcionPort;
import com.fitprep.demo.gestion_usuarios.domain.event.NegocioRegistradoEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
public class NegocioRegistradoEventListener {

    private final SuscripcionPort suscripcionPort;

    public NegocioRegistradoEventListener(SuscripcionPort suscripcionPort) {
        this.suscripcionPort = suscripcionPort;
    }

    @EventListener
    @Transactional
    public void onNegocioRegistrado(NegocioRegistradoEvent event) {
        Suscripcion suscripcion = Suscripcion.builder()
                .negocioId(event.negocioId())
                .plan(event.plan())
                .estadoPago("Tarjeta".equalsIgnoreCase(event.metodoPago()) ? "AL_DIA" : "AL_DIA") // Podría depender del procesador
                .proximoCobro(LocalDateTime.now().plusMonths(1))
                .build();
        suscripcionPort.save(suscripcion);
    }
}
