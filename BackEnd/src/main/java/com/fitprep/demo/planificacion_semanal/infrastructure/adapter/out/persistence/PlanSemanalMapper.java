package com.fitprep.demo.planificacion_semanal.infrastructure.adapter.out.persistence;

import com.fitprep.demo.catalogo_nutricional.domain.model.Plato;
import com.fitprep.demo.catalogo_nutricional.infrastructure.adapter.out.persistence.PlatoEntity;
import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.gestion_usuarios.infrastructure.adapter.out.persistence.UsuarioEntity;
import com.fitprep.demo.planificacion_semanal.domain.model.DetallePlan;
import com.fitprep.demo.planificacion_semanal.domain.model.PlanSemanal;

import java.util.ArrayList;
import java.util.List;

/**
 * Traduce entre el agregado de dominio {@link PlanSemanal} y sus entidades JPA.
 * Las asociaciones a Usuario y Plato se materializan como referencias por id
 * (Hibernate resuelve la FK sin cargar el agregado ajeno completo).
 */
final class PlanSemanalMapper {

    private PlanSemanalMapper() {
    }

    static PlanSemanal toDomain(PlanSemanalEntity e) {
        if (e == null) {
            return null;
        }
        List<DetallePlan> comidas = new ArrayList<>();
        if (e.getComidas() != null) {
            for (DetallePlanEntity d : e.getComidas()) {
                comidas.add(DetallePlan.builder()
                        .id(d.getId())
                        .plato(platoToDomain(d.getPlato()))
                        .diaSemana(d.getDiaSemana())
                        .tipoComida(d.getTipoComida())
                        .cantidad(d.getCantidad())
                        .build());
            }
        }

        return PlanSemanal.builder()
                .id(e.getId())
                .negocioId(e.getNegocioId())
                .usuario(usuarioToDomain(e.getUsuario()))
                .fechaInicioSemana(e.getFechaInicioSemana())
                .estadoPago(e.getEstadoPago())
                .montoTotal(e.getMontoTotal())
                .fechaCreacion(e.getFechaCreacion())
                .comidas(comidas)
                .build();
    }

    static PlanSemanalEntity toEntity(PlanSemanal p) {
        if (p == null) {
            return null;
        }
        PlanSemanalEntity entity = PlanSemanalEntity.builder()
                .id(p.getId())
                .negocioId(p.getNegocioId())
                .usuario(usuarioRef(p.getUsuario()))
                .fechaInicioSemana(p.getFechaInicioSemana())
                .estadoPago(p.getEstadoPago())
                .montoTotal(p.getMontoTotal())
                .fechaCreacion(p.getFechaCreacion())
                .comidas(new ArrayList<>())
                .build();

        if (p.getComidas() != null) {
            for (DetallePlan d : p.getComidas()) {
                DetallePlanEntity detalle = DetallePlanEntity.builder()
                        .id(d.getId())
                        .planSemanal(entity)
                        .plato(platoRef(d.getPlato()))
                        .diaSemana(d.getDiaSemana())
                        .tipoComida(d.getTipoComida())
                        .cantidad(d.getCantidad())
                        .build();
                entity.getComidas().add(detalle);
            }
        }
        return entity;
    }

    // --- Asociaciones a otros contextos: referencia por id al persistir ---

    private static UsuarioEntity usuarioRef(Usuario usuario) {
        if (usuario == null) {
            return null;
        }
        UsuarioEntity ref = new UsuarioEntity();
        ref.setId(usuario.getId());
        return ref;
    }

    private static PlatoEntity platoRef(Plato plato) {
        if (plato == null) {
            return null;
        }
        PlatoEntity ref = new PlatoEntity();
        ref.setId(plato.getId());
        return ref;
    }

    // --- Lectura: proyección mínima suficiente para el dominio ---

    private static Usuario usuarioToDomain(UsuarioEntity e) {
        if (e == null) {
            return null;
        }
        return Usuario.builder()
                .id(e.getId())
                .negocioId(e.getNegocioId())
                .nombres(e.getNombres())
                .apellidos(e.getApellidos())
                .email(e.getEmail())
                .rol(e.getRol())
                .requerimientoKcal(e.getRequerimientoKcal())
                .build();
    }

    private static Plato platoToDomain(PlatoEntity e) {
        if (e == null) {
            return null;
        }
        return Plato.builder()
                .id(e.getId())
                .negocioId(e.getNegocioId())
                .nombre(e.getNombre())
                .descripcion(e.getDescripcion())
                .precio(e.getPrecio())
                .calorias(e.getCalorias())
                .proteinas(e.getProteinas())
                .carbohidratos(e.getCarbohidratos())
                .grasas(e.getGrasas())
                .disponible(e.getDisponible())
                .build();
    }
}
