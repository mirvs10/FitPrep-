import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Card, Badge, Btn } from "@/components/layout/Shell";
import { useQuery } from "@tanstack/react-query";
import { planesService, PlanSemanalResponse, platosService } from "../lib/api";
import { useState } from "react";
import { X } from "lucide-react";

export const Route = createFileRoute("/athlete/orders")({
  head: () => ({ meta: [{ title: "Historial de pedidos — FitPrep" }] }),
  component: Orders,
});

function Orders() {
  const [selectedPlan, setSelectedPlan] = useState<PlanSemanalResponse | null>(null);

  const { data: planes, isLoading, isError: isPlanesError } = useQuery({
    queryKey: ["misPlanes"],
    queryFn: planesService.getMisPlanes,
  });

  const { data: platos, isError: isPlatosError } = useQuery({
    queryKey: ["catalogoPlatosGeneral"],
    queryFn: platosService.listarPlatosGenerales,
  });

  return (
    <AppShell breadcrumbs={["Atleta", "Historial"]}>
      <div className="p-8">
        <PageHeader 
          eyebrow="Historial" 
          title="Mis planes semanales" 
          description="Revisa tus planes pagados, las semanas programadas y repite pedidos pasados." 
        />
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface text-[11px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-3">Pedido</th>
                <th className="text-left px-5 py-3">Semana</th>
                <th className="text-left px-5 py-3">Tipo</th>
                <th className="text-left px-5 py-3">Comidas</th>
                <th className="text-right px-5 py-3">Total</th>
                <th className="text-left px-5 py-3">Estado</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-muted-foreground">Cargando historial...</td>
                </tr>
              ) : isPlanesError || isPlatosError ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-destructive font-semibold">Ocurrió un error al cargar el historial. Por favor, intenta de nuevo.</td>
                </tr>
              ) : planes && planes.length > 0 ? (
                planes.map((plan) => {
                  const totalComidas = plan.comidas.reduce((acc, c) => acc + c.cantidad, 0);
                  const isPaid = plan.estadoPago === "PAGADO";
                  return (
                    <tr key={plan.id} className="hover:bg-muted/50">
                      <td className="px-5 py-4 font-mono text-xs text-muted-foreground">#{plan.id.toString().padStart(4, "0")}</td>
                      <td className="px-5 py-4 font-medium">{plan.fechaInicioSemana}</td>
                      <td className="px-5 py-4 text-muted-foreground">Plan Semanal</td>
                      <td className="px-5 py-4 tabular-nums">{totalComidas}</td>
                      <td className="px-5 py-4 text-right tabular-nums font-medium">S/ {plan.montoTotal.toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <Badge tone={isPaid ? "brand" : "neutral"}>{plan.estadoPago}</Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button 
                          onClick={() => setSelectedPlan(plan)}
                          className="text-xs text-brand-600 hover:text-brand-700 font-medium cursor-pointer"
                        >
                          Ver →
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-muted-foreground">No tienes planes registrados aún.</td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Modal de Vista Previa del Pedido */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl shadow-foreground/5 overflow-hidden my-8">
            <div className="px-6 h-14 flex items-center justify-between border-b border-border">
              <div>
                <div className="text-xs text-brand-600 font-semibold">Semana del {selectedPlan.fechaInicioSemana}</div>
                <div className="text-sm font-bold">Detalle del Pedido #{selectedPlan.id.toString().padStart(4, "0")}</div>
              </div>
              <button 
                onClick={() => setSelectedPlan(null)} 
                className="size-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {selectedPlan.comidas.length > 0 ? (
                <ul className="divide-y divide-border">
                  {selectedPlan.comidas.map((comida, index) => {
                    const platoInfo = platos?.find(p => p.id === comida.platoId);
                    return (
                      <li key={index} className="flex flex-col sm:flex-row sm:items-center gap-4 py-3">
                        {platoInfo?.imagenUrl ? (
                          <img src={platoInfo.imagenUrl} alt={platoInfo.nombre} className="size-12 rounded-lg object-cover shrink-0" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        ) : (
                          <div className="size-12 rounded-lg bg-gradient-to-br from-brand-100 to-brand-50 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate text-foreground">
                            {platoInfo ? platoInfo.nombre : `Plato #${comida.platoId}`}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5 capitalize">
                            {comida.diaSemana} · {comida.tipoComida}
                          </div>
                        </div>
                        <div className="text-sm font-medium tabular-nums shrink-0">
                          {comida.cantidad} {comida.cantidad === 1 ? 'porción' : 'porciones'}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Este plan no tiene comidas programadas.
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-surface">
               <div className="text-sm text-muted-foreground">
                 Total pagado
               </div>
               <div className="text-lg font-bold tabular-nums text-foreground">
                 S/ {selectedPlan.montoTotal.toFixed(2)}
               </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
