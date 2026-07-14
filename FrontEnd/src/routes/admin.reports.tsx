import { createFileRoute } from "@tanstack/react-router";
import { MockupShell, PageHeader, Card, KpiCard, Donut } from "@/components/mockup/Shell";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reportes generales — Admin NutriFlow" }] }),
  component: AdminReports,
});

function AdminReports() {
  return (
    <MockupShell breadcrumbs={["Admin SaaS", "Reportes"]}>
      <div className="p-8">
        <PageHeader eyebrow="Plataforma" title="Reportes generales" description="Métricas de adopción, retención y rendimiento." />
        <div className="grid sm:grid-cols-4 gap-5 mb-6">
          <KpiCard label="Pedidos plataforma" value="48,240" delta="↑ 18%" />
          <KpiCard label="Volumen procesado" value="$1.24M" delta="↑ 22%" />
          <KpiCard label="Tasa actividad" value="78%" />
          <KpiCard label="NPS plataforma" value="62" hint="Excelente" />
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-sm font-semibold mb-5">Adopción por ciudad</h3>
            <div className="space-y-3">
              {[["Madrid","48","82%"],["Barcelona","36","68%"],["Valencia","22","54%"],["Sevilla","18","42%"],["Bilbao","14","38%"],["Málaga","12","30%"]].map(([c,n,p]) => (
                <div key={c}>
                  <div className="flex justify-between text-sm mb-1.5"><span className="font-medium">{c}</span><span className="text-muted-foreground tabular-nums">{n} negocios</span></div>
                  <div className="h-2 bg-muted rounded-full"><div className="h-full bg-brand-500 rounded-full" style={{width:p}} /></div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-semibold mb-5">Distribución de planes</h3>
            <div className="flex justify-center mb-4"><Donut value={62} label="184" sub="negocios" /></div>
            <div className="space-y-2 text-xs">
              {[["Starter","46%","bg-muted"],["Growth","34%","bg-brand-500"],["Scale","20%","bg-brand-700"]].map(([l,v,c]) => (
                <div key={l} className="flex items-center gap-3"><div className={`size-2.5 rounded-sm ${c}`} /><span className="flex-1">{l}</span><span className="font-medium tabular-nums">{v}</span></div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </MockupShell>
  );
}
