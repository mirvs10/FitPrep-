package com.fitprep.demo.gestion_plataforma.infrastructure.adapter.in.web;

import com.fitprep.demo.gestion_plataforma.domain.model.Suscripcion;
import com.fitprep.demo.gestion_plataforma.domain.port.in.GestionarSuscripcionesUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/suscripciones")
public class AdminSuscripcionesListController {

    private final GestionarSuscripcionesUseCase gestionarSuscripcionesUseCase;

    public AdminSuscripcionesListController(GestionarSuscripcionesUseCase gestionarSuscripcionesUseCase) {
        this.gestionarSuscripcionesUseCase = gestionarSuscripcionesUseCase;
    }

    @GetMapping
    public ResponseEntity<List<Suscripcion>> getSuscripciones() {
        return ResponseEntity.ok(gestionarSuscripcionesUseCase.listarSuscripciones());
    }
}
