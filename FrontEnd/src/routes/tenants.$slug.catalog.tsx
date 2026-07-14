import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { platosService } from "../lib/api";
import { MockupShell, PageHeader, Card, Btn, Badge } from "@/components/mockup/Shell";
import { Search, Filter, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/tenants/$slug/catalog")({
  head: ({ params }) => ({ meta: [{ title: `Catálogo · ${params.slug} — NutriFlow` }, { name: "description", content: "Catálogo de comidas saludables." }] }),
  component: Catalog,
});

const slugToIdMap: Record<string, number> = {
  "coffeefit": 1,
  "primefit": 2
};

function Catalog() {
  const { slug } = Route.useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("Todos");

  const businessId = slugToIdMap[slug] || 1;

  // Cargar platos del backend
  const { data: platos, isLoading } = useQuery({
    queryKey: ["platosCatalogoPublico", businessId],
    queryFn: () => platosService.listarPlatosDeNegocio(businessId),
  });
  
  // Filtrar platos por negocio, término de búsqueda y etiqueta
  const platosFiltrados = (platos || []).filter((p) => {
    if (p.negocioId !== businessId) return false;
    
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.descripcion && p.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;

    if (selectedTag !== "Todos") {
      // Filtros rápidos aproximados basados en los macros del plato
      if (selectedTag === "Alto en proteína" && p.proteinas < 35) return false;
      if (selectedTag === "Bajo en carbos" && p.carbohidratos > 30) return false;
      if (selectedTag === "Under 500 kcal" && p.calorias >= 500) return false;
    }

    return true;
  });

  if (isLoading) {
    return (
      <MockupShell breadcrumbs={["Inicio", "Negocios", slug, "Catálogo"]}>
        <div className="p-8 flex items-center justify-center min-h-[300px]">
          <span className="text-sm text-muted-foreground">Cargando menú de platos...</span>
        </div>
      </MockupShell>
    );
  }

  return (
    <MockupShell breadcrumbs={["Inicio", "Negocios", slug, "Catálogo"]}>
      <div className="p-8">
        <PageHeader 
          eyebrow="Catálogo" 
          title="Comidas disponibles" 
          description="Explora el menú semanal y arma tu plan personalizado." 
          actions={
            <Link to="/athlete/plan">
              <Btn><Plus className="size-3.5" /> Planificar en calendario</Btn>
            </Link>
          } 
        />
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="flex items-center gap-2 px-3 h-9 rounded-md bg-card border border-border text-sm flex-1 max-w-md">
            <Search className="size-4 text-muted-foreground" />
            <input 
              className="bg-transparent flex-1 outline-none text-foreground" 
              placeholder="Buscar comida o ingrediente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {["Todos", "Alto en proteína", "Bajo en carbos", "Under 500 kcal"].map((t) => (
            <button 
              key={t} 
              onClick={() => setSelectedTag(t)}
              className={`px-3 h-8 rounded-md text-xs font-medium cursor-pointer transition-colors ${selectedTag === t ? "bg-brand-500 text-white" : "border border-border hover:bg-muted text-muted-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {platosFiltrados.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {platosFiltrados.map((p) => (
              <Link key={p.id} to="/athlete/meal/$id" params={{ id: p.id.toString() }} className="block group">
                <Card className="overflow-hidden hover:border-brand-500/40 transition-colors">
                  <div className="aspect-square bg-gradient-to-br from-brand-50 to-muted relative">
                    <div className="absolute top-3 left-3"><Badge tone="brand">Plato</Badge></div>
                    <div className="absolute bottom-3 right-3 text-[10px] font-mono text-muted-foreground bg-card/90 backdrop-blur px-2 py-1 rounded">
                      S/ {p.precio.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold leading-tight group-hover:text-brand-600 truncate">{p.nombre}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[32px]">{p.descripcion || "Plato balanceado optimizado con macros de alta calidad."}</p>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground tabular-nums">
                      <span className="font-medium text-foreground">{p.calorias} kcal</span>
                      <span>P {p.proteinas}g · C {p.carbohidratos}g · G {p.grasas}g</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-border rounded-2xl text-muted-foreground text-sm">
            No se encontraron platos para los filtros seleccionados.
          </div>
        )}
      </div>
    </MockupShell>
  );
}
