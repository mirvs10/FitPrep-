package com.fitprep.demo.catalogo_nutricional.application.service;

import com.fitprep.demo.catalogo_nutricional.domain.model.Plato;
import com.fitprep.demo.catalogo_nutricional.domain.port.in.GestionarPlatoUseCase;
import com.fitprep.demo.catalogo_nutricional.domain.port.out.PlatoRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Implementación del caso de uso. Orquesta el dominio y depende únicamente
 * del puerto de salida, nunca de una tecnología de persistencia concreta.
 */
@Service
@Transactional(readOnly = true)
public class PlatoService implements GestionarPlatoUseCase {

    private final PlatoRepositoryPort platoRepository;

    public PlatoService(PlatoRepositoryPort platoRepository) {
        this.platoRepository = platoRepository;
    }

    @Override
    public List<Plato> listarTodos() {
        return platoRepository.findAll();
    }

    @Override
    public List<Plato> listarTodosCrossTenant() {
        return platoRepository.findAllCrossTenant();
    }

    @Override
    public Optional<Plato> obtenerPorId(Long id) {
        return platoRepository.findById(id);
    }

    @Override
    @Transactional
    public Plato guardar(Plato plato) {
        return platoRepository.save(plato);
    }

    @Override
    @Transactional
    public Plato actualizar(Long id, Plato datosNuevos) {
        Plato platoExistente = platoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Plato no encontrado con ID: " + id));

        platoExistente.actualizarDatos(datosNuevos);

        return platoRepository.save(platoExistente);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        Plato plato = platoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Plato no encontrado con ID: " + id));

        platoRepository.delete(plato);
    }
}
