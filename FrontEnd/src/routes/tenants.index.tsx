import { createFileRoute, Link } from "@tanstack/react-router";
import { MockupShell, PageHeader, Card, Btn, Badge } from "@/components/mockup/Shell";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { platosService } from "../lib/api";

export const Route = createFileRoute("/tenants/")({
  head: () => ({ meta: [{ title: "Explorar Platos — NutriFlow" }] }),
  component: Explorar,
});

function Explorar() {
  const { data: platos, isLoading } = useQuery({
    queryKey: ["catalogoPlatosGeneral"],
    queryFn: platosService.listarPlatosGenerales,
  });

  return (
    <MockupShell breadcrumbs={["Inicio", "Explorar"]}>
      <div className="p-8 max-w-6xl mx-auto">
        <PageHeader
          eyebrow="Catálogo general"
          title="Explora nuevas comidas"
          description="Descubre platos increíbles de diferentes negocios y agrégalos a tus favoritos para tu próxima planificación semanal."
          actions={
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 h-10 rounded-md bg-muted text-sm border border-border">
                <Search className="size-4 text-muted-foreground" />
                <input 
                  className="flex-1 bg-transparent outline-none border-none focus:ring-0 focus:outline-none" 
                  placeholder="Buscar comida..." 
                />
              </div>
            </div>
          }
        />
        
        {isLoading ? (
          <div className="py-20 text-center text-sm text-muted-foreground">Cargando catálogo...</div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {platos?.map((p) => (
              <Link key={p.id} to={`/athlete/meal/$id`} params={{ id: p.id.toString() }} className="block group">
                <Card className="overflow-hidden hover:border-brand-500/40 transition-colors h-full flex flex-col">
                  <div className="aspect-[4/3] bg-gradient-to-br from-brand-100 to-brand-50 relative">
                    <div className="absolute top-3 left-3">
                      <Badge tone={p.proteinas >= 30 ? "brand" : p.carbohidratos <= 20 ? "blue" : "amber"}>
                        {p.proteinas >= 30 ? "Alto en proteína" : p.carbohidratos <= 20 ? "Bajo en carbos" : "Balanceado"}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold tracking-tight group-hover:text-brand-600 line-clamp-2">{p.nombre}</h3>
                    <p className="text-xs text-muted-foreground mt-1 mb-3 line-clamp-2">{p.descripcion}</p>
                    <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
                      <div className="text-sm font-bold">S/ {p.precio.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground tabular-nums">{p.calorias} kcal</div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MockupShell>
  );
}
