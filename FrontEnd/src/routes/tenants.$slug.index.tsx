import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Card, Btn, Badge } from "@/components/layout/Shell";
import { MapPin, Star, Clock, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/tenants/$slug/")({
  head: ({ params }) => ({ meta: [{ title: `${params.slug} — FitPrep` }, { name: "description", content: `Perfil público del negocio ${params.slug} en FitPrep.` }] }),
  component: TenantProfile,
});

function TenantProfile() {
  const { slug } = Route.useParams();
  const name = slug === "coffeefit" ? "CoffeeFit" : slug === "primefit" ? "PrimeFit" : slug;
  const initials = name.substring(0,2).toUpperCase();

  return (
    <AppShell breadcrumbs={["Inicio", "Negocios", name]}>
      <div className="px-8 max-w-6xl mx-auto pt-12 pb-12">
        <Card className="p-7 border-border shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="size-24 rounded-2xl bg-brand-100 border border-border grid place-items-center text-2xl font-bold text-brand-700">{initials}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge tone="blue"><ShieldCheck className="size-3" /> Verificado</Badge>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
              <p className="text-sm text-muted-foreground mt-1">Negocio registrado en la plataforma FitPrep.</p>
              <div className="flex flex-wrap gap-5 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><MapPin className="size-3.5" /> Disponible en la plataforma</div>
              </div>
            </div>
            <Link to={`/tenants/${slug}/catalog`}><Btn>Ver catálogo</Btn></Link>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
