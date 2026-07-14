package com.fitprep.demo.catalogo_nutricional.infrastructure.adapter.out.persistence;

import com.fitprep.demo.catalogo_nutricional.domain.model.Plato;

/**
 * Traduce entre el modelo de dominio y la entidad de persistencia.
 */
final class PlatoMapper {

    private PlatoMapper() {
    }

    static Plato toDomain(PlatoEntity entity) {
        if (entity == null) {
            return null;
        }
        return Plato.builder()
                .id(entity.getId())
                .negocioId(entity.getNegocioId())
                .nombre(entity.getNombre())
                .descripcion(entity.getDescripcion())
                .precio(entity.getPrecio())
                .calorias(entity.getCalorias())
                .proteinas(entity.getProteinas())
                .carbohidratos(entity.getCarbohidratos())
                .grasas(entity.getGrasas())
                .disponible(entity.getDisponible())
                .build();
    }

    static PlatoEntity toEntity(Plato plato) {
        if (plato == null) {
            return null;
        }
        return PlatoEntity.builder()
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
