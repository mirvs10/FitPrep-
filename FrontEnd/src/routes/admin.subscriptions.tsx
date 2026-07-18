import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../lib/api";
import { AppShell, PageHeader, Card, Badge, KpiCard } from "@/components/layout/Shell";

export const Route = createFileRoute("/admin/subscriptions")({
  head: () => ({ meta: [{ title: "Suscripciones - Admin FitPrep" }] }),
  component: Subs,
});

function Subs() {
  const queryClient = useQueryClient();
  
  const { data: suscripciones, isLoading } = useQuery({
    queryKey: ["adminSuscripciones"],
    queryFn: adminService.getSuscripciones,
  });

  const { data: historico } = useQuery({
    queryKey: ["adminHistorico"],
    queryFn: adminService.getHistorico,
  });

  const { data: negocios } = useQuery({
    queryKey: ["adminNegocios"],
    queryFn: adminService.getNegocios,
  });

  const getBusinessName = (id: number) => {
    if (!negocios) return `Negocio #${id}`;
    const b = negocios.find((n: any) => n.id === id);
    return b ? b.nombreComercial : `Negocio #${id}`;
  };

  const simularFalloMutation = useMutation({
    mutationFn: (negocioId: number) => adminService.simularFalloPago(negocioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSuscripciones"] });
      queryClient.invalidateQueries({ queryKey: ["adminNegocios"] });
      alert("Simulación de fallo de pago exitosa. El negocio ha sido suspendido.");
    },
    onError: (err: any) => {
      alert("Error al simular fallo: " + (err.response?.data || err.message));
    }
  });

  // Calculate MRR from active subscriptions
  const currentMrr = suscripciones?.reduce((sum, s) => {
    if (s.estadoPago === "AL_DIA") {
      return sum + (s.plan === "Scale" ? 149 : 49);
    }
    return sum;
  }, 0) || 0;

  return (
    <AppShell breadcrumbs={["Admin SaaS", "Suscripciones"]}>
      <div className="p-8">
        <PageHeader 
          eyebrow="Billing" 
          title="Gestión de suscripciones" 
          actions={<Link to="/admin" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">Volver al Dashboard</Link>}
        />
        
        {isLoading ? (
          <div className="p-8 flex items-center justify-center min-h-[200px]">
            <span className="text-sm text-muted-foreground">Cargando suscripciones...</span>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-4 gap-5 mb-6">
              <KpiCard label="MRR Actual" value={`$${currentMrr.toFixed(2)}`} />
              <KpiCard label="Suscripciones Activas" value={suscripciones?.filter((s: any) => s.estadoPago === "AL_DIA").length.toString() || "0"} />
              <KpiCard label="Pagos Fallidos" value={suscripciones?.filter((s: any) => s.estadoPago === "FALLIDO").length.toString() || "0"} />
            </div>

            <Card className="mt-6 overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-semibold">Lista de Suscripciones (Estado en vivo)</h3>
              </div>
              <table className="w-full text-sm">
                <thead className="text-[10px] uppercase tracking-widest text-muted-foreground bg-surface">
                  <tr>
                    <th className="text-left px-5 py-3">Negocio</th>
                    <th className="text-left px-5 py-3">Plan</th>
                    <th className="text-left px-5 py-3">Próximo cobro</th>
                    <th className="text-left px-5 py-3">Estado de Pago</th>
                    <th className="text-right px-5 py-3">Acciones Developer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {suscripciones?.map((s: any) => (
                    <tr key={s.id} className="hover:bg-muted/40">
                      <td className="px-5 py-3 font-medium">{getBusinessName(s.negocioId)}</td>
                      <td className="px-5 py-3 text-muted-foreground">{s.plan}</td>
                      <td className="px-5 py-3 text-muted-foreground tabular-nums">
                        {s.proximoCobro ? new Date(s.proximoCobro).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-5 py-3">
                        <Badge tone={s.estadoPago === "AL_DIA" ? "brand" : s.estadoPago === "FALLIDO" ? "rose" : "neutral"}>
                          {s.estadoPago}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                          {s.estadoPago === "AL_DIA" && (
                            <button 
                              onClick={() => {
                                if (confirm("¿Forzar el estado de pago a fallido? Esto suspenderá automáticamente el acceso del negocio.")) {
                                  simularFalloMutation.mutate(s.negocioId);
                                }
                              }}
                              disabled={simularFalloMutation.isPending}
                              className="text-xs text-rose-600 font-medium hover:underline disabled:opacity-50"
                            >
                              Forzar suspensión
                            </button>
                          )}
                      </td>
                    </tr>
                  ))}
                  {(!suscripciones || suscripciones.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-xs text-muted-foreground">
                        No hay suscripciones registradas. Intenta cambiar el plan de un negocio en la pestaña Negocios.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
}
