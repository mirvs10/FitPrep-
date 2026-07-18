package com.fitprep.demo.gestion_plataforma.domain.port.in;

import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import java.util.List;

public interface GestionarUsuariosUseCase {
    List<Usuario> listarTodosLosUsuarios();
    
    // In a real app we might have 'suspenderUsuario', but currently Usuario entity 
    // doesn't have a status/estado field (it's tied to Negocio for tenants).
    // Let's add an option to delete/suspend if possible, or just list for now.
    // We will add 'eliminarUsuario' as a basic admin function.
    void eliminarUsuario(Long usuarioId);
}
