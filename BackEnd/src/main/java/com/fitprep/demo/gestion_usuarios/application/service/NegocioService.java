package com.fitprep.demo.gestion_usuarios.application.service;

import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;
import com.fitprep.demo.gestion_usuarios.domain.port.in.GestionarNegocioUseCase;
import com.fitprep.demo.gestion_usuarios.domain.port.out.NegocioRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Caso de uso de gestión del negocio (tenant).
 */
@Service
@Transactional(readOnly = true)
public class NegocioService implements GestionarNegocioUseCase {

    private final NegocioRepositoryPort negocioRepository;

    public NegocioService(NegocioRepositoryPort negocioRepository) {
        this.negocioRepository = negocioRepository;
    }

    @Override
    public Negocio obtenerNegocio(Long negocioId) {
        return negocioRepository.findById(negocioId)
                .orElseThrow(() -> new IllegalArgumentException("Negocio no encontrado con ID: " + negocioId));
    }

    @Override
    @Transactional
    public Negocio actualizarNegocio(Long negocioId, ActualizarNegocioCommand command) {
        Negocio negocio = negocioRepository.findById(negocioId)
                .orElseThrow(() -> new IllegalArgumentException("Negocio no encontrado con ID: " + negocioId));

        negocio.actualizarDatos(command.nombreComercial(), command.telefono());

        return negocioRepository.save(negocio);
    }

    @Override
    public java.util.List<Negocio> listarTodosLosNegocios() {
        return negocioRepository.findAll().stream()
                .filter(n -> "ACTIVO".equals(n.getEstado()))
                .collect(java.util.stream.Collectors.toList());
    }
}
