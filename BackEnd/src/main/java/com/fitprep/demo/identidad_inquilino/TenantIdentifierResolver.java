package com.fitprep.demo.identidad_inquilino;

import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.stereotype.Component;

@Component
public class TenantIdentifierResolver implements CurrentTenantIdentifierResolver<Integer> {

    private static final Integer DEFAULT_TENANT = 1;

    @Override
    public Integer resolveCurrentTenantIdentifier() {
        String tenantId = TenantContext.getCurrentTenant();
        if (tenantId != null && !tenantId.trim().isEmpty()) {
            try {
                return Integer.valueOf(tenantId);
            } catch (NumberFormatException e) {
                return DEFAULT_TENANT;
            }
        }
        return DEFAULT_TENANT;
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }
}
