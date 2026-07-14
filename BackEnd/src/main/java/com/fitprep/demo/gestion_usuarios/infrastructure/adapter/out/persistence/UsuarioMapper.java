package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.out.persistence;

import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;

final class UsuarioMapper {

    private UsuarioMapper() {
    }

    static Usuario toDomain(UsuarioEntity e) {
        if (e == null) {
            return null;
        }
        return Usuario.builder()
                .id(e.getId())
                .negocioId(e.getNegocioId())
                .nombres(e.getNombres())
                .apellidos(e.getApellidos())
                .email(e.getEmail())
                .passwordHash(e.getPasswordHash())
                .rol(e.getRol())
                .objetivoFitness(e.getObjetivoFitness())
                .requerimientoKcal(e.getRequerimientoKcal())
                .reqProteinasG(e.getReqProteinasG())
                .reqCarbohidratosG(e.getReqCarbohidratosG())
                .reqGrasasG(e.getReqGrasasG())
                .build();
    }

    static UsuarioEntity toEntity(Usuario u) {
        if (u == null) {
            return null;
        }
        return UsuarioEntity.builder()
                .id(u.getId())
                .negocioId(u.getNegocioId())
                .nombres(u.getNombres())
                .apellidos(u.getApellidos())
                .email(u.getEmail())
                .passwordHash(u.getPasswordHash())
                .rol(u.getRol())
                .objetivoFitness(u.getObjetivoFitness())
                .requerimientoKcal(u.getRequerimientoKcal())
                .reqProteinasG(u.getReqProteinasG())
                .reqCarbohidratosG(u.getReqCarbohidratosG())
                .reqGrasasG(u.getReqGrasasG())
                .build();
    }
}
