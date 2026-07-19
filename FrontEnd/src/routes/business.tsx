import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, BarChart3, Calendar, Salad, Truck, Shield } from "lucide-react";

export const Route = createFileRoute("/business")({
  head: () => ({
    meta: [
      { title: "FitPrep para Negocios — Logística de nutrición semanal" },
      { name: "description", content: "Conectamos restaurantes, gimnasios y nutricionistas con atletas. Macros en tiempo real, producción optimizada, cero fricción." },
    ],
  }),
  component: BusinessLanding,
});

function BusinessLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-brand-500 grid place-items-center">
              <div className="size-3.5 rounded-full border-2 border-white" />
            </div>
            <span className="font-semibold tracking-tight text-lg">FitPrep</span>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground ml-1">Business</span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#producto" className="hover:text-foreground">Plataforma</a>
            <a href="#planes" className="hover:text-foreground">Planes y Precios</a>
            <Link to="/" className="hover:text-foreground">Volver a inicio</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium hover:text-brand-600">Ingresar</Link>
            <Link to="/register" className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 shadow-sm shadow-brand-500/20">
              Registra tu cocina <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 pt-24 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-medium mb-6">
              <span className="size-1.5 rounded-full bg-brand-500" /> B2B SaaS para restaurantes saludables
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-balance">
              Nutrición semanal, <span className="text-brand-600">producción impecable.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-[58ch]">
              Escala la operación de tu restaurante o cocina oculta. FitPrep es la plataforma SaaS multi-tenant que unifica tu catálogo, automatiza la planeación semanal de los clientes y optimiza la producción logística en un solo lugar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-brand-500 text-white font-medium hover:bg-brand-600 shadow-sm shadow-brand-500/20">
                Abre tu sucursal gratis <ArrowRight className="size-4" />
              </Link>
              <a href="#producto" className="inline-flex items-center gap-2 h-11 px-5 rounded-md border border-border bg-card font-medium hover:bg-muted">
                Ver funcionalidades
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><Check className="size-3.5 text-brand-600" /> Sin tarjeta de crédito</div>
              <div className="flex items-center gap-1.5"><Check className="size-3.5 text-brand-600" /> Tienda propia en 5 min</div>
              <div className="flex items-center gap-1.5"><Check className="size-3.5 text-brand-600" /> Soporte 24/7</div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-border bg-card shadow-xl shadow-brand-500/5 overflow-hidden">
              <div className="bg-muted px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="text-xs font-semibold text-foreground">Panel de Producción Kanban</div>
                <div className="flex gap-1">
                  <div className="size-2 rounded-full bg-rose-400" />
                  <div className="size-2 rounded-full bg-amber-400" />
                  <div className="size-2 rounded-full bg-green-400" />
                </div>
              </div>
              <div className="p-4 bg-surface/50 grid grid-cols-3 gap-3">
                {['Pendiente', 'Cocina', 'Empaque'].map((col, i) => (
                  <div key={col} className="bg-muted/50 rounded-lg p-2 min-h-[200px]">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">{col}</div>
                    {i === 0 && (
                      <>
                        <div className="bg-card border border-border rounded p-2 mb-2 shadow-sm">
                          <div className="text-[10px] bg-brand-100 text-brand-700 w-fit px-1.5 rounded mb-1">Lunes</div>
                          <div className="text-xs font-medium">Pollo Teriyaki</div>
                          <div className="text-[10px] text-muted-foreground mt-1">x15 porciones</div>
                        </div>
                        <div className="bg-card border border-border rounded p-2 mb-2 shadow-sm">
                          <div className="text-[10px] bg-brand-100 text-brand-700 w-fit px-1.5 rounded mb-1">Lunes</div>
                          <div className="text-xs font-medium">Salmón Fit</div>
                          <div className="text-[10px] text-muted-foreground mt-1">x8 porciones</div>
                        </div>
                      </>
                    )}
                    {i === 1 && (
                      <div className="bg-card border-l-2 border-l-amber-500 border-y border-r border-border rounded p-2 shadow-sm">
                        <div className="text-[10px] bg-blue-100 text-blue-700 w-fit px-1.5 rounded mb-1">Martes</div>
                        <div className="text-xs font-medium">Bowl Quinoa</div>
                        <div className="text-[10px] text-muted-foreground mt-1">x22 porciones</div>
                      </div>
                    )}
                    {i === 2 && (
                      <div className="bg-card border-l-2 border-l-green-500 border-y border-r border-border rounded p-2 shadow-sm">
                        <div className="text-[10px] bg-brand-100 text-brand-700 w-fit px-1.5 rounded mb-1">Lunes</div>
                        <div className="text-xs font-medium">Avena Nocturna</div>
                        <div className="text-[10px] text-muted-foreground mt-1">x30 porciones</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center text-[11px] uppercase tracking-widest text-muted-foreground mb-6">Cocinas impulsadas por FitPrep</div>
          <div className="flex flex-wrap items-center justify-center gap-10 text-muted-foreground/70 font-semibold tracking-tight">
            <span>FitKitchen</span><span>GymForce</span><span>Macrobox</span><span>Nutrilab</span><span>LeanMeal</span><span>VitalCo</span>
          </div>
        </div>
      </section>

      <section id="producto" className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl mb-14">
          <div className="text-[11px] uppercase tracking-widest text-brand-600 font-semibold mb-2">Características B2B</div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Diseñado para escalar la operación, no para complicarla.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Calendar, t: "Pedidos pre-planificados", d: "Los atletas eligen sus comidas con días de anticipación, optimizando tus compras y reduciendo desperdicio al 0%." },
            { icon: Salad, t: "Macros automatizados", d: "Tu catálogo muestra las macros exactas. Los clientes pueden filtrar tus platos según sus requerimientos nutricionales." },
            { icon: BarChart3, t: "Reportes empresariales", d: "Ventas, recurrencia, popularidad de platos y eficiencia de cocina en un dashboard en tiempo real." },
            { icon: Truck, t: "Logística consolidada", d: "Panel de producción de cocina (Kanban) y reportes de insumos agrupados para simplificar las preparaciones diarias." },
            { icon: Shield, t: "Plataforma Marca Blanca", d: "Tu propio espacio multi-tenant. Los clientes ven tu negocio, tu logo y tus platos bajo una interfaz ultra-premium." },
            { icon: Check, t: "Gestión de Cobranza", d: "Controla suscripciones, renueva planes semanales automáticamente y mantén un flujo de caja predecible." },
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
            <p className="mt-3 text-muted-foreground">Empieza a digitalizar tu cocina gratis. Escala cuando estés listo.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "Starter", p: "$0", d: "Hasta 50 planes/mes", f: ["Catálogo digital", "Panel de cocina básico", "Reportes mensuales"] },
              { n: "Growth", p: "$49", d: "Hasta 500 planes/mes", f: ["Producción kanban", "Métricas avanzadas", "Macros dinámicos", "Soporte prioritario"], featured: true },
              { n: "Scale", p: "$149", d: "Planes ilimitados", f: ["Multi-marca", "API & integraciones", "Reportes en tiempo real", "Asesor dedicado"] },
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
                <Link to="/register" className={`block text-center h-10 leading-10 rounded-md text-sm font-medium ${p.featured ? "bg-brand-500 text-white" : "border border-border hover:bg-muted"}`}>Comenzar prueba gratis</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="size-5 rounded-md bg-brand-500" />
            <span className="font-semibold text-foreground">FitPrep</span> · © 2026
          </div>
          <div className="flex gap-6">
            <Link to="/" className="font-medium hover:text-brand-600">Para Atletas</Link>
            <a href="#">Privacidad</a>
            <a href="#">Términos</a>
            <a href="#">Soporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
