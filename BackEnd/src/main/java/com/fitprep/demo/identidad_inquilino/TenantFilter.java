package com.fitprep.demo.identidad_inquilino;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class TenantFilter extends OncePerRequestFilter {

    private static final String TENANT_HEADER = "X-TenantID";
    private final JdbcTemplate jdbcTemplate;

    public TenantFilter(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String tenantId = request.getHeader(TENANT_HEADER);
        
        // 1. Si el cliente envía un header explícito, le damos prioridad
        if (tenantId != null && !tenantId.trim().isEmpty()) {
            TenantContext.setCurrentTenant(tenantId);
        }

        // 2. Si se está consultando el detalle de un plato específico (GET /api/v1/platos/{id})
        // resolvemos el negocio_id directamente de la BD para establecer el TenantContext correcto.
        String uri = request.getRequestURI();
        if ("GET".equalsIgnoreCase(request.getMethod()) && uri.matches(".*/api/v1/platos/\\d+$")) {
            String[] parts = uri.split("/");
            String platoIdStr = parts[parts.length - 1];
            try {
                Long platoId = Long.parseLong(platoIdStr);
                Integer negocioId = jdbcTemplate.queryForObject(
                    "SELECT negocio_id FROM plato WHERE id = ?", Integer.class, platoId);
                if (negocioId != null) {
                    TenantContext.setCurrentTenant(negocioId.toString());
                }
            } catch (Exception e) {
                // Si falla o no existe, dejamos que continúe con el comportamiento por defecto
            }
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }
}
