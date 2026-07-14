-- =====================================================================
-- FitPrep - Limpieza y reseteo de datos a pedido del usuario
-- Contraseña en claro para todos los nuevos usuarios: password123
-- =====================================================================

-- 1. Limpiar la base de datos de operaciones transaccionales
TRUNCATE TABLE detalle_plan, plan_semanal, linea_pedido, pedido_ecommerce CASCADE;

-- 2. Limpiar platos
TRUNCATE TABLE plato CASCADE;

-- 3. Eliminar todos los usuarios que no sean Super Admin (rol ADMIN)
DELETE FROM usuario WHERE rol != 'ADMIN';

-- 4. Borrar todos los negocios excepto el ID=1 (al que pertenece el ADMIN)
DELETE FROM negocio WHERE id != 1;

-- 5. Actualizar el Negocio 1 para que sea CoffeeFit
UPDATE negocio SET nombre_comercial = 'CoffeeFit', slug = 'coffeefit', ruc = '20123456789' WHERE id = 1;

-- 6. Crear el Negocio 2 (PrimeFit)
INSERT INTO negocio (id, nombre_comercial, slug, ruc, telefono, estado, plan, ciudad)
VALUES (2, 'PrimeFit', 'primefit', '20987654321', '999111222', 'ACTIVO', 'Growth', 'Madrid');

-- Resincronizar la secuencia de negocio
SELECT setval(pg_get_serial_sequence('negocio', 'id'), (SELECT MAX(id) FROM negocio));

-- 7. Insertar los 2 Atletas (Usuarios 1 y 2)
INSERT INTO usuario (negocio_id, nombres, apellidos, email, password_hash, rol, objetivo_fitness, requerimiento_kcal, req_proteinas_g, req_carbohidratos_g, req_grasas_g)
VALUES
 (1, 'Mike', 'Rivas', 'user1@gmail.com', '$2a$10$WVL6RyzeGLd5QNj6j52jJ.YLJVwJN2mAPMV0YaUjcT/HIqpH9dCnu', 'ATHLETE', 'Aumento Muscular', 2800.00, 180.00, 300.00, 70.00),
 (1, 'Matias', 'Escobar', 'user2@gmail.com', '$2a$10$WVL6RyzeGLd5QNj6j52jJ.YLJVwJN2mAPMV0YaUjcT/HIqpH9dCnu', 'ATHLETE', 'Pérdida de Peso', 2000.00, 160.00, 150.00, 50.00);

-- 8. Insertar los 2 Restaurantes (Owners de CoffeeFit y PrimeFit)
INSERT INTO usuario (negocio_id, nombres, apellidos, email, password_hash, rol)
VALUES
 (1, 'Dueño', 'CoffeeFit', 'coffeefit@gmail.com', '$2a$10$WVL6RyzeGLd5QNj6j52jJ.YLJVwJN2mAPMV0YaUjcT/HIqpH9dCnu', 'TENANT'),
 (2, 'Dueño', 'PrimeFit', 'primefit@gmail.com', '$2a$10$WVL6RyzeGLd5QNj6j52jJ.YLJVwJN2mAPMV0YaUjcT/HIqpH9dCnu', 'TENANT');

-- 9. Insertar el Catálogo para CoffeeFit (negocio_id = 1)
INSERT INTO plato (negocio_id, nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, disponible)
VALUES
 (1, 'Café Proteico & Avena', 'Avena cocida con proteína sabor vainilla, servido con café negro.', 12.00, 350.00, 30.00, 45.00, 5.00, TRUE),
 (1, 'Sandwich de Pavo y Palta', 'Pan integral con pechuga de pavo asada, palta y tomate.', 15.50, 420.00, 25.00, 35.00, 15.00, TRUE),
 (1, 'Bowl de Frutos Rojos', 'Yogur griego con mix de frutos rojos, chía y almendras.', 14.00, 280.00, 20.00, 25.00, 10.00, TRUE),
 (1, 'Pollo Teriyaki Express', 'Pollo glaseado en salsa teriyaki sin azúcar con arroz de coliflor.', 22.00, 390.00, 40.00, 15.00, 10.00, TRUE),
 (1, 'Omelette Fit', 'Omelette de 3 claras y 1 yema con espinaca y champiñones.', 13.00, 220.00, 24.00, 5.00, 8.00, TRUE);

-- 10. Insertar el Catálogo para PrimeFit (negocio_id = 2)
INSERT INTO plato (negocio_id, nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, disponible)
VALUES
 (2, 'Prime Beef Bowl', 'Lomo de res a la plancha, arroz integral y espárragos.', 28.00, 600.00, 45.00, 50.00, 15.00, TRUE),
 (2, 'Salmón Grillado Keto', 'Filete de salmón fresco con ensalada de pepino y vinagreta de limón.', 32.00, 450.00, 38.00, 5.00, 25.00, TRUE),
 (2, 'Pasta Proteica de Pollo', 'Pasta a base de lentejas con trozos de pechuga en salsa roja.', 24.00, 520.00, 50.00, 60.00, 8.00, TRUE),
 (2, 'Wrap Prime Vegano', 'Tortilla de espinaca con hummus, tofu, zanahoria y lechuga.', 18.00, 340.00, 18.00, 40.00, 12.00, TRUE),
 (2, 'Atún Sellado con Sésamo', 'Medallón de atún con costra de sésamo y vegetales al wok.', 29.00, 380.00, 42.00, 12.00, 14.00, TRUE);

-- Resincronizar secuencias
SELECT setval(pg_get_serial_sequence('plato', 'id'), (SELECT MAX(id) FROM plato));
SELECT setval(pg_get_serial_sequence('usuario', 'id'), (SELECT MAX(id) FROM usuario));
