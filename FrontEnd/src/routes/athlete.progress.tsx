import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Card, Donut, ProgressBar, KpiCard } from "@/components/layout/Shell";

export const Route = createFileRoute("/athlete/progress")({
  head: () => ({ meta: [{ title: "Progreso — FitPrep" }] }),
  component: Progress,
});

function Progress() {
  return (
    <AppShell breadcrumbs={["Atleta", "Progreso"]}>
      <div className="p-8">
        <PageHeader eyebrow="Análisis" title="Progreso de macronutrientes" description="Visualiza tu evolución y ajusta tu plan en consecuencia." />

        <div className="grid sm:grid-cols-4 gap-5 mb-6">
          <KpiCard label="Adherencia 30d" value="91%" delta="↑ 4pts vs mes anterior" />
          <KpiCard label="Promedio kcal" value="2,640" hint="Meta 2,800" />
          <KpiCard label="Proteína prom." value="198g" delta="↑ Objetivo cumplido" />
          <KpiCard label="Peso actual" value="78.4 kg" hint="-1.2kg en 30d" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-5">Calorías diarias (últimos 14 días)</h3>
            <svg viewBox="0 0 600 200" className="w-full h-48">
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand-500)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--brand-500)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0,1,2,3].map(i => <line key={i} x1="0" y1={i*50} x2="600" y2={i*50} stroke="var(--border)" />)}
              <path d="M0,140 L46,120 L92,90 L138,110 L184,70 L230,85 L276,60 L322,75 L368,50 L414,80 L460,55 L506,40 L552,65 L600,45" stroke="var(--brand-500)" strokeWidth="2.5" fill="none" />
              <path d="M0,140 L46,120 L92,90 L138,110 L184,70 L230,85 L276,60 L322,75 L368,50 L414,80 L460,55 L506,40 L552,65 L600,45 L600,200 L0,200 Z" fill="url(#g1)" />
            </svg>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-5">Distribución macros</h3>
            <div className="flex justify-center mb-6"><Donut value={86} label="86%" sub="Adherencia" /></div>
            <div className="space-y-3">
              <Row label="Proteína" value="32%" pct={86} tone="brand" />
              <Row label="Carbohidratos" value="48%" pct={70} tone="blue" />
              <Row label="Grasas" value="20%" pct={92} tone="amber" />
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
function Row({ label, value, pct, tone }: { label: string; value: string; pct: number; tone: "brand"|"blue"|"amber" }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>
      <ProgressBar value={pct} tone={tone} />
    </div>
  );
}
