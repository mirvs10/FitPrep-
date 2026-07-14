-- =====================================================================
-- FitPrep · Datos de ejemplo (seed)
-- Contraseña en claro para todos los usuarios: password123
-- Hash BCrypt generado con la misma configuración de Spring Security.
-- =====================================================================

-- Negocio de ejemplo (tenant id = 1)
INSERT INTO negocio (id, nombre_comercial, slug, ruc, telefono, estado)
VALUES (1, 'FitPrep Demo', 'fitprep-demo', '20123456789', '999888777', 'ACTIVO');

-- Usuarios del tenant 1
-- Admin del negocio (rol TENANT: puede crear/editar/eliminar platos)
INSERT INTO usuario (negocio_id, nombres, apellidos, email, password_hash, rol,
                     objetivo_fitness, requerimiento_kcal, req_proteinas_g, req_carbohidratos_g, req_grasas_g)
VALUES
 (1, 'Admin', 'FitPrep', 'admin@fitprep.com',
  '$2a$10$WVL6RyzeGLd5QNj6j52jJ.YLJVwJN2mAPMV0YaUjcT/HIqpH9dCnu', 'TENANT',
  NULL, NULL, NULL, NULL, NULL),
 (1, 'Bruno', 'Deportista', 'atleta@fitprep.com',
  '$2a$10$WVL6RyzeGLd5QNj6j52jJ.YLJVwJN2mAPMV0YaUjcT/HIqpH9dCnu', 'ATHLETE',
  'PERDIDA_GRASA', 2200.00, 165.00, 220.00, 60.00);

-- Catálogo de platos del tenant 1
INSERT INTO plato (negocio_id, nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, disponible)
VALUES
 (1, 'Pechuga a la plancha con quinua', 'Pechuga de pollo, quinua y vegetales al vapor', 18.50, 520.00, 48.00, 45.00, 12.00, TRUE),
 (1, 'Bowl de salmón', 'Salmón, arroz integral y palta', 24.00, 610.00, 40.00, 50.00, 25.00, TRUE),
 (1, 'Ensalada de atún', 'Atún, huevo, hojas verdes y aceite de oliva', 15.00, 380.00, 34.00, 12.00, 20.00, TRUE),
 (1, 'Wrap de pavo', 'Tortilla integral, pavo, vegetales y hummus', 16.00, 450.00, 30.00, 40.00, 15.00, TRUE);

-- Resincronizar la secuencia de negocio tras el INSERT con id explícito
SELECT setval(pg_get_serial_sequence('negocio', 'id'), (SELECT MAX(id) FROM negocio));

