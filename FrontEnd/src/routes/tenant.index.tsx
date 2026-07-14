import { createFileRoute, Link } from "@tanstack/react-router";
import { MockupShell, PageHeader, Card, KpiCard, Btn, Badge } from "@/components/mockup/Shell";
import { Download, TrendingUp, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { tenantService } from "@/lib/api";

export const Route = createFileRoute("/tenant/")({
  head: () => ({ meta: [{ title: "Panel · FitKitchen — NutriFlow" }] }),
  component: TenantDashboard,
});

function TenantDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["tenantDashboard"],
    queryFn: tenantService.obtenerDashboard,
  });

  const userStr = typeof window !== "undefined" ? localStorage.getItem("usuario") : null;
  const usuario = userStr ? JSON.parse(userStr) : null;
  const businessName = usuario 
    ? (usuario.rol === 'TENANT' ? usuario.apellidos : usuario.nombres)
    : "Mi Negocio";

  return (
    <MockupShell breadcrumbs={[businessName || "Negocio", "Dashboard"]}>
      <div className="p-8">
        <PageHeader eyebrow={businessName} title="Panel de control" description="Resumen ejecutivo de tu cocina, pedidos y operación semanal." actions={<><Link to="/tenant/meals/new"><Btn><Plus className="size-3.5" /> Crear comida</Btn></Link></>} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <KpiCard label="Ventas totales" value={`$${data?.ventasSemanales?.toFixed(2) || '0.00'}`} delta="calculado al día" />
          <KpiCard label="Pedidos activos" value={data?.pedidosActivos?.toString() || '0'} delta="en cola" />
          <KpiCard label="Capacidad cocina" value="--" hint="Próximamente" />
          <KpiCard label="Retención" value="--" hint="Próximamente" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold">Ingresos - últimas 12 semanas</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Visión general</p>
              </div>
              <Link to="/tenant/reports">
                <Btn variant="outline" size="sm">Ver reportes</Btn>
              </Link>
            </div>
            
            <div className="h-56 flex items-end gap-2 mt-4 pt-4 border-t border-border">
              {isLoading ? (
                <div className="w-full text-center text-muted-foreground text-sm py-10">Cargando gráfico...</div>
              ) : (
                data?.historialIngresos?.map((ingreso: number, idx: number) => {
                  const max = Math.max(...(data.historialIngresos || [1]), 100);
                  const height = `${Math.max((ingreso / max) * 100, 2)}%`;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end gap-2 group">
                      <div className="w-full bg-brand-500 rounded-t-md transition-all group-hover:opacity-80" style={{ height }} title={`S/ ${ingreso.toFixed(2)}`} />
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold">Platos más vendidos</h3>
              <Link to="/tenant/meals" className="text-xs text-brand-600 font-medium hover:underline">Ver comidas</Link>
            </div>
            <ul className="space-y-3.5">
              {isLoading ? (
                <div className="text-xs text-muted-foreground">Cargando...</div>
              ) : data?.platosMasVendidos?.length === 0 ? (
                <div className="text-xs text-muted-foreground">No hay datos de ventas aún.</div>
              ) : (
                data?.platosMasVendidos?.map((p: any) => (
                  <li key={p.nombre}>
                    <div className="flex justify-between text-xs mb-1.5"><span className="font-medium">{p.nombre}</span><span className="tabular-nums text-muted-foreground">{p.unidades}</span></div>
                    <div className="h-1.5 bg-muted rounded-full"><div className="h-full bg-brand-500 rounded-full" style={{width: p.porcentaje}} /></div>
                  </li>
                ))
              )}
            </ul>
          </Card>

          <Card className="p-6 lg:col-span-3 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Pedidos recientes</h3>
              <Link to="/tenant/orders" className="text-xs text-brand-600 font-medium hover:underline">Ver todos los pedidos</Link>
            </div>
            <table className="w-full text-sm">
              <thead className="text-[10px] uppercase tracking-widest text-muted-foreground">
                <tr><th className="text-left pb-3">Cliente</th><th className="text-left pb-3">Pedido</th><th className="text-left pb-3">Estado</th><th className="text-right pb-3">Total</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr><td colSpan={4} className="py-3 text-xs text-muted-foreground">Cargando...</td></tr>
                ) : data?.pedidosRecientes?.length === 0 ? (
                  <tr><td colSpan={4} className="py-3 text-xs text-muted-foreground">No tienes pedidos recientes.</td></tr>
                ) : (
                  data?.pedidosRecientes?.map((p: any) => (
                    <tr key={p.idPedido}>
                      <td className="py-3"><div className="flex items-center gap-2.5"><div className="size-7 rounded-full bg-brand-100 grid place-items-center text-[10px] font-semibold text-brand-700">{p.cliente.substring(0, 2)}</div><span className="font-medium">{p.cliente}</span></div></td>
                      <td className="py-3 text-muted-foreground text-xs">{p.idPedido}</td>
                      <td className="py-3"><Badge tone={p.colorBadge as any}>{p.estado}</Badge></td>
                      <td className="py-3 text-right tabular-nums font-medium">{p.monto}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </MockupShell>
  );
}
