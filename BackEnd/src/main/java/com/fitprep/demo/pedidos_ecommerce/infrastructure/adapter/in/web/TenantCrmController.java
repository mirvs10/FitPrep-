package com.fitprep.demo.pedidos_ecommerce.infrastructure.adapter.in.web;

import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.domain.port.in.AutenticacionUseCase;
import com.fitprep.demo.gestion_usuarios.domain.port.in.GestionarClientesUseCase;
import com.fitprep.demo.pedidos_ecommerce.domain.model.LineaPedido;
import com.fitprep.demo.pedidos_ecommerce.domain.model.PedidoEcommerce;
import com.fitprep.demo.pedidos_ecommerce.domain.port.in.ConsultarPedidosUseCase;
import com.fitprep.demo.pedidos_ecommerce.infrastructure.adapter.in.web.dto.TenantCrmResponse;
import com.fitprep.demo.pedidos_ecommerce.infrastructure.adapter.in.web.dto.TenantReporteResponse;
import com.fitprep.demo.pedidos_ecommerce.infrastructure.adapter.in.web.dto.TenantDashboardResponse;
import com.fitprep.demo.pedidos_ecommerce.infrastructure.adapter.in.web.dto.TenantDashboardResponse.PedidoRecienteDto;
import com.fitprep.demo.pedidos_ecommerce.infrastructure.adapter.in.web.dto.TenantDashboardResponse.PlatoTopDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/pedidos")
public class TenantCrmController {

    private final ConsultarPedidosUseCase consultarPedidosUseCase;
    private final AutenticacionUseCase autenticacionUseCase;
    private final GestionarClientesUseCase gestionarClientesUseCase;

    public TenantCrmController(ConsultarPedidosUseCase consultarPedidosUseCase,
                               AutenticacionUseCase autenticacionUseCase,
                               GestionarClientesUseCase gestionarClientesUseCase) {
        this.consultarPedidosUseCase = consultarPedidosUseCase;
        this.autenticacionUseCase = autenticacionUseCase;
        this.gestionarClientesUseCase = gestionarClientesUseCase;
    }

    @GetMapping("/clientes")
    public ResponseEntity<?> obtenerClientes() {
        Usuario actual = usuarioActual();
        if (actual == null || actual.getNegocioId() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Obtener todos los pedidos del negocio
        List<PedidoEcommerce> pedidos = consultarPedidosUseCase.listarPedidosNegocio(actual.getNegocioId());

        // Agrupar pedidos por usuario
        Map<Long, List<PedidoEcommerce>> pedidosPorUsuario = pedidos.stream()
                .collect(Collectors.groupingBy(PedidoEcommerce::getUsuarioId));

        // Obtener la información de los usuarios (Atletas)
        List<Usuario> todosLosDeportistas = gestionarClientesUseCase.listarDeportistas();

        List<TenantCrmResponse> clientes = new ArrayList<>();

        for (Usuario deportista : todosLosDeportistas) {
            List<PedidoEcommerce> pedidosCliente = pedidosPorUsuario.get(deportista.getId());
            
            if (pedidosCliente != null && !pedidosCliente.isEmpty()) {
                double ltv = pedidosCliente.stream().mapToDouble(PedidoEcommerce::getMontoTotal).sum();
                int totalPedidos = pedidosCliente.size();

                clientes.add(TenantCrmResponse.builder()
                        .usuarioId(deportista.getId())
                        .nombre(deportista.getNombres() + " " + deportista.getApellidos())
                        .email(deportista.getEmail())
                        .objetivo(deportista.getObjetivoFitness() != null ? deportista.getObjetivoFitness() : "General")
                        .totalPedidos(totalPedidos)
                        .ltv(ltv)
                        .estado("Activo")
                        .build());
            }
        }

        return ResponseEntity.ok(clientes);
    }

    @GetMapping("/reporte-mensual")
    public ResponseEntity<?> obtenerReporteMensual() {
        Usuario actual = usuarioActual();
        if (actual == null || actual.getNegocioId() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<PedidoEcommerce> pedidos = consultarPedidosUseCase.listarPedidosNegocio(actual.getNegocioId());
        LocalDateTime hace30Dias = LocalDateTime.now().minusDays(30);

        List<PedidoEcommerce> pedidosMes = pedidos.stream()
                .filter(p -> p.getFechaCreacion().isAfter(hace30Dias))
                .collect(Collectors.toList());

        double ventasMes = pedidosMes.stream().mapToDouble(PedidoEcommerce::getMontoTotal).sum();
        int totalPedidosMes = pedidosMes.size();

        // Calcular plato estrella
        Map<String, Integer> conteoPlatos = new HashMap<>();
        for (PedidoEcommerce pedido : pedidosMes) {
            for (LineaPedido detalle : pedido.getLineas()) {
                conteoPlatos.put(detalle.getPlatoNombre(),
                        conteoPlatos.getOrDefault(detalle.getPlatoNombre(), 0) + detalle.getCantidad());
            }
        }

        String platoEstrella = "Ninguno";
        int maxCantidad = 0;
        for (Map.Entry<String, Integer> entry : conteoPlatos.entrySet()) {
            if (entry.getValue() > maxCantidad) {
                platoEstrella = entry.getKey();
                maxCantidad = entry.getValue();
            }
        }

        TenantReporteResponse reporte = TenantReporteResponse.builder()
                .ventasDelMes(ventasMes)
                .totalPedidosMes(totalPedidosMes)
                .platoEstrella(platoEstrella)
                .cantidadPlatoEstrella(maxCantidad)
                .build();

        return ResponseEntity.ok(reporte);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> obtenerDashboard() {
        Usuario actual = usuarioActual();
        if (actual == null || actual.getNegocioId() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<PedidoEcommerce> pedidos = consultarPedidosUseCase.listarPedidosNegocio(actual.getNegocioId());
        LocalDateTime hace7Dias = LocalDateTime.now().minusDays(7);

        // Ventas Semanales
        double ventasSemanales = pedidos.stream()
                .filter(p -> p.getFechaCreacion().isAfter(hace7Dias) && p.getEstado().equals("PAGADO"))
                .mapToDouble(PedidoEcommerce::getMontoTotal)
                .sum();

        // Pedidos activos
        int pedidosActivos = (int) pedidos.stream()
                .filter(p -> p.getEstado().equals("PAGADO") || p.getEstado().equals("PREPARANDO"))
                .count();

        // Calcular platos más vendidos
        Map<String, Integer> conteoPlatos = new HashMap<>();
        int totalPlatosVendidos = 0;
        for (PedidoEcommerce pedido : pedidos) {
            if (!pedido.getEstado().equals("CANCELADO")) {
                for (LineaPedido detalle : pedido.getLineas()) {
                    conteoPlatos.put(detalle.getPlatoNombre(),
                            conteoPlatos.getOrDefault(detalle.getPlatoNombre(), 0) + detalle.getCantidad());
                    totalPlatosVendidos += detalle.getCantidad();
                }
            }
        }
        
        final int finalTotalPlatos = totalPlatosVendidos;

        List<PlatoTopDto> platosMasVendidos = conteoPlatos.entrySet().stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                .limit(4)
                .map(e -> {
                    PlatoTopDto dto = new PlatoTopDto();
                    dto.setNombre(e.getKey());
                    dto.setUnidades(String.valueOf(e.getValue()));
                    int porcentaje = finalTotalPlatos > 0 ? (e.getValue() * 100 / finalTotalPlatos) : 0;
                    dto.setPorcentaje(porcentaje + "%");
                    return dto;
                })
                .collect(Collectors.toList());

        // Pedidos recientes
        List<Usuario> todosLosDeportistas = gestionarClientesUseCase.listarDeportistas();
        Map<Long, Usuario> deportistasPorId = todosLosDeportistas.stream()
                .collect(Collectors.toMap(Usuario::getId, u -> u));

        List<PedidoRecienteDto> pedidosRecientes = pedidos.stream()
                .sorted((p1, p2) -> p2.getFechaCreacion().compareTo(p1.getFechaCreacion()))
                .limit(5)
                .map(p -> {
                    PedidoRecienteDto dto = new PedidoRecienteDto();
                    dto.setIdPedido("#" + p.getId());
                    
                    Usuario cliente = deportistasPorId.get(p.getUsuarioId());
                    dto.setCliente(cliente != null ? cliente.getNombres() + " " + cliente.getApellidos() : "Cliente Anónimo");
                    
                    dto.setEstado(p.getEstado());
                    dto.setMonto("$" + String.format("%.2f", p.getMontoTotal()));
                    
                    String color = switch (p.getEstado()) {
                        case "PAGADO" -> "brand";
                        case "ENTREGADO" -> "neutral";
                        case "CANCELADO" -> "destructive";
                        default -> "amber";
                    };
                    dto.setColorBadge(color);
                    return dto;
                })
                .collect(Collectors.toList());

        TenantDashboardResponse response = new TenantDashboardResponse();
        response.setVentasSemanales(ventasSemanales);
        response.setPedidosActivos(pedidosActivos);
        response.setPlatosMasVendidos(platosMasVendidos);
        response.setPedidosRecientes(pedidosRecientes);

        // Historial funcional de ingresos (12 semanas)
        List<Double> historial = new ArrayList<>();
        for (int i = 11; i >= 0; i--) {
            LocalDateTime inicioSemana = LocalDateTime.now().minusWeeks(i).withHour(0).withMinute(0);
            LocalDateTime finSemana = inicioSemana.plusWeeks(1);
            
            double ingresosSemana = pedidos.stream()
                    .filter(p -> p.getEstado().equals("PAGADO") && 
                               p.getFechaCreacion().isAfter(inicioSemana) && 
                               p.getFechaCreacion().isBefore(finSemana))
                    .mapToDouble(PedidoEcommerce::getMontoTotal)
                    .sum();
            historial.add(ingresosSemana);
        }
        response.setHistorialIngresos(historial);

        return ResponseEntity.ok(response);
    }

    private Usuario usuarioActual() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (email == null || "anonymousUser".equals(email)) {
            return null;
        }
        return autenticacionUseCase.obtenerPerfilPorEmail(email);
    }
}
