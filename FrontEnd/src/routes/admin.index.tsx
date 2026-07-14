import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "../lib/api";
import { MockupShell, PageHeader, Card, KpiCard, Btn, Badge } from "@/components/mockup/Shell";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin SaaS — NutriFlow" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["adminStats"],
    queryFn: adminService.getStats,
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 0,
    }).format(val);
  };

  if (isLoading) {
    return (
      <MockupShell breadcrumbs={["Admin SaaS", "Dashboard"]}>
        <div className="p-8 flex items-center justify-center min-h-[300px]">
          <span className="text-sm text-muted-foreground">Cargando métricas de la plataforma...</span>
        </div>
      </MockupShell>
    );
  }

  if (error) {
    return (
      <MockupShell breadcrumbs={["Admin SaaS", "Dashboard"]}>
        <div className="p-8">
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-sm">
            Error al cargar las estadísticas de la plataforma. Asegúrate de estar autenticado como Administrador.
          </div>
        </div>
      </MockupShell>
    );
  }

  return (
    <MockupShell breadcrumbs={["Admin SaaS", "Dashboard"]}>
      <div className="p-8">
        <PageHeader eyebrow="Plataforma · NutriFlow Cloud" title="Panel general" description="Vista ejecutiva de la salud de la plataforma." actions={<Btn>Generar reporte</Btn>} />
        
        <div className="grid sm:grid-cols-4 gap-5 mb-6">
          <KpiCard label="Negocios activos" value={stats?.negociosActivos.toString() || "0"} delta="↑ En tiempo real" />
          <KpiCard label="Usuarios totales" value={stats?.usuariosTotales.toString() || "0"} delta="↑ Registrados" />
          <KpiCard label="MRR" value={formatCurrency(stats?.mrr || 0)} delta="Suscripciones activas" />
          <KpiCard label="Churn" value={`${stats?.churn || 0}%`} hint="Bajo histórico" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-sm font-semibold mb-5">MRR · últimos 12 meses</h3>
            <svg viewBox="0 0 600 200" className="w-full h-56">
              <defs>
                <linearGradient id="mrr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand-500)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--brand-500)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3].map(i => <line key={i} x1="0" y1={i * 50} x2="600" y2={i * 50} stroke="var(--border)" />)}
              <path d="M0,170 L50,160 L100,140 L150,130 L200,115 L250,90 L300,95 L350,75 L400,60 L450,50 L500,35 L550,25 L600,20" stroke="var(--brand-500)" strokeWidth="2.5" fill="none" />
              <path d="M0,170 L50,160 L100,140 L150,130 L200,115 L250,90 L300,95 L350,75 L400,60 L450,50 L500,35 L550,25 L600,20 L600,200 L0,200 Z" fill="url(#mrr)" />
            </svg>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-semibold mb-4">Negocios nuevos</h3>
            <ul className="divide-y divide-border">
              {stats?.negociosNuevos && stats.negociosNuevos.length > 0 ? (
                stats.negociosNuevos.map((n) => (
                  <li key={n.id} className="py-3 flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-brand-100 grid place-items-center text-[10px] font-semibold text-brand-700">
                      {n.nombreComercial.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{n.nombreComercial}</div>
                      <div className="text-xs text-muted-foreground">Plan {n.plan}</div>
                    </div>
                    <Badge tone={n.estado === "ACTIVO" ? "brand" : n.estado === "SUSPENDIDO" ? "rose" : "amber"}>
                      {n.estado}
                    </Badge>
                  </li>
                ))
              ) : (
                <div className="text-xs text-muted-foreground py-4 text-center">No hay negocios registrados recientemente.</div>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </MockupShell>
  );
}

