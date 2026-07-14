-- =====================================================================
-- FitPrep · Migración para Popular Negocios y Platos en BD
-- =====================================================================

-- 1. Insertar Negocios Reales del Mockup (si no existen)
INSERT INTO negocio (id, nombre_comercial, slug, ruc, telefono, estado, plan, ciudad)
VALUES
 (2, 'FitKitchen Madrid', 'fitkitchen', '20123456001', '912345678', 'ACTIVO', 'Pro', 'Madrid'),
 (3, 'GymForce Kitchen', 'gymforce', '20123456002', '934567890', 'ACTIVO', 'Growth', 'Barcelona'),
 (4, 'MacroBox', 'macrobox', '20123456003', '961234567', 'ACTIVO', 'Starter', 'Valencia'),
 (5, 'Nutrilab', 'nutrilab', '20123456004', '954567890', 'ACTIVO', 'Pro', 'Sevilla'),
 (6, 'LeanMeal Studio', 'leanmeal', '20123456005', '944567890', 'ACTIVO', 'Starter', 'Bilbao'),
 (7, 'VitalCo', 'vitalco', '20123456006', '952345678', 'ACTIVO', 'Growth', 'Málaga')
ON CONFLICT (id) DO NOTHING;

-- Resincronizar la secuencia de negocio
SELECT setval(pg_get_serial_sequence('negocio', 'id'), (SELECT MAX(id) FROM negocio));

-- 2. Insertar Platos para FitKitchen (id = 2) si no están ya registrados
-- Evitamos duplicados buscando por nombre y negocio_id
INSERT INTO plato (negocio_id, nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, disponible)
SELECT 2, 'Pollo al Limón & Quinoa', 'Pechuga de pollo al limón con quinoa real y vegetales asados.', 28.50, 520.00, 45.00, 52.00, 14.00, TRUE
WHERE NOT EXISTS (SELECT 1 FROM plato WHERE negocio_id = 2 AND nombre = 'Pollo al Limón & Quinoa');

INSERT INTO plato (negocio_id, nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, disponible)
SELECT 2, 'Pechuga de Pollo Teriyaki', 'Pollo glaseado en salsa teriyaki baja en sodio con arroz jazmín.', 26.00, 480.00, 48.00, 38.00, 12.00, TRUE
WHERE NOT EXISTS (SELECT 1 FROM plato WHERE negocio_id = 2 AND nombre = 'Pechuga de Pollo Teriyaki');

INSERT INTO plato (negocio_id, nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, disponible)
SELECT 2, 'Salmón con Espárragos', 'Salmón fresco grillado acompañado de espárragos y patatas baby.', 35.00, 580.00, 42.00, 24.00, 28.00, TRUE
WHERE NOT EXISTS (SELECT 1 FROM plato WHERE negocio_id = 2 AND nombre = 'Salmón con Espárragos');

INSERT INTO plato (negocio_id, nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, disponible)
SELECT 2, 'Avena con Frutos Rojos', 'Avena cremosa cocida con leche de almendras y frutos rojos.', 15.00, 380.00, 12.00, 64.00, 6.00, TRUE
WHERE NOT EXISTS (SELECT 1 FROM plato WHERE negocio_id = 2 AND nombre = 'Avena con Frutos Rojos');

-- 3. Insertar Platos para GymForce Kitchen (id = 3)
INSERT INTO plato (negocio_id, nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, disponible)
SELECT 3, 'Pollo BBQ con Arroz Integral', 'Pollo deshilachado en salsa BBQ artesanal con arroz integral.', 24.50, 560.00, 44.00, 60.00, 14.00, TRUE
WHERE NOT EXISTS (SELECT 1 FROM plato WHERE negocio_id = 3 AND nombre = 'Pollo BBQ con Arroz Integral');

INSERT INTO plato (negocio_id, nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, disponible)
SELECT 3, 'Ensalada César de Pollo', 'Hojas verdes, pechuga de pollo, crutones de garbanzo y aderezo light.', 22.00, 420.00, 36.00, 22.00, 20.00, TRUE
WHERE NOT EXISTS (SELECT 1 FROM plato WHERE negocio_id = 3 AND nombre = 'Ensalada César de Pollo');

INSERT INTO plato (negocio_id, nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, disponible)
SELECT 3, 'Lomo Saltado Fit', 'Cortes de carne magra, cebolla, tomate, pimientos, servido con arroz y papas horneadas.', 32.00, 620.00, 46.00, 55.00, 18.00, TRUE
WHERE NOT EXISTS (SELECT 1 FROM plato WHERE negocio_id = 3 AND nombre = 'Lomo Saltado Fit');

-- 4. Insertar Platos para MacroBox (id = 4)
INSERT INTO plato (negocio_id, nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, disponible)
SELECT 4, 'Bowl Vegano Proteico', 'Tofu orgánico marinado, garbanzos, quinua, aguacate y aderezo tahini.', 25.00, 490.00, 22.00, 58.00, 18.00, TRUE
WHERE NOT EXISTS (SELECT 1 FROM plato WHERE negocio_id = 4 AND nombre = 'Bowl Vegano Proteico');

INSERT INTO plato (negocio_id, nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, disponible)
SELECT 4, 'Curry de Lentejas', 'Guiso cremoso de lentejas con leche de coco y espinacas, servido con arroz integral.', 23.00, 450.00, 18.00, 65.00, 12.00, TRUE
WHERE NOT EXISTS (SELECT 1 FROM plato WHERE negocio_id = 4 AND nombre = 'Curry de Lentejas');

-- 5. Insertar Platos para Nutrilab (id = 5)
INSERT INTO plato (negocio_id, nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, disponible)
SELECT 5, 'Pollo al Curry & Coliflor', 'Pollo en salsa curry suave con arroz de coliflor and zanahorias baby.', 27.00, 390.00, 42.00, 18.00, 14.00, TRUE
WHERE NOT EXISTS (SELECT 1 FROM plato WHERE negocio_id = 5 AND nombre = 'Pollo al Curry & Coliflor');

INSERT INTO plato (negocio_id, nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, disponible)
SELECT 5, 'Pavo Asado con Camote', 'Pechuga de pavo asada al horno con puré de camote (batata) sin azúcar.', 28.00, 440.00, 38.00, 48.00, 10.00, TRUE
WHERE NOT EXISTS (SELECT 1 FROM plato WHERE negocio_id = 5 AND nombre = 'Pavo Asado con Camote');

-- 6. Insertar Platos para LeanMeal Studio (id = 6)
INSERT INTO plato (negocio_id, nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, disponible)
SELECT 6, 'Wrap de Tofu Light', 'Tortilla integral baja en carbohidratos, tofu sellado, vegetales y crema de yogur griego.', 19.50, 320.00, 16.00, 28.00, 10.00, TRUE
WHERE NOT EXISTS (SELECT 1 FROM plato WHERE negocio_id = 6 AND nombre = 'Wrap de Tofu Light');

INSERT INTO plato (negocio_id, nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, disponible)
SELECT 6, 'Pescado Blanco al Papillote', 'Filete de pescado al vapor con juliana de verduras y aceite de oliva.', 26.00, 310.00, 35.00, 12.00, 11.00, TRUE
WHERE NOT EXISTS (SELECT 1 FROM plato WHERE negocio_id = 6 AND nombre = 'Pescado Blanco al Papillote');

-- 7. Insertar Platos para VitalCo (id = 7)
INSERT INTO plato (negocio_id, nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, disponible)
SELECT 7, 'Hamburguesa de Lentejas y Quinua', 'Medallón de lentejas y quinua con pan integral, lechuga y tomate.', 21.00, 460.00, 18.00, 56.00, 14.00, TRUE
WHERE NOT EXISTS (SELECT 1 FROM plato WHERE negocio_id = 7 AND nombre = 'Hamburguesa de Lentejas y Quinua');

INSERT INTO plato (negocio_id, nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, disponible)
SELECT 7, 'Fettuccine de Espinaca con Pesto', 'Pasta artesanal de espinaca con pesto de albahaca, nueces y tofu salteado.', 24.00, 530.00, 20.00, 62.00, 19.00, TRUE
WHERE NOT EXISTS (SELECT 1 FROM plato WHERE negocio_id = 7 AND nombre = 'Fettuccine de Espinaca con Pesto');

-- Resincronizar la secuencia de plato
SELECT setval(pg_get_serial_sequence('plato', 'id'), (SELECT MAX(id) FROM plato));

-- 8. Insertar Plan Semanal Inicial de Bruno (usuario_id = 2) para simular comidas de hoy en el dashboard (solo si no tiene planes)
INSERT INTO plan_semanal (negocio_id, usuario_id, fecha_inicio_semana, estado_pago, monto_total)
SELECT 1, 2, '2026-07-06', 'APROBADO', 87.50
WHERE NOT EXISTS (SELECT 1 FROM plan_semanal WHERE usuario_id = 2);

-- Insertar detalles de plan semanales asociados al plan creado
-- Buscamos el plan recién insertado para el usuario_id = 2
INSERT INTO detalle_plan (plan_semanal_id, plato_id, dia_semana, tipo_comida, cantidad)
SELECT (SELECT MAX(id) FROM plan_semanal WHERE usuario_id = 2), 1, 'Lun', 'Almuerzo', 1
WHERE EXISTS (SELECT 1 FROM plan_semanal WHERE usuario_id = 2) 
  AND NOT EXISTS (SELECT 1 FROM detalle_plan dp WHERE dp.plan_semanal_id = (SELECT MAX(id) FROM plan_semanal WHERE usuario_id = 2));

INSERT INTO detalle_plan (plan_semanal_id, plato_id, dia_semana, tipo_comida, cantidad)
SELECT (SELECT MAX(id) FROM plan_semanal WHERE usuario_id = 2), 4, 'Lun', 'Cena', 1
WHERE EXISTS (SELECT 1 FROM plan_semanal WHERE usuario_id = 2)
  AND (SELECT count(*) FROM detalle_plan WHERE plan_semanal_id = (SELECT MAX(id) FROM plan_semanal WHERE usuario_id = 2)) < 8;

INSERT INTO detalle_plan (plan_semanal_id, plato_id, dia_semana, tipo_comida, cantidad)
SELECT (SELECT MAX(id) FROM plan_semanal WHERE usuario_id = 2), 2, 'Mar', 'Almuerzo', 1
WHERE EXISTS (SELECT 1 FROM plan_semanal WHERE usuario_id = 2)
  AND (SELECT count(*) FROM detalle_plan WHERE plan_semanal_id = (SELECT MAX(id) FROM plan_semanal WHERE usuario_id = 2)) < 8;

INSERT INTO detalle_plan (plan_semanal_id, plato_id, dia_semana, tipo_comida, cantidad)
SELECT (SELECT MAX(id) FROM plan_semanal WHERE usuario_id = 2), 3, 'Mié', 'Almuerzo', 1
WHERE EXISTS (SELECT 1 FROM plan_semanal WHERE usuario_id = 2)
  AND (SELECT count(*) FROM detalle_plan WHERE plan_semanal_id = (SELECT MAX(id) FROM plan_semanal WHERE usuario_id = 2)) < 8;

INSERT INTO detalle_plan (plan_semanal_id, plato_id, dia_semana, tipo_comida, cantidad)
SELECT (SELECT MAX(id) FROM plan_semanal WHERE usuario_id = 2), 4, 'Jue', 'Almuerzo', 1
WHERE EXISTS (SELECT 1 FROM plan_semanal WHERE usuario_id = 2)
  AND (SELECT count(*) FROM detalle_plan WHERE plan_semanal_id = (SELECT MAX(id) FROM plan_semanal WHERE usuario_id = 2)) < 8;

INSERT INTO detalle_plan (plan_semanal_id, plato_id, dia_semana, tipo_comida, cantidad)
SELECT (SELECT MAX(id) FROM plan_semanal WHERE usuario_id = 2), 1, 'Vie', 'Almuerzo', 1
WHERE EXISTS (SELECT 1 FROM plan_semanal WHERE usuario_id = 2)
  AND (SELECT count(*) FROM detalle_plan WHERE plan_semanal_id = (SELECT MAX(id) FROM plan_semanal WHERE usuario_id = 2)) < 8;

INSERT INTO detalle_plan (plan_semanal_id, plato_id, dia_semana, tipo_comida, cantidad)
SELECT (SELECT MAX(id) FROM plan_semanal WHERE usuario_id = 2), 2, 'Sáb', 'Almuerzo', 1
WHERE EXISTS (SELECT 1 FROM plan_semanal WHERE usuario_id = 2)
  AND (SELECT count(*) FROM detalle_plan WHERE plan_semanal_id = (SELECT MAX(id) FROM plan_semanal WHERE usuario_id = 2)) < 8;

INSERT INTO detalle_plan (plan_semanal_id, plato_id, dia_semana, tipo_comida, cantidad)
SELECT (SELECT MAX(id) FROM plan_semanal WHERE usuario_id = 2), 3, 'Dom', 'Almuerzo', 1
WHERE EXISTS (SELECT 1 FROM plan_semanal WHERE usuario_id = 2)
  AND (SELECT count(*) FROM detalle_plan WHERE plan_semanal_id = (SELECT MAX(id) FROM plan_semanal WHERE usuario_id = 2)) < 8;

-- Resincronizar secuencia
SELECT setval(pg_get_serial_sequence('plan_semanal', 'id'), (SELECT MAX(id) FROM plan_semanal));
SELECT setval(pg_get_serial_sequence('detalle_plan', 'id'), (SELECT MAX(id) FROM detalle_plan));
