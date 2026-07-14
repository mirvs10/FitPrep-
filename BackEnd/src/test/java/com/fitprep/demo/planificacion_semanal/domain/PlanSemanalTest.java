package com.fitprep.demo.planificacion_semanal.domain;

import com.fitprep.demo.catalogo_nutricional.domain.model.Plato;
import com.fitprep.demo.gestion_usuarios.domain.model.Usuario;
import com.fitprep.demo.planificacion_semanal.domain.model.DetallePlan;
import com.fitprep.demo.planificacion_semanal.domain.model.ExcesoCaloriasException;
import com.fitprep.demo.planificacion_semanal.domain.model.PlanSemanal;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class PlanSemanalTest {

    @Test
    @DisplayName("Debería lanzar ExcesoCaloriasException si las calorías sumadas exceden el límite calórico permitido")
    public void deberiaLanzarExcepcionCuandoCaloriasExcedenLimite() {
        // Arrange
        Usuario usuario = Usuario.builder()
                .id(1L)
                .requerimientoKcal(2000.0)
                .build();

        Plato plato1 = Plato.builder()
                .id(101L)
                .calorias(1200.0)
                .build();

        Plato plato2 = Plato.builder()
                .id(102L)
                .calorias(1000.0)
                .build();

        PlanSemanal plan = PlanSemanal.builder()
                .usuario(usuario)
                .comidas(new ArrayList<>())
                .build();

        DetallePlan detalle1 = DetallePlan.builder()
                .plato(plato1)
                .cantidad(1)
                .build();

        DetallePlan detalle2 = DetallePlan.builder()
                .plato(plato2)
                .cantidad(1)
                .build();

        plan.getComidas().addAll(List.of(detalle1, detalle2)); // Total 2200 kcal

        // Act & Assert
        assertThrows(ExcesoCaloriasException.class, () -> {
            plan.calcularYValidarMacros();
        }, "Se esperaba ExcesoCaloriasException debido a que 2200 > 2000");
    }

    @Test
    @DisplayName("Debería pasar exitosamente si las calorías sumadas no exceden el límite calórico permitido")
    public void deberiaPasarCuandoCaloriasNoExcedenLimite() {
        // Arrange
        Usuario usuario = Usuario.builder()
                .id(1L)
                .requerimientoKcal(2000.0)
                .build();

        Plato plato1 = Plato.builder()
                .id(101L)
                .calorias(800.0)
                .build();

        Plato plato2 = Plato.builder()
                .id(102L)
                .calorias(700.0)
                .build();

        PlanSemanal plan = PlanSemanal.builder()
                .usuario(usuario)
                .comidas(new ArrayList<>())
                .build();

        DetallePlan detalle1 = DetallePlan.builder()
                .plato(plato1)
                .cantidad(1)
                .build();

        DetallePlan detalle2 = DetallePlan.builder()
                .plato(plato2)
                .cantidad(1)
                .build();

        plan.getComidas().addAll(List.of(detalle1, detalle2)); // Total 1500 kcal

        // Act & Assert
        assertDoesNotThrow(() -> {
            plan.calcularYValidarMacros();
        }, "No debería lanzar excepción ya que 1500 está por debajo del límite de 2000");
    }
}
