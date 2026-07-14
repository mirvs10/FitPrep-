package com.fitprep.demo.gestion_usuarios.domain.port.in;

import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;
import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;

/**
 * Puerto de entrada: casos de uso de autenticación y registro.
 */
public interface AutenticacionUseCase {

    ResultadoLogin login(String email, String password);

    Usuario registrarUsuario(RegistroUsuarioCommand command, String rol);

    Negocio registrarNegocio(RegistroNegocioCommand command);

    Usuario obtenerPerfilPorEmail(String email);

    /** Actualiza los objetivos nutricionales del usuario identificado por email. */
    Usuario actualizarObjetivos(String email, ActualizarObjetivosCommand command);

    /** Resultado de un login exitoso: token + usuario autenticado. */
    record ResultadoLogin(String token, Usuario usuario) {
    }

    /** Datos editables del perfil nutricional. */
    record ActualizarObjetivosCommand(
            String objetivoFitness,
            Double requerimientoKcal,
            Double reqProteinasG,
            Double reqCarbohidratosG,
            Double reqGrasasG
    ) {
    }

    /** Datos necesarios para registrar un usuario, sin acoplar a DTOs web. */
    record RegistroUsuarioCommand(
            String nombres,
            String apellidos,
            String email,
            String password,
            String objetivoFitness,
            Double requerimientoKcal,
            Double reqProteinasG,
            Double reqCarbohidratosG,
            Double reqGrasasG
    ) {
    }

    /** Datos necesarios para registrar un negocio. */
    record RegistroNegocioCommand(
            String nombreComercial,
            String slug,
            String ruc,
            String telefono
    ) {
    }
}
