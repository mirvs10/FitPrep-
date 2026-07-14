import { createFileRoute } from "@tanstack/react-router";
import { MockupShell, PageHeader, Card, Btn, Badge } from "@/components/mockup/Shell";
import { Search } from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Usuarios — Admin NutriFlow" }] }),
  component: Users,
});

const users = [
  ["MR","Marcos Rivas","marcos@email.com","Atleta","FitKitchen","Pro","Activo","brand"],
  ["LR","Laura Restrepo","laura@fitkitchen.es","Owner","FitKitchen","-","Activo","brand"],
  ["SO","Sonia Ocampo","sonia@email.com","Atleta","FitKitchen","Free","Activo","brand"],
  ["DF","David Fernández","david@gymforce.com","Owner","GymForce","-","Activo","brand"],
  ["EG","Elena Gómez","elena@email.com","Atleta","Macrobox","Pro","Inactivo","neutral"],
];

function Users() {
  return (
    <MockupShell breadcrumbs={["Admin SaaS", "Usuarios"]}>
      <div className="p-8">
        <PageHeader eyebrow="24,820 cuentas" title="Gestión de usuarios" actions={<Btn>+ Invitar admin</Btn>} />
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 h-9 rounded-md bg-muted text-sm flex-1 max-w-md"><Search className="size-4 text-muted-foreground" /><input className="bg-transparent flex-1 outline-none" placeholder="Buscar usuario..." /></div>
            {["Todos","Atletas","Owners","Admins"].map((t,i) => (<button key={t} className={`px-3 h-8 rounded-md text-xs font-medium ${i===0?"bg-foreground text-background":"border border-border"}`}>{t}</button>))}
          </div>
          <table className="w-full text-sm">
            <thead className="bg-surface text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr><th className="text-left px-5 py-3">Usuario</th><th className="text-left px-5 py-3">Rol</th><th className="text-left px-5 py-3">Negocio</th><th className="text-left px-5 py-3">Plan</th><th className="text-left px-5 py-3">Estado</th><th /></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map(([i,n,e,r,b,p,s,t]) => (
                <tr key={n as string} className="hover:bg-muted/40">
                  <td className="px-5 py-3"><div className="flex items-center gap-3"><div className="size-8 rounded-full bg-brand-100 grid place-items-center text-[10px] font-semibold text-brand-700">{i}</div><div><div className="font-medium">{n}</div><div className="text-xs text-muted-foreground">{e}</div></div></div></td>
                  <td className="px-5 py-3">{r}</td>
                  <td className="px-5 py-3 text-muted-foreground">{b}</td>
                  <td className="px-5 py-3">{p}</td>
                  <td className="px-5 py-3"><Badge tone={t as "brand"|"neutral"}>{s}</Badge></td>
                  <td className="px-5 py-3 text-right"><button className="text-xs text-brand-600 font-medium">Ver →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </MockupShell>
  );
}
