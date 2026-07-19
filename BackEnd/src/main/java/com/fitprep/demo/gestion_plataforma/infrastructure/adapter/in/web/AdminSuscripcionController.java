package com.fitprep.demo.gestion_plataforma.infrastructure.adapter.in.web;

import com.fitprep.demo.gestion_plataforma.domain.port.in.GestionarSuscripcionesUseCase;
import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;
import com.fitprep.demo.gestion_usuarios.infrastructure.adapter.in.web.dto.NegocioResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/negocios")
public class AdminSuscripcionController {

    private final GestionarSuscripcionesUseCase gestionarSuscripcionesUseCase;

    public AdminSuscripcionController(GestionarSuscripcionesUseCase gestionarSuscripcionesUseCase) {
        this.gestionarSuscripcionesUseCase = gestionarSuscripcionesUseCase;
    }

    @GetMapping
    public ResponseEntity<List<NegocioResponse>> getNegocios() {
        List<Negocio> negocios = gestionarSuscripcionesUseCase.listarTodosLosNegocios();
        List<NegocioResponse> response = negocios.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/aprobar")
    public ResponseEntity<NegocioResponse> aprobarNegocio(@PathVariable Long id) {
        Negocio negocio = gestionarSuscripcionesUseCase.cambiarEstadoNegocio(id, "ACTIVO");
        return ResponseEntity.ok(mapToResponse(negocio));
    }




    @PatchMapping("/{id}/suspender")
    public ResponseEntity<NegocioResponse> suspenderNegocio(@PathVariable Long id) {
        Negocio negocio = gestionarSuscripcionesUseCase.cambiarEstadoNegocio(id, "SUSPENDIDO");
        return ResponseEntity.ok(mapToResponse(negocio));
    }

    @PatchMapping("/{id}/plan")
    public ResponseEntity<NegocioResponse> cambiarPlan(@PathVariable Long id, @RequestParam String plan) {
        Negocio negocio = gestionarSuscripcionesUseCase.cambiarPlanNegocio(id, plan);
        return ResponseEntity.ok(mapToResponse(negocio));
    }

    private NegocioResponse mapToResponse(Negocio negocio) {
        return NegocioResponse.builder()
                .id(negocio.getId())
                .nombreComercial(negocio.getNombreComercial())
                .slug(negocio.getSlug())
                .ruc(negocio.getRuc())
                .telefono(negocio.getTelefono())
                .estado(negocio.getEstado())
                .plan(negocio.getPlan())
                .ciudad(negocio.getCiudad())
                .fechaRegistro(negocio.getFechaRegistro())
                .build();
    }
}
