package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.out.security;

import com.fitprep.demo.gestion_usuarios.domain.port.out.TenantProviderPort;
import com.fitprep.demo.identidad_inquilino.TenantContext;
import org.springframework.stereotype.Component;

/**
 * Adaptador de salida que resuelve el tenant activo desde el contexto de hilo.
 */
@Component
public class ThreadLocalTenantProvider implements TenantProviderPort {

    @Override
    public Integer currentTenantId() {
        String tenant = TenantContext.getCurrentTenant();
        if (tenant == null) {
            return null;
        }
        try {
            return Integer.valueOf(tenant);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
