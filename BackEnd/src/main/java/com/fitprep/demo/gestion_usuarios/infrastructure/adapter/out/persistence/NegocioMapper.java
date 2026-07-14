package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.out.persistence;

import com.fitprep.demo.gestion_usuarios.domain.model.Negocio;

final class NegocioMapper {

    private NegocioMapper() {
    }

    static Negocio toDomain(NegocioEntity e) {
        if (e == null) {
            return null;
        }
        return Negocio.builder()
                .id(e.getId())
                .nombreComercial(e.getNombreComercial())
                .slug(e.getSlug())
                .ruc(e.getRuc())
                .telefono(e.getTelefono())
                .estado(e.getEstado())
                .plan(e.getPlan())
                .ciudad(e.getCiudad())
                .fechaRegistro(e.getFechaRegistro())
                .build();
    }

    static NegocioEntity toEntity(Negocio n) {
        if (n == null) {
            return null;
        }
        return NegocioEntity.builder()
                .id(n.getId())
                .nombreComercial(n.getNombreComercial())
                .slug(n.getSlug())
                .ruc(n.getRuc())
                .telefono(n.getTelefono())
                .estado(n.getEstado())
                .plan(n.getPlan())
                .ciudad(n.getCiudad())
                .fechaRegistro(n.getFechaRegistro())
                .build();
    }
}
