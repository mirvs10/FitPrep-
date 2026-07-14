-- Seed Super Admin user for local testing
-- Contraseña en claro: password123
INSERT INTO usuario (negocio_id, nombres, apellidos, email, password_hash, rol)
VALUES (1, 'Super', 'Admin', 'superadmin@fitprep.com', 
        '$2a$10$WVL6RyzeGLd5QNj6j52jJ.YLJVwJN2mAPMV0YaUjcT/HIqpH9dCnu', 'ADMIN');
