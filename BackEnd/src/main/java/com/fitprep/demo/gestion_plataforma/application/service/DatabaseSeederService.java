package com.fitprep.demo.gestion_plataforma.application.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DatabaseSeederService {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseSeederService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public void seedDatabase() {
        // Limpiar
        jdbcTemplate.execute("TRUNCATE TABLE detalle_plan, plan_semanal, linea_pedido, pedido_ecommerce CASCADE;");
        jdbcTemplate.execute("TRUNCATE TABLE suscripcion CASCADE;");
        jdbcTemplate.execute("TRUNCATE TABLE plato CASCADE;");
        jdbcTemplate.execute("TRUNCATE TABLE usuario CASCADE;");
        jdbcTemplate.execute("TRUNCATE TABLE negocio CASCADE;");

        // Insertar Negocios
        jdbcTemplate.execute("INSERT INTO negocio (id, nombre_comercial, slug, ruc, telefono, estado, plan, ciudad, fecha_registro) VALUES " +
                "(1, 'FitPrep Admin', 'admin', '00000000000', '000000000', 'ACTIVO', 'Scale', 'Madrid', CURRENT_TIMESTAMP), " +
                "(2, 'CoffeeFit', 'coffeefit', '20123456789', '999111222', 'ACTIVO', 'Growth', 'Madrid', CURRENT_TIMESTAMP), " +
                "(3, 'PrimeFit', 'primefit', '20987654321', '999111333', 'ACTIVO', 'Growth', 'Madrid', CURRENT_TIMESTAMP);");

        jdbcTemplate.execute("SELECT setval(pg_get_serial_sequence('negocio', 'id'), (SELECT MAX(id) FROM negocio));");

        // Insertar Usuarios (Password: password123)
        jdbcTemplate.execute("INSERT INTO usuario (negocio_id, nombres, apellidos, email, password_hash, rol, estado) VALUES " +
                "(1, 'Super', 'Admin', 'admin@fitprep.com', '$2a$10$WVL6RyzeGLd5QNj6j52jJ.YLJVwJN2mAPMV0YaUjcT/HIqpH9dCnu', 'ADMIN', 'ACTIVO'), " +
                "(2, 'Dueño', 'CoffeeFit', 'coffeefit@gmail.com', '$2a$10$WVL6RyzeGLd5QNj6j52jJ.YLJVwJN2mAPMV0YaUjcT/HIqpH9dCnu', 'TENANT', 'ACTIVO'), " +
                "(3, 'Dueño', 'PrimeFit', 'primefit@gmail.com', '$2a$10$WVL6RyzeGLd5QNj6j52jJ.YLJVwJN2mAPMV0YaUjcT/HIqpH9dCnu', 'TENANT', 'ACTIVO'), " +
                "(2, 'Test', 'Athlete', 'user1@gmail.com', '$2a$10$WVL6RyzeGLd5QNj6j52jJ.YLJVwJN2mAPMV0YaUjcT/HIqpH9dCnu', 'ATHLETE', 'ACTIVO');");

        jdbcTemplate.execute("SELECT setval(pg_get_serial_sequence('usuario', 'id'), (SELECT MAX(id) FROM usuario));");

        // Insertar Platos
        jdbcTemplate.execute("INSERT INTO plato (negocio_id, nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, disponible, imagen_url) VALUES " +
                "(2, 'Café Proteico & Avena', 'Avena cocida con proteína sabor vainilla, servido con café negro.', 12.00, 350.00, 30.00, 45.00, 5.00, TRUE, 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&w=800&q=80'), " +
                "(2, 'Sandwich de Pavo y Palta', 'Pan integral con pechuga de pavo asada, palta y tomate.', 15.50, 420.00, 25.00, 35.00, 15.00, TRUE, 'https://images.unsplash.com/photo-1619860860774-1e2e17343432?auto=format&fit=crop&w=800&q=80'), " +
                "(2, 'Pollo Teriyaki Express', 'Pollo glaseado en salsa teriyaki sin azúcar con arroz de coliflor.', 22.00, 390.00, 40.00, 15.00, 10.00, TRUE, 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=800&q=80'), " +
                "(3, 'Prime Beef Bowl', 'Lomo de res a la plancha, arroz integral y espárragos.', 28.00, 600.00, 45.00, 50.00, 15.00, TRUE, 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80'), " +
                "(3, 'Salmón Grillado Keto', 'Filete de salmón fresco con ensalada de pepino y vinagreta de limón.', 32.00, 450.00, 38.00, 5.00, 25.00, TRUE, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80');");

        jdbcTemplate.execute("SELECT setval(pg_get_serial_sequence('plato', 'id'), (SELECT MAX(id) FROM plato));");

        // Insertar Plan y Detalles de Prueba para poblar Dashboards
        jdbcTemplate.execute("INSERT INTO plan_semanal (id, negocio_id, usuario_id, fecha_inicio_semana, estado_pago, monto_total) VALUES " +
                "(1, 2, 4, '2026-07-06', 'APROBADO', 87.50);");
        
        jdbcTemplate.execute("INSERT INTO detalle_plan (plan_semanal_id, plato_id, dia_semana, tipo_comida, cantidad) VALUES " +
                "(1, 1, 'LUNES', 'DESAYUNO', 1), " +
                "(1, 2, 'LUNES', 'ALMUERZO', 1), " +
                "(1, 3, 'MARTES', 'ALMUERZO', 1);");

        jdbcTemplate.execute("SELECT setval(pg_get_serial_sequence('plan_semanal', 'id'), (SELECT MAX(id) FROM plan_semanal));");
        jdbcTemplate.execute("SELECT setval(pg_get_serial_sequence('detalle_plan', 'id'), (SELECT MAX(id) FROM detalle_plan));");

        // Insertar Estadisticas Historicas (MRR)
        jdbcTemplate.execute("TRUNCATE TABLE estadisticas_historicas CASCADE;");
        jdbcTemplate.execute("INSERT INTO estadisticas_historicas (fecha, mrr, churn_rate, nuevos_negocios) VALUES " +
                "('2026-01', 500.00, 1.2, 5), " +
                "('2026-02', 650.00, 1.5, 8), " +
                "('2026-03', 850.00, 2.0, 12), " +
                "('2026-04', 1100.00, 1.8, 15), " +
                "('2026-05', 1450.00, 2.2, 20), " +
                "('2026-06', 1900.00, 2.4, 25);");
    }
}
