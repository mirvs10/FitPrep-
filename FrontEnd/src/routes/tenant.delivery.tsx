import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pedidosService } from "../lib/api";
import { MockupShell, PageHeader, Card, Btn, Badge, KpiCard } from "@/components/mockup/Shell";
import { ShoppingBag, Calendar, MapPin, DollarSign } from "lucide-react";

export const Route = createFileRoute("/tenant/delivery")({
  head: () => ({ meta: [{ title: "Entregas — FitKitchen" }] }),
  component: Delivery,
});

function Delivery() {
  const queryClient = useQueryClient();

  const { data: pedidos, isLoading, error } = useQuery({
    queryKey: ["negocioPedidos"],
    queryFn: pedidosService.getPedidosNegocio,
  });

  const cambiarEstadoMutation = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: string }) =>
      pedidosService.cambiarEstadoPedido(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["negocioPedidos"] });
    },
    onError: (err: any) => {
      alert(`Error al cambiar estado: ${err.response?.data || err.message}`);
    }
  });

  if (isLoading) {
    return (
      <MockupShell breadcrumbs={["FitKitchen", "Logística", "Pedidos y Entregas"]}>
        <div className="p-8 flex items-center justify-center min-h-[300px]">
          <span className="text-sm text-muted-foreground">Cargando pedidos del negocio...</span>
        </div>
      </MockupShell>
    );
  }

  if (error) {
    return (
      <MockupShell breadcrumbs={["FitKitchen", "Logística", "Pedidos y Entregas"]}>
        <div className="p-8">
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-sm">
            Error al cargar la lista de pedidos del negocio. Asegúrate de haber iniciado sesión con una cuenta de restaurante (Tenant).
          </div>
        </div>
      </MockupShell>
    );
  }

  // Contar los pedidos según sus estados
  const totalPedidos = pedidos?.length || 0;
  const enPreparacion = pedidos?.filter(p => p.estado === "PREPARACION").length || 0;
  const enCamino = pedidos?.filter(p => p.estado === "EN_CAMINO").length || 0;
  const entregados = pedidos?.filter(p => p.estado === "ENTREGADO").length || 0;

  const getTone = (estado: string) => {
    switch (estado) {
      case "PENDIENTE": return "neutral";
      case "PREPARACION": return "amber";
      case "EN_CAMINO": return "blue";
      case "ENTREGADO": return "brand";
      default: return "neutral";
    }
  };

  const getLabel = (estado: string) => {
    switch (estado) {
      case "PENDIENTE": return "Pendiente";
      case "PREPARACION": return "En Preparación";
      case "EN_CAMINO": return "En Camino";
      case "ENTREGADO": return "Entregado";
      default: return estado;
    }
  };

  return (
    <MockupShell breadcrumbs={["FitKitchen", "Logística", "Pedidos y Entregas"]}>
      <div className="p-8">
        <PageHeader backTo="/tenant" eyebrow="Operación logística" title="Gestión de pedidos y entregas" description="Estado y despacho de los pedidos en tiempo real." actions={<Btn onClick={() => queryClient.invalidateQueries({ queryKey: ["negocioPedidos"] })}>Actualizar lista</Btn>} />
        
        <div className="grid sm:grid-cols-4 gap-5 mb-6">
          <KpiCard label="Pedidos totales" value={totalPedidos.toString()} />
          <KpiCard label="En Cocina" value={enPreparacion.toString()} />
          <KpiCard label="En Camino" value={enCamino.toString()} />
          <KpiCard label="Entregados" value={entregados.toString()} />
        </div>

        <Card className="p-6">
          <h3 className="text-sm font-semibold mb-4">Lista simple de pedidos</h3>
          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left pb-3">Pedido</th>
                <th className="text-left pb-3">Detalle Platos</th>
                <th className="text-left pb-3">Dirección de Entrega</th>
                <th className="text-left pb-3">Fecha Entrega</th>
                <th className="text-right pb-3">Monto</th>
                <th className="text-left pb-3 px-4">Estado</th>
                <th className="text-right pb-3">Cambiar Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pedidos && pedidos.length > 0 ? (
                pedidos.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/40">
                    <td className="py-4 font-mono text-xs font-semibold">#{p.id}</td>
                    <td className="py-4 max-w-[200px]">
                      <ul className="list-disc pl-4 text-xs text-muted-foreground">
                        {p.lineas.map((linea) => (
                          <li key={linea.id}>
                            <span className="font-medium text-foreground">{linea.platoNombre}</span> (x{linea.cantidad})
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-4 text-xs text-muted-foreground max-w-[220px] truncate" title={p.direccionEntrega}>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="size-3 text-muted-foreground shrink-0" />
                        <span className="truncate">{p.direccionEntrega || "No especificada"}</span>
                      </div>
                    </td>
                    <td className="py-4 text-xs text-muted-foreground tabular-nums">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3 text-muted-foreground shrink-0" />
                        <span>{p.fechaEntrega}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right font-medium tabular-nums text-xs">
                      S/ {p.montoTotal.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <Badge tone={getTone(p.estado)}>{getLabel(p.estado)}</Badge>
                    </td>
                    <td className="py-4 text-right">
                      <select
                        value={p.estado}
                        disabled={cambiarEstadoMutation.isPending}
                        onChange={(e) => cambiarEstadoMutation.mutate({ id: p.id, estado: e.target.value })}
                        className="text-xs border border-border rounded-md px-2.5 py-1 bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
                      >
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="PREPARACION">En Preparación</option>
                        <option value="EN_CAMINO">En Camino</option>
                        <option value="ENTREGADO">Entregado</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-muted-foreground">
                    No hay pedidos registrados para tu negocio.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </MockupShell>
  );
}

