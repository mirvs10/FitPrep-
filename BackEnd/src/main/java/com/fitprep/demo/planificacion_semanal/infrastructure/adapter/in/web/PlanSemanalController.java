package com.fitprep.demo.planificacion_semanal.infrastructure.adapter.in.web;

import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.domain.port.in.AutenticacionUseCase;
import com.fitprep.demo.identidad_inquilino.TenantContext;
import com.fitprep.demo.pedidos_ecommerce.domain.port.in.ProcesarCheckoutUseCase;
import com.fitprep.demo.pedidos_ecommerce.domain.port.in.ProcesarCheckoutUseCase.CheckoutCommand;
import com.fitprep.demo.pedidos_ecommerce.domain.port.in.ProcesarCheckoutUseCase.ItemCheckout;
import com.fitprep.demo.planificacion_semanal.domain.model.DetallePlan;
import com.fitprep.demo.planificacion_semanal.domain.model.ExcesoCaloriasException;
import com.fitprep.demo.planificacion_semanal.domain.model.PlanSemanal;
import com.fitprep.demo.planificacion_semanal.domain.port.in.GestionarPlanSemanalUseCase;
import com.fitprep.demo.planificacion_semanal.domain.port.in.GestionarPlanSemanalUseCase.ComidaCommand;
import com.fitprep.demo.planificacion_semanal.domain.port.in.GestionarPlanSemanalUseCase.CrearPlanCommand;
import com.fitprep.demo.planificacion_semanal.infrastructure.adapter.in.web.dto.CambiarEstadoRequest;
import com.fitprep.demo.planificacion_semanal.infrastructure.adapter.in.web.dto.ComidaProgramadaDTO;
import com.fitprep.demo.planificacion_semanal.infrastructure.adapter.in.web.dto.PlanSemanalRequest;
import com.fitprep.demo.planificacion_semanal.infrastructure.adapter.in.web.dto.PlanSemanalResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/planes")
public class PlanSemanalController {

    private final GestionarPlanSemanalUseCase gestionarPlan;
    private final AutenticacionUseCase autenticacion;
    private final ProcesarCheckoutUseCase procesarCheckout;

    public PlanSemanalController(GestionarPlanSemanalUseCase gestionarPlan,
                                 AutenticacionUseCase autenticacion,
                                 ProcesarCheckoutUseCase procesarCheckout) {
        this.gestionarPlan = gestionarPlan;
        this.autenticacion = autenticacion;
        this.procesarCheckout = procesarCheckout;
    }

    @PostMapping
    public ResponseEntity<?> guardarPlan(@RequestBody PlanSemanalRequest request) {
        PlanSemanal guardado = null;
        try {
            List<ComidaCommand> comidas = request.getComidas() == null
                    ? List.of()
                    : request.getComidas().stream()
                        .map(dto -> new ComidaCommand(
                                dto.getPlatoId(),
                                dto.getDiaSemana(),
                                dto.getTipoComida(),
                                dto.getCantidad() != null ? dto.getCantidad() : 1))
                        .collect(Collectors.toList());

            CrearPlanCommand command = new CrearPlanCommand(
                    request.getUsuarioId(),
                    request.getNegocioId(),
                    request.getFechaInicioSemana(),
                    request.getMontoTotal(),
                    comidas
            );
            
            try {
                guardado = gestionarPlan.guardarPlan(command);
                
                if (request.getNegocioId() != null) {
                    TenantContext.setCurrentTenant(String.valueOf(request.getNegocioId()));
                    List<ItemCheckout> items = request.getComidas().stream()
                            .map(c -> new ItemCheckout(c.getPlatoId(), c.getCantidad() != null ? c.getCantidad() : 1))
                            .collect(Collectors.toList());
                            
                    CheckoutCommand checkoutCmd = new CheckoutCommand(
                            request.getUsuarioId(),
                            "Recojo en local",
                            request.getFechaInicioSemana(),
                            items
                    );
                    procesarCheckout.realizarCheckout(checkoutCmd);
                }
            } finally {
                TenantContext.clear();
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(guardado));
        } catch (IllegalArgumentException e) {
            Map<String, Object> body = new HashMap<>();
            body.put("error", "Datos no válidos");
            body.put("message", e.getMessage());
            body.put("status", HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(body);
        } catch (Exception e) {
            try {
                if (guardado != null && guardado.getId() != null) {
                    gestionarPlan.cambiarEstadoPago(guardado.getId(), "CANCELADO");
                }
            } catch (Exception ignored) {}
            
            Map<String, Object> body = new HashMap<>();
            body.put("error", "Error interno al procesar el pago");
            body.put("message", "Hubo un fallo al procesar la logística. El plan fue cancelado.");
            body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
    }

    /** Todos los pedidos del negocio (solo TENANT/ADMIN, filtrado por tenant). */
    @GetMapping
    public ResponseEntity<List<PlanSemanalResponse>> listarPedidosDelNegocio() {
        List<PlanSemanalResponse> planes = gestionarPlan.listarTodosLosPlanes().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(planes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanSemanalResponse> obtenerPlan(@PathVariable Long id) {
        return gestionarPlan.obtenerPlanPorId(id)
                .map(plan -> ResponseEntity.ok(mapToResponse(plan)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /** Planes del usuario autenticado (resuelto por el email del JWT). */
    @GetMapping("/mis-planes")
    public ResponseEntity<?> misPlanes() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (email == null || "anonymousUser".equals(email)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }
        Usuario usuario = autenticacion.obtenerPerfilPorEmail(email);
        List<PlanSemanalResponse> planes = gestionarPlan.listarPlanesDeUsuario(usuario.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(planes);
    }

    /** Cambia el estado de pago de un plan (confirmar / pagar / cancelar). */
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestBody CambiarEstadoRequest request) {
        try {
            PlanSemanal actualizado = gestionarPlan.cambiarEstadoPago(id, request.getEstadoPago());
            return ResponseEntity.ok(mapToResponse(actualizado));
        } catch (IllegalArgumentException e) {
            return errorBody("Solicitud no válida", e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (IllegalStateException e) {
            return errorBody("Transición no permitida", e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @ExceptionHandler(ExcesoCaloriasException.class)
    public ResponseEntity<Map<String, Object>> handleExcesoCalorias(ExcesoCaloriasException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Exceso de Calorías");
        body.put("message", ex.getMessage());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.badRequest().body(body);
    }

    private PlanSemanalResponse mapToResponse(PlanSemanal plan) {
        List<ComidaProgramadaDTO> comidas = plan.getComidas() == null ? List.of() : plan.getComidas().stream()
                .map(this::mapComida)
                .collect(Collectors.toList());

        return PlanSemanalResponse.builder()
                .id(plan.getId())
                .negocioId(plan.getNegocioId())
                .usuarioId(plan.getUsuario() != null ? plan.getUsuario().getId() : null)
                .usuarioNombre(nombreCompleto(plan))
                .fechaInicioSemana(plan.getFechaInicioSemana())
                .estadoPago(plan.getEstadoPago())
                .montoTotal(plan.getMontoTotal())
                .comidas(comidas)
                .build();
    }

    private String nombreCompleto(PlanSemanal plan) {
        Usuario u = plan.getUsuario();
        if (u == null) {
            return null;
        }
        return (u.getNombres() != null ? u.getNombres() : "")
                + " "
                + (u.getApellidos() != null ? u.getApellidos() : "");
    }

    private ComidaProgramadaDTO mapComida(DetallePlan detalle) {
        return ComidaProgramadaDTO.builder()
                .platoId(detalle.getPlato() != null ? detalle.getPlato().getId() : null)
                .diaSemana(detalle.getDiaSemana())
                .tipoComida(detalle.getTipoComida())
                .cantidad(detalle.getCantidad())
                .build();
    }

    private ResponseEntity<Map<String, Object>> errorBody(String error, String message, HttpStatus status) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", error);
        body.put("message", message);
        body.put("status", status.value());
        return ResponseEntity.status(status).body(body);
    }
}
