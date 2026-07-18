import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../lib/api";
import { AppShell, PageHeader, Card, Btn, Badge } from "@/components/layout/Shell";
import { Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/businesses")({
  head: () => ({ meta: [{ title: "Negocios - Admin FitPrep" }] }),
  component: Businesses,
});

function Businesses() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: negocios, isLoading, error } = useQuery({
    queryKey: ["adminNegocios"],
    queryFn: adminService.getNegocios,
  });

  const aprobarMutation = useMutation({
    mutationFn: (id: number) => adminService.aprobarNegocio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNegocios"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });

  const suspenderMutation = useMutation({
    mutationFn: (id: number) => adminService.suspenderNegocio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNegocios"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });

  const planMutation = useMutation({
    mutationFn: ({ id, plan }: { id: number, plan: string }) => adminService.cambiarPlanNegocio(id, plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNegocios"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });

  if (isLoading) {
    return (
      <AppShell breadcrumbs={["Admin SaaS", "Negocios"]}>
        <div className="p-8 flex items-center justify-center min-h-[300px]">
          <span className="text-sm text-muted-foreground">Cargando negocios registrados...</span>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell breadcrumbs={["Admin SaaS", "Negocios"]}>
        <div className="p-8">
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-sm">
            Error al cargar la lista de negocios registrados de la plataforma.
          </div>
        </div>
      </AppShell>
    );
  }

  // Filtrar negocios por término de búsqueda
  const filteredNegocios = negocios?.filter((biz) =>
    biz.nombreComercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    biz.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    biz.ruc.includes(searchTerm)
  );

  return (
    <AppShell breadcrumbs={["Admin SaaS", "Negocios"]}>
      <div className="p-8">
        <PageHeader 
          eyebrow="Multi-tenant" 
          title="Negocios registrados" 
          description={`${negocios?.length || 0} negocios en la plataforma`} 
          actions={<Link to="/admin" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">Volver al Dashboard</Link>} 
        />
        
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 h-9 rounded-md bg-muted text-sm flex-1 max-w-md">
              <Search className="size-4 text-muted-foreground" />
              <input 
                className="bg-transparent flex-1 outline-none" 
                placeholder="Buscar negocio..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <table className="w-full text-sm">
            <thead className="bg-surface text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-3">Negocio</th>
                <th className="text-left px-5 py-3">RUC</th>
                <th className="text-left px-5 py-3">Teléfono</th>
                <th className="text-left px-5 py-3">Plan</th>
                <th className="text-left px-5 py-3">Estado</th>
                <th className="text-right px-5 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredNegocios && filteredNegocios.length > 0 ? (
                filteredNegocios.map((biz) => (
                  <tr key={biz.id} className="hover:bg-muted/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-brand-100 grid place-items-center text-[10px] font-semibold text-brand-700">
                          {biz.nombreComercial.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-medium block">{biz.nombreComercial}</span>
                          <span className="text-[10px] text-muted-foreground">/{biz.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground font-mono text-xs">{biz.ruc}</td>
                    <td className="px-5 py-3 text-muted-foreground">{biz.telefono || "N/A"}</td>
                    <td className="px-5 py-3 font-medium">
                      <select 
                        className="bg-transparent text-sm font-medium outline-none cursor-pointer hover:bg-muted p-1 rounded"
                        value={biz.plan || "Growth"}
                        onChange={(e) => planMutation.mutate({ id: biz.id, plan: e.target.value })}
                        disabled={planMutation.isPending}
                      >
                        <option value="Growth">Plan Growth</option>
                        <option value="Scale">Plan Scale</option>
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={biz.estado === "ACTIVO" ? "brand" : biz.estado === "SUSPENDIDO" ? "rose" : "amber"}>
                        {biz.estado}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {biz.estado === "ACTIVO" ? (
                        <button 
                          onClick={() => suspenderMutation.mutate(biz.id)}
                          disabled={suspenderMutation.isPending}
                          className="text-xs text-rose-600 font-medium hover:underline disabled:opacity-50 cursor-pointer"
                        >
                          Suspender
                        </button>
                      ) : (
                        <button 
                          onClick={() => aprobarMutation.mutate(biz.id)}
                          disabled={aprobarMutation.isPending}
                          className="text-xs text-brand-600 font-medium hover:underline disabled:opacity-50 cursor-pointer"
                        >
                          Aprobar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-xs text-muted-foreground">
                    No se encontraron negocios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </AppShell>
  );
}

