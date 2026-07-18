# FitPrep · Plataforma SaaS Multi-Tenant para Meal Prep

Este repositorio unificado contiene la plataforma **FitPrep**, un sistema SaaS diseñado para empresas de preparación de comidas saludables e instructores de nutrición (cocinas/tenants) y sus respectivos clientes fitness (atletas).

El proyecto está organizado en una arquitectura monorepo simple:
*   `BackEnd/`: Backend construido en **Java 17 (Spring Boot)** bajo una estructura de **Arquitectura Hexagonal**.
*   `FrontEnd/`: Frontend interactivo y moderno construido en **React (Vite, TypeScript, TanStack Router)**.

---

## Requisitos Previos

Antes de levantar el proyecto de forma local, asegúrate de tener instalado:
*   **Java JDK 17** o superior.
*   **PostgreSQL** (corriendo localmente en el puerto `5432`).
*   **Node.js** (v18+) o **Bun** (recomendado para el frontend).

---

## 🚀 Despliegue Local del Backend (`BackEnd/`)

El backend de Spring Boot gestiona la base de datos a través de migraciones automatizadas de Flyway y maneja la autenticación mediante tokens JWT y multi-tenancy a través de Hibernate `@TenantId`.

### 1. Configurar la Base de Datos
1. Abre tu gestor de base de datos PostgreSQL (pgAdmin, DBeaver, etc.) o tu terminal de psql.
2. Crea una base de datos vacía llamada `Fitprep`:
   ```sql
   CREATE DATABASE "Fitprep";
   ```
3. Por defecto, Spring Boot intentará conectarse con las credenciales:
   *   **User:** `postgres`
   *   **Password:** `root`
   *   **URL:** `jdbc:postgresql://localhost:5432/Fitprep`
   
   *(Si tus credenciales locales son diferentes, puedes definir las variables de entorno `DB_URL`, `DB_USERNAME` y `DB_PASSWORD`).*

### 2. Iniciar el Backend
Dirígete a la carpeta `BackEnd/` desde tu terminal y ejecuta el envoltorio de Maven (`mvnw`):

*   **En Windows (PowerShell/CMD):**
    ```bash
    cd BackEnd
    .\mvnw.cmd spring-boot:run
    ```
*   **En Linux/macOS:**
    ```bash
    cd BackEnd
    chmod +x mvnw
    ./mvnw spring-boot:run
    ```

El servidor del backend se levantará en el puerto **`http://localhost:8080`**. Al iniciarse por primera vez, Flyway correrá las migraciones de base de datos automáticamente e insertará datos de prueba (`V2__seed.sql`).

---

## 💻 Despliegue Local del Frontend (`FrontEnd/`)

El frontend está desarrollado con React, Vite y gestiona su enrutamiento mediante TanStack Router.

### 1. Instalar dependencias
Navega a la carpeta `FrontEnd/` e instala las dependencias de Node:

*   **Usando Bun (Recomendado):**
    ```bash
    cd FrontEnd
    bun install
    ```
*   **Usando npm:**
    ```bash
    cd FrontEnd
    npm install
    ```

### 2. Levantar el Servidor de Desarrollo
Inicia el entorno de desarrollo local:

*   **Con Bun:**
    ```bash
    bun dev
    ```
*   **Con npm:**
    ```bash
    npm run dev
    ```

El servidor web abrirá la aplicación en **`http://localhost:5173`** (o el puerto indicado en consola).

---

## 🔑 Credenciales de Prueba (Seed Data)

La base de datos se inicializa con dos usuarios por defecto para que pruebes los flujos de inmediato (la contraseña para ambos es `password123`):

| Rol | Correo Electrónico | Contraseña | Descripción |
| :--- | :--- | :--- | :--- |
| **ADMIN (SaaS)** | `admin@fitprep.com` | `password123` | Panel Global. Gestiona Restaurantes y Usuarios. |
| **TENANT (Restaurante 1)** | `coffeefit@gmail.com` | `password123` | Restaurante CoffeeFit (Tiene platos creados). |
| **TENANT (Restaurante 2)** | `primefit@gmail.com` | `password123` | Restaurante PrimeFit (Tiene platos creados). |
| **ATHLETE (Cliente)** | `user1@gmail.com` | `password123` | Puede ver ambos restaurantes y realizar pedidos. |

---

## 🛠️ Arquitectura del Backend

El backend sigue las directrices de la **Arquitectura Hexagonal (Ports & Adapters)** para mantener el dominio aislado de librerías externas o detalles de infraestructura:
*   `domain/model/`: Contiene los modelos puros y las reglas de negocio críticas.
*   `domain/port/`: Puertos de Entrada (`in` - Casos de Uso) y Salida (`out` - Interfaces de repositorios).
*   `application/service/`: Orquestación y lógica de servicios de aplicación.
*   `infrastructure/adapter/in/web/`: Controladores REST.
*   `infrastructure/adapter/out/persistence/`: Repositorios JPA y entidades de persistencia mapeadas.
