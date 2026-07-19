import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  useNavigate,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página no encontrada</h2>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">Algo salió mal</h1>
        <div className="mt-6">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Reintentar</button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FitPrep — SaaS de Planificación Nutricional" },
      { name: "description", content: "Plataforma SaaS multi-tenant que conecta negocios de alimentación saludable con atletas que planifican su semana nutricional." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("usuario");
      let rol = "";
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          rol = parsed.rol; // ADMIN, TENANT, ATHLETE
        } catch (e) {
          console.error("Error parsing user from localStorage in RootComponent:", e);
        }
      }

      // 1. Si no está logueado e intenta entrar a rutas privadas
      if (!token) {
        if (
          pathname.startsWith("/admin") ||
          (pathname.startsWith("/tenant") && !pathname.startsWith("/tenants")) ||
          pathname.startsWith("/athlete")
        ) {
          console.warn("Acceso denegado: Usuario no autenticado. Redirigiendo a login.");
          navigate({ to: "/login" });
        }
      } else {
        // 2. Si está logueado e intenta entrar a login/register
        if (pathname === "/login" || pathname === "/register" || pathname === "/") {
          if (rol === "ADMIN") navigate({ to: "/admin" });
          else if (rol === "TENANT") navigate({ to: "/tenant" });
          else if (rol === "ATHLETE") navigate({ to: "/athlete" });
        }
        
        // 3. Si está logueado pero intenta entrar a secciones no permitidas para su rol
        if (pathname.startsWith("/admin") && rol !== "ADMIN") {
          console.warn(`Acceso denegado: El rol ${rol} no tiene permisos de ADMIN.`);
          if (rol === "TENANT") navigate({ to: "/tenant" });
          else navigate({ to: "/athlete" });
        }
        else if (pathname.startsWith("/tenant") && !pathname.startsWith("/tenants") && rol !== "TENANT") {
          console.warn(`Acceso denegado: El rol ${rol} no tiene permisos de TENANT.`);
          if (rol === "ADMIN") navigate({ to: "/admin" });
          else navigate({ to: "/athlete" });
        }
        else if (pathname.startsWith("/athlete") && rol !== "ATHLETE") {
          console.warn(`Acceso denegado: El rol ${rol} no tiene permisos de ATHLETE.`);
          if (rol === "ADMIN") navigate({ to: "/admin" });
          else navigate({ to: "/tenant" });
        }
      }
    }
  }, [pathname, navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
