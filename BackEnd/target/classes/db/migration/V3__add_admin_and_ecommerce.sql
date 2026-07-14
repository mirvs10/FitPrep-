-- =====================================================================
-- FitPrep · Expansión para Super Admin y E-Commerce
-- =====================================================================

-- 1. Añadir campos 'plan' y 'ciudad' a negocio
ALTER TABLE negocio ADD COLUMN plan VARCHAR(50) NOT NULL DEFAULT 'Starter';
ALTER TABLE negocio ADD COLUMN ciudad VARCHAR(100) NOT NULL DEFAULT 'Madrid';

-- 2. Tabla Pedido E-commerce (Cabecera)
CREATE TABLE pedido_ecommerce (
    id BIGSERIAL PRIMARY KEY,
    negocio_id INT NOT NULL,
    usuario_id BIGINT NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE', -- PENDING, PAID, PREPARING, SHIPPED, DELIVERED, CANCELLED
    monto_total DOUBLE PRECISION NOT NULL,
    direccion_entrega VARCHAR(255),
    fecha_entrega DATE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pedido_negocio FOREIGN KEY (negocio_id) REFERENCES negocio(id) ON DELETE CASCADE,
    CONSTRAINT fk_pedido_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- 3. Tabla Linea Pedido E-commerce (Detalle)
CREATE TABLE linea_pedido (
    id BIGSERIAL PRIMARY KEY,
    pedido_id BIGINT NOT NULL,
    plato_id BIGINT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DOUBLE PRECISION NOT NULL,
    CONSTRAINT fk_linea_pedido FOREIGN KEY (pedido_id) REFERENCES pedido_ecommerce(id) ON DELETE CASCADE,
    CONSTRAINT fk_linea_plato FOREIGN KEY (plato_id) REFERENCES plato(id) ON DELETE RESTRICT
);

-- 4. Actualizar datos existentes de ejemplo en negocio
UPDATE negocio SET plan = 'Growth', ciudad = 'Madrid' WHERE id = 1;

-- Índices para e-commerce
CREATE INDEX idx_pedido_negocio ON pedido_ecommerce (negocio_id);
CREATE INDEX idx_pedido_usuario ON pedido_ecommerce (usuario_id);
CREATE INDEX idx_linea_pedido ON linea_pedido (pedido_id);
