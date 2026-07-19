import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Target, Calendar, Salad, Flame } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FitPrep — Encuentra y planifica tus objetivos nutricionales" },
      { name: "description", content: "Los mejores restaurantes saludables aquí. Planifica tus comidas semanales y alcanza tus metas." },
    ],
  }),
  component: LandingAtletas,
});

function LandingAtletas() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-brand-500 grid place-items-center">
              <div className="size-3.5 rounded-full border-2 border-white" />
            </div>
            <span className="font-semibold tracking-tight text-lg">FitPrep</span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#como-funciona" className="hover:text-foreground">¿Cómo funciona?</a>
            <a href="#beneficios" className="hover:text-foreground">Beneficios</a>
            <Link to="/business" className="font-medium text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full">¿Eres un negocio?</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium hover:text-brand-600">Iniciar sesión</Link>
            <Link to="/register" className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 shadow-sm shadow-brand-500/20">
              Crear cuenta <ArrowRight className="size-3.5" />
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
              Encuentra y planifica tus objetivos. <br/><span className="text-brand-600">Los mejores restaurantes saludables aquí.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-[58ch]">
              Descubre opciones deliciosas, organiza tus comidas de la semana y alcanza tus metas nutricionales sin el estrés de cocinar o calcular porciones.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/tenants" className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-brand-500 text-white font-medium hover:bg-brand-600 shadow-sm shadow-brand-500/20">
                Explorar catálogo <ArrowRight className="size-4" />
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 h-11 px-5 rounded-md border border-border bg-card font-medium hover:bg-muted">
                Empezar gratis
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><Check className="size-3.5 text-brand-600" /> Únete gratis</div>
              <div className="flex items-center gap-1.5"><Check className="size-3.5 text-brand-600" /> Macros garantizados</div>
              <div className="flex items-center gap-1.5"><Check className="size-3.5 text-brand-600" /> Mejores restaurantes</div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xl shadow-brand-500/5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Progreso de Hoy</div>
                <span className="text-[10px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-semibold">En objetivo</span>
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

      <section id="como-funciona" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-[11px] uppercase tracking-widest text-brand-600 font-semibold mb-2">Paso a paso</div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">¿Cómo funciona FitPrep?</h2>
          <p className="mt-4 text-muted-foreground">Tu semana resuelta en tres simples pasos. Olvídate de cocinar y lavar platos.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10 relative">
          {/* Línea conectora de fondo (visible en desktop) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-brand-100 via-brand-200 to-brand-100" />
          
          {[
            { step: "01", title: "Elige un restaurante", desc: "Explora nuestro catálogo de cocinas verificadas, especializadas en nutrición y comidas saludables." },
            { step: "02", title: "Arma tu semana", desc: "Selecciona qué comerás de lunes a domingo. Visualiza los macros de cada plato al instante." },
            { step: "03", title: "Disfruta tus metas", desc: "El restaurante preparará tus comidas exactamente como las pediste, listas para tu semana." }
          ].map((item, i) => (
            <div key={item.step} className="relative flex flex-col items-center text-center">
              <div className="size-24 rounded-full bg-background border-4 border-surface shadow-sm flex items-center justify-center relative z-10 mb-6">
                <div className="size-20 rounded-full bg-brand-50 flex items-center justify-center">
                  <span className="text-2xl font-bold text-brand-600">{item.step}</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold tracking-tight mb-3">{item.title}</h3>
              <p className="text-sm text-muted-foreground px-4">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="beneficios" className="border-t border-border bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl mb-14">
            <div className="text-[11px] uppercase tracking-widest text-brand-600 font-semibold mb-2">Para Atletas</div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Todo lo que necesitas para ser consistente.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Calendar, t: "Planeación semanal", d: "Arma tu menú de lunes a domingo y olvídate de improvisar qué comer." },
              { icon: Target, t: "Macros calculados", d: "Cada plato te muestra exactamente cuánta proteína y calorías aporta." },
              { icon: Salad, t: "Los mejores locales", d: "Filtramos y verificamos cocinas saludables de alta calidad." },
              { icon: Flame, t: "Alcanza tu meta", d: "Sea ganar músculo o perder grasa, tener la comida lista es el 80% del trabajo." },
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
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="size-5 rounded-md bg-brand-500" />
            <span className="font-semibold text-foreground">FitPrep</span> · © 2026
          </div>
          <div className="flex gap-6">
            <Link to="/business" className="font-medium hover:text-brand-600">Para Negocios</Link>
            <a href="#">Privacidad</a>
            <a href="#">Términos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
