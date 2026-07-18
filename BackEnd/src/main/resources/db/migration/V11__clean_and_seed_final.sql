-- =====================================================================
-- FitPrep - Limpieza final y Seed Manual para Pruebas QA
-- Contraseña universal: password123
-- =====================================================================

TRUNCATE TABLE detalle_plan, plan_semanal, linea_pedido, pedido_ecommerce CASCADE;
TRUNCATE TABLE suscripcion CASCADE;
TRUNCATE TABLE plato CASCADE;
TRUNCATE TABLE usuario CASCADE;
TRUNCATE TABLE negocio CASCADE;

-- 1. Insert 3 Negocios (1 Admin, 2 Tenants)
INSERT INTO negocio (id, nombre_comercial, slug, ruc, telefono, estado, plan, ciudad, fecha_registro)
VALUES 
 (1, 'FitPrep Admin', 'admin', '00000000000', '000000000', 'ACTIVO', 'Scale', 'Madrid', CURRENT_TIMESTAMP),
 (2, 'CoffeeFit', 'coffeefit', '20123456789', '999111222', 'ACTIVO', 'Growth', 'Madrid', CURRENT_TIMESTAMP),
 (3, 'PrimeFit', 'primefit', '20987654321', '999111333', 'ACTIVO', 'Growth', 'Madrid', CURRENT_TIMESTAMP);

-- Resincronizar secuencias
SELECT setval(pg_get_serial_sequence('negocio', 'id'), (SELECT MAX(id) FROM negocio));

-- 2. Insert Users (Password is password123)
INSERT INTO usuario (negocio_id, nombres, apellidos, email, password_hash, rol, estado)
VALUES
 (1, 'Super', 'Admin', 'admin@fitprep.com', '$2a$10$WVL6RyzeGLd5QNj6j52jJ.YLJVwJN2mAPMV0YaUjcT/HIqpH9dCnu', 'ADMIN', 'ACTIVO'),
 (2, 'Dueño', 'CoffeeFit', 'coffeefit@gmail.com', '$2a$10$WVL6RyzeGLd5QNj6j52jJ.YLJVwJN2mAPMV0YaUjcT/HIqpH9dCnu', 'TENANT', 'ACTIVO'),
 (3, 'Dueño', 'PrimeFit', 'primefit@gmail.com', '$2a$10$WVL6RyzeGLd5QNj6j52jJ.YLJVwJN2mAPMV0YaUjcT/HIqpH9dCnu', 'TENANT', 'ACTIVO'),
 (2, 'Test', 'Athlete', 'user1@gmail.com', '$2a$10$WVL6RyzeGLd5QNj6j52jJ.YLJVwJN2mAPMV0YaUjcT/HIqpH9dCnu', 'ATHLETE', 'ACTIVO');

SELECT setval(pg_get_serial_sequence('usuario', 'id'), (SELECT MAX(id) FROM usuario));

-- 3. Platos CoffeeFit
INSERT INTO plato (negocio_id, nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, disponible, imagen_url)
VALUES
 (2, 'Café Proteico & Avena', 'Avena cocida con proteína sabor vainilla, servido con café negro.', 12.00, 350.00, 30.00, 45.00, 5.00, TRUE, 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&w=800&q=80'),
 (2, 'Sandwich de Pavo y Palta', 'Pan integral con pechuga de pavo asada, palta y tomate.', 15.50, 420.00, 25.00, 35.00, 15.00, TRUE, 'https://images.unsplash.com/photo-1619860860774-1e2e17343432?auto=format&fit=crop&w=800&q=80'),
 (2, 'Bowl de Frutos Rojos', 'Yogur griego con mix de frutos rojos, chía y almendras.', 14.00, 280.00, 20.00, 25.00, 10.00, TRUE, 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&w=800&q=80'),
 (2, 'Pollo Teriyaki Express', 'Pollo glaseado en salsa teriyaki sin azúcar con arroz de coliflor.', 22.00, 390.00, 40.00, 15.00, 10.00, TRUE, 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=800&q=80'),
 (2, 'Omelette Fit', 'Omelette de 3 claras y 1 yema con espinaca y champiñones.', 13.00, 220.00, 24.00, 5.00, 8.00, TRUE, 'https://images.unsplash.com/photo-1510693062635-f09b5550dbdd?auto=format&fit=crop&w=800&q=80');

-- 4. Platos PrimeFit
INSERT INTO plato (negocio_id, nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, disponible, imagen_url)
VALUES
 (3, 'Prime Beef Bowl', 'Lomo de res a la plancha, arroz integral y espárragos.', 28.00, 600.00, 45.00, 50.00, 15.00, TRUE, 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80'),
 (3, 'Salmón Grillado Keto', 'Filete de salmón fresco con ensalada de pepino y vinagreta de limón.', 32.00, 450.00, 38.00, 5.00, 25.00, TRUE, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80'),
 (3, 'Pasta Proteica de Pollo', 'Pasta a base de lentejas con trozos de pechuga en salsa roja.', 24.00, 520.00, 50.00, 60.00, 8.00, TRUE, 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80'),
 (3, 'Wrap Prime Vegano', 'Tortilla de espinaca con hummus, tofu, zanahoria y lechuga.', 18.00, 340.00, 18.00, 40.00, 12.00, TRUE, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80'),
 (3, 'Atún Sellado con Sésamo', 'Medallón de atún con costra de sésamo y vegetales al wok.', 29.00, 380.00, 42.00, 12.00, 14.00, TRUE, 'https://images.unsplash.com/photo-1501595091296-3aa953fc4ed0?auto=format&fit=crop&w=800&q=80');

SELECT setval(pg_get_serial_sequence('plato', 'id'), (SELECT MAX(id) FROM plato));
