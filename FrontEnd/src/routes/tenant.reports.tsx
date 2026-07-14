import { createFileRoute } from "@tanstack/react-router";
import { MockupShell, PageHeader, Card, KpiCard } from "@/components/mockup/Shell";
import { TrendingUp, Utensils, ShoppingBag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { tenantService } from "@/lib/api";

export const Route = createFileRoute("/tenant/reports")({
  head: () => ({ meta: [{ title: "Reportes — FitKitchen" }] }),
  component: Reports,
});

function Reports() {
  const { data: reporte, isLoading } = useQuery({
    queryKey: ["tenantReporteMensual"],
    queryFn: tenantService.obtenerReporteMensual,
  });

  return (
    <MockupShell breadcrumbs={["FitKitchen", "Reportes"]}>
      <div className="p-8">
        <PageHeader backTo="/tenant" eyebrow="Inteligencia de negocio" title="Reporte Ejecutivo (Últimos 30 días)" description="Métricas de rendimiento generadas automáticamente por el sistema." />
        
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Generando reporte...</div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-6 mb-6">
            <Card className="p-6 border-l-4 border-l-brand-500">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-8 rounded bg-brand-50 grid place-items-center text-brand-700"><TrendingUp className="size-4" /></div>
                <div className="text-sm font-semibold text-muted-foreground">Ventas del Mes</div>
              </div>
              <div className="text-3xl font-bold">${reporte?.ventasDelMes?.toFixed(2) || '0.00'}</div>
            </Card>

            <Card className="p-6 border-l-4 border-l-blue-500">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-8 rounded bg-blue-50 grid place-items-center text-blue-700"><ShoppingBag className="size-4" /></div>
                <div className="text-sm font-semibold text-muted-foreground">Total Pedidos</div>
              </div>
              <div className="text-3xl font-bold">{reporte?.totalPedidosMes || 0}</div>
            </Card>

            <Card className="p-6 border-l-4 border-l-amber-500">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-8 rounded bg-amber-50 grid place-items-center text-amber-700"><Utensils className="size-4" /></div>
                <div className="text-sm font-semibold text-muted-foreground">Plato Estrella</div>
              </div>
              <div className="text-xl font-bold truncate" title={reporte?.platoEstrella}>{reporte?.platoEstrella || 'Ninguno'}</div>
              <div className="text-xs text-muted-foreground mt-1">({reporte?.cantidadPlatoEstrella || 0} porciones vendidas)</div>
            </Card>
          </div>
        )}
      </div>
    </MockupShell>
  );
}
