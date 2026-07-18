# Guía de Pruebas Manuales - FitPrep (QA)

Bienvenido a la guía de testeo de **FitPrep**. Este documento te llevará de la mano para que puedas probar todas las funcionalidades principales del sistema, tanto desde la perspectiva de un **Restaurante (Tenant)** como de un **Cliente (Atleta)** y del **SuperAdmin (Dueño del SaaS)**.

---

## 1. Preparación del Entorno

1. Abre tu navegador y dirígete a la URL del frontend: `http://localhost:5173` (o el puerto que te indique la consola, por ejemplo `8081`).
2. Ten esta guía abierta para copiar los correos de prueba. La **contraseña universal** para todas las cuentas es: `password123`.

---

## 2. Flujo 1: El Cliente (Atleta) hace un Pedido Multi-Restaurante

Este flujo demuestra cómo el sistema maneja múltiples restaurantes (Tenants) de forma transparente para el cliente.

### Paso a paso:
1. **Inicia sesión** con la cuenta del Atleta:
   - **Email:** `user1@gmail.com`
   - **Contraseña:** `password123`
2. **Explora el catálogo:** Al entrar, deberías ver una lista de restaurantes disponibles (CoffeeFit y PrimeFit). Entra a **CoffeeFit**.
3. **Agrega al carrito:** Selecciona el plato "Pollo Teriyaki Express" y agrégalo al carrito.
4. **Cambia de restaurante:** Regresa a la página principal de restaurantes y entra a **PrimeFit**.
5. **Agrega más al carrito:** Selecciona "Prime Beef Bowl" y agrégalo también al carrito.
6. **Checkout (Pagar):** Ve a tu carrito de compras y procede a finalizar el pedido.
7. **Verifica tus pedidos:** Ve a la sección **"Mis Planes"**. Verás que el sistema ha generado **dos pedidos por separado**, uno para CoffeeFit y otro para PrimeFit, asegurando que las finanzas de los restaurantes no se mezclen.

---

## 3. Flujo 2: El Restaurante (Tenant) gestiona su Menú

Este flujo demuestra cómo los restaurantes tienen su propia área privada (Multi-tenancy) y cómo la eliminación segura (Soft Delete) protege el historial.

### Paso a paso:
1. **Cierra sesión** del usuario atleta.
2. **Inicia sesión** como dueño de PrimeFit:
   - **Email:** `primefit@gmail.com`
   - **Contraseña:** `password123`
3. **Revisa las órdenes (Gestión de Pedidos):** Deberías ver el pedido que el atleta acaba de realizar por el "Prime Beef Bowl".
4. **Agrega un nuevo plato:** Ve a **Gestión de Platos -> Agregar**. Llena los datos con un nombre como "Plato de Prueba", ponle un precio y guárdalo.
5. **Prueba el Soft Delete (Eliminación Lógica):** 
   - Ve a la lista de platos y elimina el "Prime Beef Bowl" (el plato que el atleta compró en el Flujo 1).
   - *Nota Técnica:* El plato desaparecerá de tu menú, pero la base de datos lo mantiene oculto.
6. **Verifica la integridad:** Cierra sesión, vuelve a entrar como el Atleta (`user1@gmail.com`) y ve a **"Mis Planes"**. Verás que tu recibo antiguo del "Prime Beef Bowl" sigue intacto, demostrando que el sistema es seguro y no se corrompe al eliminar platos pasados.

---

## 4. Flujo 3: El Dueño de la Plataforma (SuperAdmin)

Este flujo demuestra el control global de la plataforma (Panel SaaS).

### Paso a paso:
1. **Inicia sesión** como Super Admin:
   - **Email:** `admin@fitprep.com`
   - **Contraseña:** `password123`
2. **Dashboard Global:** Verás las estadísticas sumadas de todos los restaurantes (MRR, Churn Rate, etc.).
3. **Gestión de Negocios:** 
   - Entra a la lista de negocios. Verás a PrimeFit y CoffeeFit.
   - Prueba a **suspender** temporalmente a CoffeeFit cambiando su estado.
4. **Verificación:** Si intentas iniciar sesión como `coffeefit@gmail.com`, el sistema debería reflejar que la cuenta está suspendida o inactiva, y el Atleta ya no debería ver a CoffeeFit en su catálogo.

---

## ✅ Lista de Comprobación (Checklist de Éxito)
- [ ] ¿El carrito de compras pudo procesar platos de dos restaurantes distintos?
- [ ] ¿Se crearon recibos separados para cada restaurante?
- [ ] ¿Al borrar un plato en el panel de restaurante, el historial del atleta siguió funcionando sin dar error?
- [ ] ¿El SuperAdmin puede ver a todos los negocios en su panel?

¡Con esto habrás probado toda la arquitectura base del producto mínimo viable (MVP)!
