-- =====================================================================
-- FitPrep · Esquema inicial
-- =====================================================================

-- 1. Tabla Negocio (Tenants)
CREATE TABLE negocio (
    id BIGSERIAL PRIMARY KEY,
    nombre_comercial VARCHAR(150) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    ruc VARCHAR(11) NOT NULL UNIQUE,
    telefono VARCHAR(15),
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla Usuario (Clientes)
CREATE TABLE usuario (
    id BIGSERIAL PRIMARY KEY,
    negocio_id INT NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'ATHLETE',
    objetivo_fitness VARCHAR(50),
    requerimiento_kcal DOUBLE PRECISION,
    req_proteinas_g DOUBLE PRECISION,
    req_carbohidratos_g DOUBLE PRECISION,
    req_grasas_g DOUBLE PRECISION,
    CONSTRAINT fk_usuario_negocio FOREIGN KEY (negocio_id) REFERENCES negocio(id) ON DELETE CASCADE
);

-- 3. Tabla Plato (Catálogo)
CREATE TABLE plato (
    id BIGSERIAL PRIMARY KEY,
    negocio_id INT NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    descripcion TEXT,
    precio DOUBLE PRECISION NOT NULL,
    calorias DOUBLE PRECISION NOT NULL,
    proteinas DOUBLE PRECISION NOT NULL,
    carbohidratos DOUBLE PRECISION NOT NULL,
    grasas DOUBLE PRECISION NOT NULL,
    disponible BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_plato_negocio FOREIGN KEY (negocio_id) REFERENCES negocio(id) ON DELETE CASCADE
);

-- 4. Tabla Plan Semanal (Cabecera)
CREATE TABLE plan_semanal (
    id BIGSERIAL PRIMARY KEY,
    negocio_id INT NOT NULL,
    usuario_id BIGINT NOT NULL,
    fecha_inicio_semana DATE NOT NULL,
    estado_pago VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    monto_total DOUBLE PRECISION NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_plan_negocio FOREIGN KEY (negocio_id) REFERENCES negocio(id) ON DELETE CASCADE,
    CONSTRAINT fk_plan_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- 5. Tabla Detalle Plan (Distribución)
CREATE TABLE detalle_plan (
    id BIGSERIAL PRIMARY KEY,
    plan_semanal_id BIGINT NOT NULL,
    plato_id BIGINT NOT NULL,
    dia_semana VARCHAR(15) NOT NULL,
    tipo_comida VARCHAR(20) NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_detalle_plan FOREIGN KEY (plan_semanal_id) REFERENCES plan_semanal(id) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_plato FOREIGN KEY (plato_id) REFERENCES plato(id) ON DELETE RESTRICT
);

-- Índices para el filtrado multi-tenant (columna @TenantId) y accesos frecuentes
CREATE INDEX idx_usuario_negocio ON usuario (negocio_id);
CREATE INDEX idx_plato_negocio ON plato (negocio_id);
CREATE INDEX idx_plan_negocio ON plan_semanal (negocio_id);
CREATE INDEX idx_plan_semana ON plan_semanal (fecha_inicio_semana, estado_pago);
CREATE INDEX idx_detalle_plan ON detalle_plan (plan_semanal_id);
CREATE INDEX idx_detalle_plato ON detalle_plan (plato_id);
