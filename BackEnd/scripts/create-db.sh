#!/usr/bin/env bash
# =====================================================================
# Crea la base de datos "Fitprep" en el Postgres local.
# Las TABLAS y los DATOS los aplica Flyway al arrancar la app
# (src/main/resources/db/migration). Este script solo crea la BD vacía.
#
# Uso:
#   ./scripts/create-db.sh
#
# Variables opcionales (con sus valores por defecto):
#   PGHOST=localhost PGPORT=5432 PGUSER=postgres PGPASSWORD=root DB_NAME=Fitprep
# =====================================================================
set -euo pipefail

PGHOST="${PGHOST:-localhost}"
PGPORT="${PGPORT:-5432}"
PGUSER="${PGUSER:-postgres}"
export PGPASSWORD="${PGPASSWORD:-root}"
DB_NAME="${DB_NAME:-Fitprep}"

echo "→ Conectando a Postgres en ${PGHOST}:${PGPORT} como ${PGUSER}"

exists=$(psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -tAc \
  "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}';")

if [ "$exists" = "1" ]; then
  echo "✔ La base de datos \"${DB_NAME}\" ya existe. Nada que hacer."
else
  psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -c "CREATE DATABASE \"${DB_NAME}\";"
  echo "✔ Base de datos \"${DB_NAME}\" creada."
fi

echo "→ Ahora arranca la app; Flyway creará las tablas y el seed:"
echo "    ./mvnw spring-boot:run"
