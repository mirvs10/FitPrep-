package com.fitprep.demo.catalogo_nutricional.infrastructure.adapter.in.web;

import com.fitprep.demo.catalogo_nutricional.domain.model.Plato;
import com.fitprep.demo.catalogo_nutricional.domain.port.in.GestionarPlatoUseCase;
import com.fitprep.demo.catalogo_nutricional.infrastructure.adapter.in.web.dto.PlatoRequest;
import com.fitprep.demo.catalogo_nutricional.infrastructure.adapter.in.web.dto.PlatoResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Adaptador de entrada (driving adapter) HTTP. Depende del puerto de entrada,
 * no de la implementación del servicio.
 */
@RestController
@RequestMapping("/api/v1/platos")
public class PlatoController {

    private final GestionarPlatoUseCase gestionarPlato;

    public PlatoController(GestionarPlatoUseCase gestionarPlato) {
        this.gestionarPlato = gestionarPlato;
    }

    @GetMapping
    public ResponseEntity<List<PlatoResponse>> listarPlatos() {
        List<PlatoResponse> response = gestionarPlato.listarTodos().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<PlatoResponse>> listarPlatosCrossTenant() {
        List<PlatoResponse> response = gestionarPlato.listarTodosCrossTenant().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlatoResponse> obtenerPlato(@PathVariable Long id) {
        return gestionarPlato.obtenerPorId(id)
                .map(plato -> ResponseEntity.ok(mapToResponse(plato)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PlatoResponse> crearPlato(@RequestBody PlatoRequest request) {
        Plato guardado = gestionarPlato.guardar(mapToDomain(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(guardado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarPlato(@PathVariable Long id, @RequestBody PlatoRequest request) {
        try {
            Plato actualizado = gestionarPlato.actualizar(id, mapToDomain(request));
            return ResponseEntity.ok(mapToResponse(actualizado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPlato(@PathVariable Long id) {
        try {
            gestionarPlato.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private Plato mapToDomain(PlatoRequest request) {
        return Plato.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .precio(request.getPrecio())
                .calorias(request.getCalorias())
                .proteinas(request.getProteinas())
                .carbohidratos(request.getCarbohidratos())
                .grasas(request.getGrasas())
                .disponible(request.getDisponible() != null ? request.getDisponible() : true)
                .build();
    }

    private PlatoResponse mapToResponse(Plato plato) {
        return PlatoResponse.builder()
                .id(plato.getId())
                .negocioId(plato.getNegocioId())
                .nombre(plato.getNombre())
                .descripcion(plato.getDescripcion())
                .precio(plato.getPrecio())
                .calorias(plato.getCalorias())
                .proteinas(plato.getProteinas())
                .carbohidratos(plato.getCarbohidratos())
                .grasas(plato.getGrasas())
                .disponible(plato.getDisponible())
                .build();
    }
}
