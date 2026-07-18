package com.fitprep.demo.gestion_plataforma.infrastructure.adapter.in.web.dto;

import com.fitprep.demo.gestion_usuarios.infrastructure.adapter.in.web.dto.NegocioResponse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardResponse {
    private long negociosActivos;
    private long usuariosTotales;
    private double mrr;
    private double churn;
    private List<NegocioResponse> negociosNuevos;
    private java.util.Map<String, Long> distribucionPlanes;
}
