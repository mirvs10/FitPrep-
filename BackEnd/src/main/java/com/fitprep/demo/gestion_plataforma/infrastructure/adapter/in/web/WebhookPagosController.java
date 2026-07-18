package com.fitprep.demo.gestion_plataforma.infrastructure.adapter.in.web;

import com.fitprep.demo.gestion_plataforma.domain.port.in.GestionarSuscripcionesUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/webhooks/pagos")
public class WebhookPagosController {

    private final GestionarSuscripcionesUseCase gestionarSuscripcionesUseCase;

    public WebhookPagosController(GestionarSuscripcionesUseCase gestionarSuscripcionesUseCase) {
        this.gestionarSuscripcionesUseCase = gestionarSuscripcionesUseCase;
    }

    // Endpoint simulado que finge ser Stripe reportando un pago fallido
    @PostMapping("/simular-fallo/{negocioId}")
    public ResponseEntity<String> simularFalloPago(@PathVariable Long negocioId) {
        try {
            gestionarSuscripcionesUseCase.procesarWebhookPagoFallido(negocioId);
            return ResponseEntity.ok("Pago fallido procesado, negocio suspendido.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
