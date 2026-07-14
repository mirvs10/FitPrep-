import { createFileRoute } from "@tanstack/react-router";
import { MockupShell, PageHeader, Card, Btn, Badge } from "@/components/mockup/Shell";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { tenantService } from "@/lib/api";

export const Route = createFileRoute("/tenant/clients")({
  head: () => ({ meta: [{ title: "Clientes — FitKitchen" }] }),
  component: Clients,
});

function Clients() {
  const { data: clients, isLoading } = useQuery({
    queryKey: ["tenantClients"],
    queryFn: tenantService.obtenerClientes,
  });
  return (
    <MockupShell breadcrumbs={["FitKitchen", "Clientes"]}>
      <div className="p-8">
        <PageHeader backTo="/tenant" eyebrow="CRM" title="Clientes" description={`${clients?.length || 0} clientes activos`} actions={<Btn>Invitar cliente</Btn>} />
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 h-9 rounded-md bg-muted text-sm flex-1 max-w-md">
              <Search className="size-4 text-muted-foreground" />
              <input className="bg-transparent flex-1 outline-none" placeholder="Buscar cliente..." />
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-surface text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr><th className="text-left px-5 py-3">Cliente</th><th className="text-left px-5 py-3">Plan</th><th className="text-right px-5 py-3">Pedidos</th><th className="text-right px-5 py-3">LTV</th><th className="text-left px-5 py-3">Estado</th><th /></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={6} className="p-5 text-center text-muted-foreground">Cargando clientes...</td></tr>
              ) : clients?.length === 0 ? (
                <tr><td colSpan={6} className="p-5 text-center text-muted-foreground">Aún no hay clientes que hayan realizado pedidos.</td></tr>
              ) : (
                clients?.map((c: any) => (
                  <tr key={c.usuarioId} className="hover:bg-muted/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-brand-100 grid place-items-center text-xs font-semibold text-brand-700">
                          {c.nombre.substring(0, 2).toUpperCase()}
                        </div>
                        <div><div className="font-medium">{c.nombre}</div><div className="text-xs text-muted-foreground">{c.email}</div></div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{c.objetivo}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{c.totalPedidos}</td>
                    <td className="px-5 py-3 text-right tabular-nums font-medium">${c.ltv.toFixed(2)}</td>
                    <td className="px-5 py-3"><Badge tone="brand">{c.estado}</Badge></td>
                    <td className="px-5 py-3 text-right"><button className="text-xs text-brand-600 font-medium">Ver perfil &rarr;</button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </MockupShell>
  );
}
