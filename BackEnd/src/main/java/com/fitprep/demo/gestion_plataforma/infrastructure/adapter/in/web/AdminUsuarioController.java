package com.fitprep.demo.gestion_plataforma.infrastructure.adapter.in.web;

import com.fitprep.demo.gestion_plataforma.domain.port.in.GestionarUsuariosUseCase;
import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.infrastructure.adapter.in.web.dto.AuthResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/usuarios")
public class AdminUsuarioController {

    private final GestionarUsuariosUseCase gestionarUsuariosUseCase;

    public AdminUsuarioController(GestionarUsuariosUseCase gestionarUsuariosUseCase) {
        this.gestionarUsuariosUseCase = gestionarUsuariosUseCase;
    }

    @GetMapping
    public ResponseEntity<List<AuthResponse>> getUsuarios() {
        List<Usuario> usuarios = gestionarUsuariosUseCase.listarTodosLosUsuarios();
        List<AuthResponse> response = usuarios.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        gestionarUsuariosUseCase.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    private AuthResponse mapToResponse(Usuario usuario) {
        return AuthResponse.builder()
                .id(usuario.getId())
                .negocioId(usuario.getNegocioId())
                .nombres(usuario.getNombres())
                .apellidos(usuario.getApellidos())
                .email(usuario.getEmail())
                .rol(usuario.getRol())
                .objetivoFitness(usuario.getObjetivoFitness())
                .requerimientoKcal(usuario.getRequerimientoKcal())
                .reqProteinasG(usuario.getReqProteinasG())
                .reqCarbohidratosG(usuario.getReqCarbohidratosG())
                .reqGrasasG(usuario.getReqGrasasG())
                .build();
    }
}
