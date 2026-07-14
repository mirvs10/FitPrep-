import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, BarChart3, Calendar, Salad, Truck, Shield } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NutriFlow — Logística de nutrición semanal para negocios saludables" },
      { name: "description", content: "Conectamos restaurantes, gimnasios y nutricionistas con atletas que planifican su semana. Macros en tiempo real, producción optimizada, cero fricción." },
      { property: "og:title", content: "NutriFlow — SaaS de planificación nutricional" },
      { property: "og:description", content: "Plataforma multi-tenant para planificar comidas saludables semana a semana." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-brand-500 grid place-items-center">
              <div className="size-3.5 rounded-full border-2 border-white" />
            </div>
            <span className="font-semibold tracking-tight text-lg">NutriFlow</span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#producto" className="hover:text-foreground">Producto</a>
            <a href="#negocios" className="hover:text-foreground">Para negocios</a>
            <a href="#atletas" className="hover:text-foreground">Para atletas</a>
            <a href="#planes" className="hover:text-foreground">Planes</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium hover:text-brand-600">Ingresar</Link>
            <Link to="/register" className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 shadow-sm shadow-brand-500/20">
              Prueba gratis <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 pt-24 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-medium mb-6">
              <span className="size-1.5 rounded-full bg-brand-500" /> Nuevo · Planeación con macros en tiempo real
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-balance">
              Nutrición semanal, <span className="text-brand-600">producción impecable.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-[58ch]">
              NutriFlow es la plataforma SaaS multi-tenant para restaurantes saludables, gimnasios y nutricionistas que quieren operar como un equipo profesional: catálogo, pedidos semanales, cocina y logística en un solo lugar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/tenants" className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-brand-500 text-white font-medium hover:bg-brand-600 shadow-sm shadow-brand-500/20">
                Explorar negocios <ArrowRight className="size-4" />
              </Link>
              <Link to="/tenant" className="inline-flex items-center gap-2 h-11 px-5 rounded-md border border-border bg-card font-medium hover:bg-muted">
                Ver demo de cocina
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><Check className="size-3.5 text-brand-600" /> Sin tarjeta de crédito</div>
              <div className="flex items-center gap-1.5"><Check className="size-3.5 text-brand-600" /> Configuración en 5 minutos</div>
              <div className="flex items-center gap-1.5"><Check className="size-3.5 text-brand-600" /> Soporte 24/7</div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xl shadow-brand-500/5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Lunes 12</div>
                <span className="text-[10px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-semibold">87% objetivo</span>
              </div>
              <div className="relative size-40 mx-auto" >
                <div className="rounded-full size-40" style={{ background: "conic-gradient(var(--brand-500) 313deg, var(--muted) 0)" }} />
                <div className="absolute inset-4 rounded-full bg-card grid place-items-center">
                  <div className="text-center">
                    <div className="text-2xl font-semibold tabular-nums">2,450</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest">kcal hoy</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {[["Proteína", 86, "180 / 210g"], ["Carbohidratos", 70, "210 / 300g"], ["Grasas", 92, "69 / 75g"]].map(([l, v, t]) => (
                  <div key={l as string}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">{l}</span><span className="font-medium tabular-nums">{t}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-brand-500" style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center text-[11px] uppercase tracking-widest text-muted-foreground mb-6">Usado por equipos de</div>
          <div className="flex flex-wrap items-center justify-center gap-10 text-muted-foreground/70 font-semibold tracking-tight">
            <span>FitKitchen</span><span>GymForce</span><span>Macrobox</span><span>Nutrilab</span><span>LeanMeal</span><span>VitalCo</span>
          </div>
        </div>
      </section>

      <section id="producto" className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl mb-14">
          <div className="text-[11px] uppercase tracking-widest text-brand-600 font-semibold mb-2">Una plataforma, dos lados</div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Diseñado para escalar la operación, no para complicarla.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Calendar, t: "Planeación semanal", d: "Los atletas eligen sus comidas con anticipación, optimizando tu producción y reduciendo desperdicio." },
            { icon: Salad, t: "Macros en tiempo real", d: "Cada selección recalcula calorías, proteína, carbos y grasas según los objetivos del usuario." },
            { icon: BarChart3, t: "Reportes claros", d: "Ventas, retención y eficiencia de cocina con la profundidad de un dashboard empresarial." },
            { icon: Truck, t: "Logística integrada", d: "Calendario de producción, lista de compras automática y gestión de entregas en una sola vista." },
            { icon: Shield, t: "Multi-tenant seguro", d: "Cada negocio tiene su propio espacio aislado con dominio, marca y catálogo independientes." },
            { icon: Check, t: "Componentes reutilizables", d: "Diseño consistente en cada rincón: tablas, kanban, modales, gráficos y formularios." },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl border border-border bg-card p-6 hover:border-brand-500/30 transition-colors">
              <div className="size-9 rounded-lg bg-brand-50 grid place-items-center mb-4">
                <f.icon className="size-4 text-brand-600" />
              </div>
              <h3 className="font-semibold mb-1.5">{f.t}</h3>
              <p className="text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="planes" className="border-t border-border bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Precios simples, sin sorpresas.</h2>
            <p className="mt-3 text-muted-foreground">Empieza gratis. Escala cuando estés listo.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "Starter", p: "$0", d: "Hasta 50 pedidos/mes", f: ["Catálogo básico", "1 sede", "Reportes mensuales"] },
              { n: "Growth", p: "$49", d: "Hasta 500 pedidos/mes", f: ["Producción kanban", "3 sedes", "Macros avanzados", "Soporte prioritario"], featured: true },
              { n: "Scale", p: "$149", d: "Pedidos ilimitados", f: ["Multi-sede", "API & integraciones", "Reportes en tiempo real", "Gerente dedicado"] },
            ].map((p) => (
              <div key={p.n} className={`rounded-2xl p-7 ${p.featured ? "bg-foreground text-background ring-2 ring-brand-500" : "bg-card border border-border"}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold tracking-wide uppercase">{p.n}</div>
                  {p.featured && <span className="text-[10px] bg-brand-500 text-white px-2 py-0.5 rounded-full font-semibold">Popular</span>}
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-semibold tracking-tight">{p.p}</span>
                  <span className="text-sm opacity-60">/mes</span>
                </div>
                <p className="text-sm opacity-70 mb-6">{p.d}</p>
                <ul className="space-y-2 text-sm mb-7">
                  {p.f.map((x) => <li key={x} className="flex items-center gap-2"><Check className="size-3.5 text-brand-500" /> {x}</li>)}
                </ul>
                <Link to="/register" className={`block text-center h-10 leading-10 rounded-md text-sm font-medium ${p.featured ? "bg-brand-500 text-white" : "border border-border hover:bg-muted"}`}>Empezar</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="size-5 rounded-md bg-brand-500" />
            <span className="font-semibold text-foreground">NutriFlow</span> · © 2026
          </div>
          <div className="flex gap-6"><a href="#">Privacidad</a><a href="#">Términos</a><a href="#">Contacto</a></div>
        </div>
      </footer>
    </div>
  );
}
