import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../lib/api";
import { AppShell, PageHeader, Card, Btn, Badge } from "@/components/layout/Shell";
import { Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Usuarios — Admin FitPrep" }] }),
  component: Users,
});

function Users() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: adminService.getUsuarios,
  });

  const eliminarMutation = useMutation({
    mutationFn: (id: number) => adminService.eliminarUsuario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });

  const filteredUsers = users?.filter((u) => {
    const matchesSearch = (u.nombres?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
                          (u.apellidos?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                          (u.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (roleFilter === "Atletas") return u.rol === "ATHLETE";
    if (roleFilter === "Owners") return u.rol === "TENANT";
    if (roleFilter === "Admins") return u.rol === "ADMIN";
    return true;
  });

  if (isLoading) {
    return (
      <AppShell breadcrumbs={["Admin SaaS", "Usuarios"]}>
        <div className="p-8 flex items-center justify-center min-h-[300px]">
          <span className="text-sm text-muted-foreground">Cargando usuarios...</span>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell breadcrumbs={["Admin SaaS", "Usuarios"]}>
      <div className="p-8">
        <PageHeader 
          eyebrow={`${users?.length || 0} cuentas`} 
          title="Gestión de usuarios" 
          actions={<Link to="/admin" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">Volver al Dashboard</Link>} 
        />
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 h-9 rounded-md bg-muted text-sm flex-1 max-w-md">
              <Search className="size-4 text-muted-foreground" />
              <input className="bg-transparent flex-1 outline-none" placeholder="Buscar usuario..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            {["Todos","Atletas","Owners","Admins"].map((t) => (
              <button 
                key={t} 
                onClick={() => setRoleFilter(t)}
                className={`px-3 h-8 rounded-md text-xs font-medium ${roleFilter === t ? "bg-foreground text-background" : "border border-border"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <table className="w-full text-sm">
            <thead className="bg-surface text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-3">Usuario</th>
                <th className="text-left px-5 py-3">Rol</th>
                <th className="text-left px-5 py-3">Negocio ID</th>
                <th className="text-left px-5 py-3">ID</th>
                <th className="text-right px-5 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-brand-100 grid place-items-center text-[10px] font-semibold text-brand-700">
                          {u.nombres?.substring(0,2).toUpperCase() || "??"}
                        </div>
                        <div>
                          <div className="font-medium">{u.nombres} {u.apellidos}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-medium">
                      {u.rol === "TENANT" ? "Owner" : u.rol === "ATHLETE" ? "Atleta" : u.rol}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {u.negocioId || "-"}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground font-mono text-xs">
                      {u.id}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button 
                        onClick={() => {
                          if(confirm(`¿Estás seguro de eliminar a ${u.nombres}? Esta acción es irreversible.`)) {
                            eliminarMutation.mutate(u.id);
                          }
                        }}
                        disabled={eliminarMutation.isPending}
                        className="text-xs text-rose-600 font-medium hover:underline disabled:opacity-50"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-xs text-muted-foreground">
                    No se encontraron usuarios.
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
