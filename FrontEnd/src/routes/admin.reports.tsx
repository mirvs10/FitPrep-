import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "../lib/api";
import { AppShell, PageHeader, Card, KpiCard } from "@/components/layout/Shell";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reportes generales - Admin FitPrep" }] }),
  component: AdminReports,
});

const PLAN_COLORS = {
  Starter: "#e5e7eb", // muted
  Growth: "#0ea5e9", // brand-500
  Scale: "#0369a1", // brand-700
};

function AdminReports() {
  const { data: historico, isLoading: loadingHistorico } = useQuery({
    queryKey: ["adminHistorico"],
    queryFn: adminService.getHistorico,
  });

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["adminStats"],
    queryFn: adminService.getStats,
  });

  const isLoading = loadingHistorico || loadingStats;

  // Preparar datos para el gráfico de torta
  const pieData = stats?.distribucionPlanes
    ? Object.entries(stats.distribucionPlanes).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  return (
    <AppShell breadcrumbs={["Admin SaaS", "Reportes"]}>
      <div className="p-8">
        <PageHeader 
          eyebrow="Plataforma" 
          title="Reportes generales" 
          description="Métricas de adopción, retención y rendimiento." 
          actions={<Link to="/admin" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">Volver al Dashboard</Link>}
        />
        
        {isLoading ? (
          <div className="p-8 flex items-center justify-center min-h-[200px]">
            <span className="text-sm text-muted-foreground">Cargando métricas históricas...</span>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-4 gap-5 mb-6">
              <KpiCard label="Negocios Activos" value={stats?.negociosActivos.toString() || "0"} />
              <KpiCard label="Usuarios Totales" value={stats?.usuariosTotales.toString() || "0"} />
              <KpiCard label="Ingresos (MRR)" value={`$${stats?.mrr.toFixed(2) || "0.00"}`} />
              <KpiCard label="Tasa de Churn" value={`${stats?.churn.toFixed(2) || "0.0"}%`} />
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-sm font-semibold mb-5">Histórico de Ingresos (MRR)</h3>
                <div className="h-[300px] w-full mt-4">
                  {!historico || historico.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No hay datos históricos disponibles.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historico} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                        <YAxis tickFormatter={(val) => `$${val}`} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dx={-10} />
                        <RechartsTooltip 
                          formatter={(value: number) => [`$${value.toFixed(2)}`, 'MRR']}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line type="monotone" dataKey="mrr" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9' }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-sm font-semibold mb-5">Distribución de planes</h3>
                <div className="h-[200px] w-full flex items-center justify-center">
                  {pieData.length === 0 ? (
                    <span className="text-xs text-muted-foreground">Sin datos</span>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PLAN_COLORS[entry.name as keyof typeof PLAN_COLORS] || "#cbd5e1"} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="space-y-3 mt-4 text-sm">
                  {pieData.map((entry) => {
                    const color = PLAN_COLORS[entry.name as keyof typeof PLAN_COLORS] || "#cbd5e1";
                    const percentage = stats?.negociosActivos ? Math.round((entry.value / stats.negociosActivos) * 100) : 0;
                    return (
                      <div key={entry.name} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                        <span className="flex-1 font-medium">{entry.name}</span>
                        <span className="text-muted-foreground">{entry.value} neg.</span>
                        <span className="font-semibold">{percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
