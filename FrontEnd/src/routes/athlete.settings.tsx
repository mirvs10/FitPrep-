import { createFileRoute } from "@tanstack/react-router";
import { MockupShell, PageHeader, Card, Btn } from "@/components/mockup/Shell";

export const Route = createFileRoute("/athlete/settings")({
  head: () => ({ meta: [{ title: "Configuración — NutriFlow" }] }),
  component: Settings,
});

const sections = [
  { t: "Notificaciones", rows: [["Recordatorios de comidas","Recibe alertas 15 min antes",true],["Resumen semanal","Tu progreso cada lunes",true],["Promociones","Ofertas de los negocios",false]] },
  { t: "Privacidad", rows: [["Perfil público","Permitir que otros vean tu progreso",false],["Compartir datos con nutricionista","",true]] },
  { t: "Cuenta", rows: [["Autenticación en 2 pasos","Recomendado",false],["Sesiones activas","2 dispositivos",true]] },
];

function Settings() {
  return (
    <MockupShell breadcrumbs={["Atleta", "Configuración"]}>
      <div className="p-8 max-w-3xl mx-auto">
        <PageHeader title="Configuración de cuenta" description="Personaliza tu experiencia y privacidad." />
        <div className="space-y-5">
          {sections.map(s => (
            <Card key={s.t} className="p-6">
              <h3 className="text-sm font-semibold mb-4">{s.t}</h3>
              <div className="divide-y divide-border">
                {s.rows.map(([l,d,v]) => (
                  <div key={l as string} className="py-3 flex items-center justify-between gap-4">
                    <div><div className="text-sm font-medium">{l}</div>{d && <div className="text-xs text-muted-foreground">{d}</div>}</div>
                    <div className={`w-9 h-5 rounded-full p-0.5 ${v?"bg-brand-500":"bg-muted"}`}>
                      <div className={`size-4 rounded-full bg-card shadow transition-transform ${v?"translate-x-4":""}`} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
          <Card className="p-6 border-destructive/30">
            <h3 className="text-sm font-semibold text-destructive mb-1">Zona peligrosa</h3>
            <p className="text-xs text-muted-foreground mb-4">Estas acciones son permanentes.</p>
            <div className="flex gap-3"><Btn variant="outline">Cerrar sesión</Btn><Btn variant="outline" className="text-destructive border-destructive/40">Eliminar cuenta</Btn></div>
          </Card>
        </div>
      </div>
    </MockupShell>
  );
}
