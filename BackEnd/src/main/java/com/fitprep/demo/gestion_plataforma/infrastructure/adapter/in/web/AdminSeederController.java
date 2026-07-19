package com.fitprep.demo.gestion_plataforma.infrastructure.adapter.in.web;

import com.fitprep.demo.gestion_plataforma.application.service.DatabaseSeederService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminSeederController {

    private final DatabaseSeederService databaseSeederService;

    public AdminSeederController(DatabaseSeederService databaseSeederService) {
        this.databaseSeederService = databaseSeederService;
    }

    // Permitido públicamente (o asegurar detrás de ADMIN)
    @PostMapping("/seed")
    public ResponseEntity<String> seedDatabase() {
        try {
            databaseSeederService.seedDatabase();
            return ResponseEntity.ok("{\"message\": \"Base de datos re-sembrada con éxito.\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
