package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.in.web;

import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.domain.port.in.GestionarClientesUseCase;
import com.fitprep.demo.gestion_usuarios.infrastructure.adapter.in.web.dto.ClienteResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Adaptador de entrada HTTP para la gestión de clientes del negocio.
 */
@RestController
@RequestMapping("/api/v1/usuarios")
public class ClienteController {

    private final GestionarClientesUseCase gestionarClientes;

    public ClienteController(GestionarClientesUseCase gestionarClientes) {
        this.gestionarClientes = gestionarClientes;
    }

    /** Lista los deportistas (clientes) del negocio autenticado. */
    @GetMapping
    public ResponseEntity<List<ClienteResponse>> listarClientes() {
        List<ClienteResponse> clientes = gestionarClientes.listarDeportistas().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(clientes);
    }

    private ClienteResponse mapToResponse(Usuario usuario) {
        return ClienteResponse.builder()
                .id(usuario.getId())
                .nombres(usuario.getNombres())
                .apellidos(usuario.getApellidos())
                .email(usuario.getEmail())
                .objetivoFitness(usuario.getObjetivoFitness())
                .requerimientoKcal(usuario.getRequerimientoKcal())
                .build();
    }
}
