package com.fitprep.demo.catalogo_nutricional.domain.port.in;

import com.fitprep.demo.catalogo_nutricional.domain.model.Plato;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de entrada (driving port). Define los casos de uso del catálogo
 * nutricional expuestos hacia los adaptadores primarios (web, etc.).
 */
public interface GestionarPlatoUseCase {

    List<Plato> listarTodos();
    
    List<Plato> listarTodosCrossTenant();

    Optional<Plato> obtenerPorId(Long id);

    Plato guardar(Plato plato);

    Plato actualizar(Long id, Plato datosNuevos);

    void eliminar(Long id);
}
