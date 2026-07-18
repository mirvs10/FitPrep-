import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, Btn, Badge } from "@/components/layout/Shell";
import { Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { platosService, authService } from "@/lib/api";
import { useState } from "react";

export const Route = createFileRoute("/athlete/add-meal")({
  head: () => ({ meta: [{ title: "Agregar comida - FitPrep" }] }),
  component: AddMeal,
});

function AddMeal() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: platos, isLoading } = useQuery({
    queryKey: ["catalogoPlatosGeneral"],
    queryFn: platosService.listarPlatosGenerales,
  });

  const { data: usuario } = useQuery({
    queryKey: ["usuarioPerfil"],
    queryFn: authService.getMe,
  });

  // Filtrar platos
  const platosFiltrados = platos?.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <AppShell breadcrumbs={["Atleta", "Plan", "Agregar comida"]}>
      <div className="p-8">
        <div className="rounded-2xl border border-border bg-card shadow-2xl shadow-foreground/5 max-w-3xl mx-auto overflow-hidden">
          <div className="px-6 h-14 flex items-center justify-between border-b border-border">
            <div>
              <div className="text-xs text-muted-foreground">Martes 13 · Almuerzo</div>
              <div className="text-sm font-semibold">Agregar comida al día</div>
            </div>
            <button className="size-8 grid place-items-center rounded-md hover:bg-muted"><X className="size-4" /></button>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 px-3 h-10 rounded-md bg-muted text-sm mb-4 border border-border focus-within:border-brand-500">
              <Search className="size-4 text-muted-foreground" />
              <input 
                className="flex-1 bg-transparent outline-none border-none focus:ring-0" 
                placeholder="Buscar por nombre de comida..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              {["Alto en proteína","Bajo en carbos","Balanceado"].map((t,i) => (
                <button key={t} className={`px-3 h-7 rounded-full text-xs font-medium border ${i===0?"bg-foreground text-background border-foreground":"border-border hover:bg-muted"}`}>{t}</button>
              ))}
            </div>
            
            {isLoading ? (
              <div className="text-center text-sm text-muted-foreground py-10">Cargando comidas...</div>
            ) : (
              <ul className="divide-y divide-border max-h-[420px] overflow-y-auto">
                {platosFiltrados.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground py-10">No se encontraron comidas.</div>
                ) : (
                  platosFiltrados.map((p) => (
                    <li key={p.id} className="flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-muted/50 transition-colors">
                      {p.imagenUrl ? (
                        <img src={p.imagenUrl} alt={p.nombre} className="size-12 rounded-lg object-cover shrink-0" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      ) : (
                        <div className="size-12 rounded-lg bg-gradient-to-br from-brand-100 to-brand-50 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{p.nombre}</div>
                        <div className="text-xs text-muted-foreground tabular-nums mt-0.5">
                          {p.calorias} kcal • P {p.proteinas}g • C {p.carbohidratos}g • G {p.grasas}g
                        </div>
                      </div>
                      <Btn variant="outline" size="sm" onClick={() => {
                        if (usuario) {
                          // TODO: Agregar lógica de carrito unificada en el futuro. Por ahora volvemos a /athlete/plan
                          navigate({ to: "/athlete/plan" });
                        }
                      }}>Agregar</Btn>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
          <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-surface">
            <div className="text-xs text-muted-foreground">1 comida seleccionada · 520 kcal</div>
            <div className="flex gap-2"><Btn variant="outline">Cancelar</Btn><Btn>Agregar al día</Btn></div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
