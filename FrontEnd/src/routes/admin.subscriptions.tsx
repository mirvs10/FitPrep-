import { createFileRoute } from "@tanstack/react-router";
import { MockupShell, PageHeader, Card, Badge, KpiCard } from "@/components/mockup/Shell";

export const Route = createFileRoute("/admin/subscriptions")({
  head: () => ({ meta: [{ title: "Suscripciones — Admin NutriFlow" }] }),
  component: Subs,
});

function Subs() {
  return (
    <MockupShell breadcrumbs={["Admin SaaS", "Suscripciones"]}>
      <div className="p-8">
        <PageHeader eyebrow="Billing" title="Gestión de suscripciones" />
        <div className="grid sm:grid-cols-4 gap-5 mb-6">
          <KpiCard label="MRR" value="$148,420" delta="↑ 22%" />
          <KpiCard label="ARR" value="$1.78M" />
          <KpiCard label="LTV prom." value="$4,820" />
          <KpiCard label="Trial → Paid" value="38%" delta="↑ 6pts" />
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            ["Starter","$0",84,"Free forever"],
            ["Growth","$49",62,"Más popular"],
            ["Scale","$149",38,"Empresa"],
          ].map(([n,p,c,t],i) => (
            <Card key={n as string} className="p-6">
              <div className="flex items-center justify-between mb-2"><h3 className="font-semibold">{n}</h3>{i===1 && <Badge tone="brand">Popular</Badge>}</div>
              <div className="flex items-baseline gap-1"><span className="text-3xl font-semibold tabular-nums">{p}</span><span className="text-sm text-muted-foreground">/mes</span></div>
              <p className="text-xs text-muted-foreground mt-1">{t}</p>
              <div className="mt-5 pt-5 border-t border-border space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Suscriptores</span><span className="font-semibold tabular-nums">{c}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">MRR de plan</span><span className="font-semibold tabular-nums">${((c as number)*parseFloat((p as string).replace("$",""))).toLocaleString()}</span></div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-6 overflow-hidden">
          <div className="p-4 border-b border-border"><h3 className="text-sm font-semibold">Facturación reciente</h3></div>
          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase tracking-widest text-muted-foreground bg-surface">
              <tr><th className="text-left px-5 py-3">Negocio</th><th className="text-left px-5 py-3">Plan</th><th className="text-left px-5 py-3">Próximo cobro</th><th className="text-right px-5 py-3">Importe</th><th className="text-left px-5 py-3">Estado</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[["FitKitchen Madrid","Growth","12 Jun 2026","$49.00","Al día","brand"],["GymForce","Scale","8 Jun 2026","$149.00","Al día","brand"],["Macrobox","Growth","2 Jun 2026","$49.00","Pago fallido","rose"],["VitalCo","Scale","28 May 2026","$149.00","Cancelado","neutral"]].map(([n,p,d,a,s,t]) => (
                <tr key={n as string} className="hover:bg-muted/40">
                  <td className="px-5 py-3 font-medium">{n}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p}</td>
                  <td className="px-5 py-3 text-muted-foreground tabular-nums">{d}</td>
                  <td className="px-5 py-3 text-right tabular-nums font-medium">{a}</td>
                  <td className="px-5 py-3"><Badge tone={t as "brand"|"rose"|"neutral"}>{s}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </MockupShell>
  );
}
