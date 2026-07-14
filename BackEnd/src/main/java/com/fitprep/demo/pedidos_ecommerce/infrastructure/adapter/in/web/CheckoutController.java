package com.fitprep.demo.pedidos_ecommerce.infrastructure.adapter.in.web;

import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.domain.port.in.AutenticacionUseCase;
import com.fitprep.demo.pedidos_ecommerce.domain.model.LineaPedido;
import com.fitprep.demo.pedidos_ecommerce.domain.model.PedidoEcommerce;
import com.fitprep.demo.pedidos_ecommerce.domain.port.in.ConsultarPedidosUseCase;
import com.fitprep.demo.pedidos_ecommerce.domain.port.in.ProcesarCheckoutUseCase;
import com.fitprep.demo.pedidos_ecommerce.domain.port.in.ProcesarCheckoutUseCase.CheckoutCommand;
import com.fitprep.demo.pedidos_ecommerce.domain.port.in.ProcesarCheckoutUseCase.ItemCheckout;
import com.fitprep.demo.pedidos_ecommerce.infrastructure.adapter.in.web.dto.CheckoutRequest;
import com.fitprep.demo.pedidos_ecommerce.infrastructure.adapter.in.web.dto.PedidoResponse;
import com.fitprep.demo.pedidos_ecommerce.infrastructure.adapter.in.web.dto.PedidoResponse.LineaResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/pedidos")
public class CheckoutController {

    private final ProcesarCheckoutUseCase procesarCheckoutUseCase;
    private final ConsultarPedidosUseCase consultarPedidosUseCase;
    private final AutenticacionUseCase autenticacionUseCase;

    public CheckoutController(ProcesarCheckoutUseCase procesarCheckoutUseCase,
                              ConsultarPedidosUseCase consultarPedidosUseCase,
                              AutenticacionUseCase autenticacionUseCase) {
        this.procesarCheckoutUseCase = procesarCheckoutUseCase;
        this.consultarPedidosUseCase = consultarPedidosUseCase;
        this.autenticacionUseCase = autenticacionUseCase;
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequest request) {
        Usuario actual = usuarioActual();
        if (actual == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");
        }

        try {
            LocalDate fechaEntrega = request.getFechaEntrega() != null 
                    ? LocalDate.parse(request.getFechaEntrega()) 
                    : LocalDate.now().plusDays(1);

            List<ItemCheckout> items = request.getItems().stream()
                    .map(i -> new ItemCheckout(i.getPlatoId(), i.getCantidad()))
                    .collect(Collectors.toList());

            CheckoutCommand command = new CheckoutCommand(
                    actual.getId(),
                    request.getDireccionEntrega(),
                    fechaEntrega,
                    items
            );

            PedidoEcommerce pedido = procesarCheckoutUseCase.realizarCheckout(command);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(pedido));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/mis-pedidos")
    public ResponseEntity<?> misPedidos() {
        Usuario actual = usuarioActual();
        if (actual == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");
        }

        List<PedidoEcommerce> pedidos = consultarPedidosUseCase.listarPedidosUsuario(actual.getId());
        List<PedidoResponse> response = pedidos.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/negocio")
    public ResponseEntity<?> pedidosNegocio() {
        Usuario actual = usuarioActual();
        if (actual == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");
        }
        if (actual.getNegocioId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El usuario no pertenece a ningún negocio");
        }

        List<PedidoEcommerce> pedidos = consultarPedidosUseCase.listarPedidosNegocio(actual.getNegocioId());
        List<PedidoResponse> response = pedidos.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestParam String estado) {
        Usuario actual = usuarioActual();
        if (actual == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");
        }
        // Permitir a TENANT o ADMIN cambiar el estado
        if (!"TENANT".equalsIgnoreCase(actual.getRol()) && !"ADMIN".equalsIgnoreCase(actual.getRol())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado para cambiar el estado");
        }

        try {
            PedidoEcommerce pedido = consultarPedidosUseCase.cambiarEstadoPedido(id, estado);
            return ResponseEntity.ok(mapToResponse(pedido));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private Usuario usuarioActual() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (email == null || "anonymousUser".equals(email)) {
            return null;
        }
        return autenticacionUseCase.obtenerPerfilPorEmail(email);
    }

    private PedidoResponse mapToResponse(PedidoEcommerce domain) {
        List<LineaResponse> lineas = domain.getLineas().stream()
                .map(l -> LineaResponse.builder()
                        .id(l.getId())
                        .platoId(l.getPlatoId())
                        .platoNombre(l.getPlatoNombre())
                        .cantidad(l.getCantidad())
                        .precioUnitario(l.getPrecioUnitario())
                        .subtotal(l.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        return PedidoResponse.builder()
                .id(domain.getId())
                .negocioId(domain.getNegocioId())
                .usuarioId(domain.getUsuarioId())
                .estado(domain.getEstado())
                .montoTotal(domain.getMontoTotal())
                .direccionEntrega(domain.getDireccionEntrega())
                .fechaEntrega(domain.getFechaEntrega())
                .fechaCreacion(domain.getFechaCreacion())
                .lineas(lineas)
                .build();
    }
}
