package com.fitprep.demo.gestion_usuarios.application.service;

import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.domain.port.in.GestionarClientesUseCase;
import com.fitprep.demo.gestion_usuarios.domain.port.out.UsuarioRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Caso de uso de gestión de clientes. El filtrado por negocio (tenant) lo
 * aplica Hibernate automáticamente vía {@code @TenantId} en la entidad.
 */
@Service
@Transactional(readOnly = true)
public class ClienteService implements GestionarClientesUseCase {

    private static final String ROL_DEPORTISTA = "ATHLETE";

    private final UsuarioRepositoryPort usuarioRepository;

    public ClienteService(UsuarioRepositoryPort usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<Usuario> listarDeportistas() {
        return usuarioRepository.findByRol(ROL_DEPORTISTA);
    }
}
