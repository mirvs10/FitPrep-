import { createFileRoute } from "@tanstack/react-router";
import { MockupShell, PageHeader, Card, Btn } from "@/components/mockup/Shell";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Configuración plataforma — Admin NutriFlow" }] }),
  component: AdminSettings,
});

function AdminSettings() {
  return (
    <MockupShell breadcrumbs={["Admin SaaS", "Configuración"]}>
      <div className="p-8 max-w-4xl">
        <PageHeader eyebrow="Sistema" title="Configuración de la plataforma" actions={<><Btn variant="outline">Cancelar</Btn><Btn>Guardar</Btn></>} />
        <div className="space-y-5">
          <Card className="p-6">
            <h3 className="text-sm font-semibold mb-4">Branding global</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input label="Nombre de la plataforma" defaultValue="NutriFlow" />
              <Input label="Email de soporte" defaultValue="soporte@nutriflow.app" />
              <Input label="Dominio principal" defaultValue="nutriflow.app" />
              <Input label="Color primario" defaultValue="#16a34a" />
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-semibold mb-4">Comisiones y tarifas</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              <Input label="Comisión por pedido" defaultValue="10%" />
              <Input label="Fee de pasarela" defaultValue="2.9% + $0.30" />
              <Input label="Retención automática" defaultValue="3 días" />
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-semibold mb-4">Toggles operativos</h3>
            <div className="divide-y divide-border">
              {[["Onboarding automático","Aprueba negocios sin revisión manual",true],["Pagos en producción","Modo live de la pasarela",true],["Modo mantenimiento","Bloquea el acceso al panel público",false],["Feature flag · Reportes IA","Análisis predictivo en beta",true]].map(([l,d,v]) => (
                <div key={l as string} className="py-3 flex items-center justify-between">
                  <div><div className="text-sm font-medium">{l}</div><div className="text-xs text-muted-foreground">{d}</div></div>
                  <div className={`w-9 h-5 rounded-full p-0.5 ${v?"bg-brand-500":"bg-muted"}`}>
                    <div className={`size-4 rounded-full bg-card shadow transition-transform ${v?"translate-x-4":""}`} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </MockupShell>
  );
}
function Input({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <div><label className="text-xs font-medium mb-1.5 block">{label}</label><input {...rest} className="w-full h-10 px-3 rounded-md border border-input bg-card text-sm" /></div>;
}
