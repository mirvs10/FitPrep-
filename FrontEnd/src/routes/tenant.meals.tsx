import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { platosService } from "../lib/api";
import { AppShell, PageHeader, Card, Btn, Badge } from "@/components/layout/Shell";
import { Search, Plus, MoreVertical } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/tenant/meals")({
  head: () => ({ meta: [{ title: "Catálogo — FitKitchen" }] }),
  component: Meals,
});

function Meals() {
  const { data: platos, isLoading } = useQuery({
    queryKey: ["misPlatosTenant"],
    queryFn: platosService.listarPlatos,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Todas");

  const platosFiltrados = (platos || []).filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchSearch) return false;

    if (selectedFilter === "Activas") return p.disponible;
    if (selectedFilter === "Inactivas") return !p.disponible;
    if (selectedFilter === "Borrador") return false; // Not implemented yet
    
    return true;
  });

  return (
    <AppShell breadcrumbs={["FitKitchen", "Catálogo"]}>
      <div className="p-8">
        <PageHeader backTo="/tenant" eyebrow="Operación" title="Catálogo de comidas" description={`${platos?.length || 0} platos publicados en tu catálogo`} actions={<Link to="/tenant/meals/new"><Btn><Plus className="size-3.5" /> Nueva comida</Btn></Link>} />
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 h-9 rounded-md bg-muted text-sm flex-1 min-w-[200px] max-w-md">
              <Search className="size-4 text-muted-foreground" />
              <input className="bg-transparent flex-1 outline-none" placeholder="Buscar comida..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            {["Todas","Activas","Inactivas"].map((t) => (
              <button 
                key={t} 
                onClick={() => setSelectedFilter(t)}
                className={`px-3 h-8 rounded-md text-xs font-medium ${selectedFilter === t ? "bg-foreground text-background" : "border border-border hover:bg-muted"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <table className="w-full text-sm">
            <thead className="bg-surface text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr><th className="text-left px-5 py-3 w-12"></th><th className="text-left px-5 py-3">Nombre</th><th className="text-left px-5 py-3">Categoría</th><th className="text-right px-5 py-3">Kcal</th><th className="text-right px-5 py-3">Precio</th><th className="text-right px-5 py-3">Ventas 7d</th><th className="text-left px-5 py-3">Estado</th><th /></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={8} className="px-5 py-8 text-center text-muted-foreground text-sm">Cargando platos...</td></tr>
              ) : platosFiltrados.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-8 text-center text-muted-foreground text-sm">No se encontraron platos.</td></tr>
              ) : (
                platosFiltrados.map((plato) => (
                  <tr key={plato.id} className="hover:bg-muted/40">
                    <td className="px-5 py-3">
                      <div className="size-9 rounded-lg bg-gradient-to-br from-brand-100 to-brand-50 overflow-hidden">
                        {plato.imagenUrl && <img src={plato.imagenUrl} alt={plato.nombre} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                      </div>
                    </td>
                    <td className="px-5 py-3"><Link to="/tenant/meals/$id/edit" params={{ id: plato.id.toString() }} className="font-medium hover:text-brand-600">{plato.nombre}</Link></td>
                    <td className="px-5 py-3 text-muted-foreground">General</td>
                    <td className="px-5 py-3 text-right tabular-nums">{Math.round(plato.calorias)}</td>
                    <td className="px-5 py-3 text-right tabular-nums font-medium">${plato.precio.toFixed(2)}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">N/A</td>
                    <td className="px-5 py-3"><Badge tone={plato.disponible ? "brand" : "rose"}>{plato.disponible ? "Activo" : "Inactivo"}</Badge></td>
                    <td className="px-5 py-3">
                      <Link to="/tenant/meals/$id/edit" params={{ id: plato.id.toString() }}>
                        <button className="size-8 grid place-items-center rounded-md hover:bg-muted cursor-pointer"><MoreVertical className="size-4 text-muted-foreground" /></button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </AppShell>
  );
}
