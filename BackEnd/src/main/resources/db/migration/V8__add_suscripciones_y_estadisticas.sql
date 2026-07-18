
CREATE TABLE estadisticas_historicas (
    id SERIAL PRIMARY KEY,
    fecha VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    mrr DECIMAL(10,2) NOT NULL,
    churn_rate DECIMAL(5,2) NOT NULL,
    nuevos_negocios INT NOT NULL
);

CREATE TABLE suscripcion (
    id SERIAL PRIMARY KEY,
    negocio_id INT NOT NULL,
    plan VARCHAR(50) NOT NULL,
    estado_pago VARCHAR(50) NOT NULL, -- e.g., 'AL_DIA', 'VENCIDO', 'FALLIDO'
    proximo_cobro TIMESTAMP,
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    CONSTRAINT fk_suscripcion_negocio FOREIGN KEY (negocio_id) REFERENCES negocio(id) ON DELETE CASCADE
);

-- Populate some mock historical data for reports
INSERT INTO estadisticas_historicas (fecha, mrr, churn_rate, nuevos_negocios) VALUES
('2026-01', 500.00, 1.2, 5),
('2026-02', 650.00, 1.5, 8),
('2026-03', 850.00, 2.0, 12),
('2026-04', 1100.00, 1.8, 15),
('2026-05', 1450.00, 2.2, 20),
('2026-06', 1900.00, 2.4, 25);
