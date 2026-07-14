import { createFileRoute, Link } from "@tanstack/react-router";
import { MockupShell, Card, Btn, Badge } from "@/components/mockup/Shell";
import { MapPin, Star, Clock, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/tenants/$slug/")({
  head: ({ params }) => ({ meta: [{ title: `${params.slug} — NutriFlow` }, { name: "description", content: `Perfil público del negocio ${params.slug} en NutriFlow.` }] }),
  component: TenantProfile,
});

function TenantProfile() {
  const { slug } = Route.useParams();
  const name = slug === "coffeefit" ? "CoffeeFit" : slug === "primefit" ? "PrimeFit" : slug;
  const initials = name.substring(0,2).toUpperCase();

  return (
    <MockupShell breadcrumbs={["Inicio", "Negocios", name]}>
      <div className="relative h-56 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700" />
      <div className="px-8 -mt-16 max-w-6xl mx-auto pb-12">
        <Card className="p-7">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="size-24 rounded-2xl bg-brand-100 border border-border grid place-items-center text-2xl font-bold text-brand-700">{initials}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge tone="brand">High-Protein</Badge>
                <Badge tone="blue"><ShieldCheck className="size-3" /> Verificado</Badge>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
              <p className="text-sm text-muted-foreground mt-1">Comidas preparadas de alta calidad, macro-calculadas.</p>
              <div className="flex flex-wrap gap-5 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><Star className="size-3.5 fill-amber-400 text-amber-400" /> 4.9 · 248 reseñas</div>
                <div className="flex items-center gap-1"><MapPin className="size-3.5" /> Madrid, ES</div>
                <div className="flex items-center gap-1"><Clock className="size-3.5" /> Cierra pedidos los domingos 22:00</div>
              </div>
            </div>
            <Link to={`/tenants/${slug}/catalog`}><Btn>Ver catálogo</Btn></Link>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">Sobre el negocio</h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              FitKitchen es una cocina especializada en preparar comidas semanales para atletas, con macros calculados al gramo. Cada plato es elaborado por chefs y supervisado por un equipo de nutricionistas deportivos.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              {[["Platos activos", "42"], ["Clientes semanales", "184"], ["Tiempo entrega", "24h"]].map(([l,v]) => (
                <div key={l} className="rounded-xl border border-border p-4">
                  <div className="text-xs text-muted-foreground">{l}</div>
                  <div className="text-xl font-semibold mt-1">{v}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">Planes destacados</h2>
            <ul className="divide-y divide-border text-sm">
              {[["Fuerza & Volumen","12 comidas / sem","$85.50"],["Cutting","10 comidas / sem","$72.00"],["Vegano Pro","8 comidas / sem","$64.00"]].map(([n,d,p]) => (
                <li key={n} className="py-3 flex items-center justify-between">
                  <div><div className="font-medium">{n}</div><div className="text-xs text-muted-foreground">{d}</div></div>
                  <div className="font-semibold tabular-nums">{p}</div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </MockupShell>
  );
}
