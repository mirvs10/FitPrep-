import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Card, Btn, Badge, KpiCard } from "@/components/layout/Shell";
import { useQuery } from "@tanstack/react-query";
import { tenantService } from "@/lib/api";
import { useMemo } from "react";

export const Route = createFileRoute("/tenant/orders")({
  head: () => ({ meta: [{ title: "Pedidos semanales — FitKitchen" }] }),
  component: Orders,
});

function Orders() {
  const days = ["LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"];
  const displayDays = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];

  // Calcula el lunes de la semana actual
  const fechaSemana = useMemo(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split("T")[0];
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["produccion", fechaSemana],
    queryFn: () => tenantService.obtenerProduccion(fechaSemana),
  });

  // Agrupar porciones
  const agruparPorciones = () => {
    const matrix: Record<string, Record<string, number>> = {};
    days.forEach(d => {
      matrix[d] = { DESAYUNO: 0, ALMUERZO: 0, SNACK: 0, CENA: 0 };
    });

    let totalPorciones = 0;

    if (data) {
      data.forEach((item: any) => {
        if (matrix[item.diaSemana] && matrix[item.diaSemana][item.tipoComida] !== undefined) {
          matrix[item.diaSemana][item.tipoComida] += item.cantidadTotal;
          totalPorciones += item.cantidadTotal;
        }
      });
    }

    return { matrix, totalPorciones };
  };

  const { matrix, totalPorciones } = agruparPorciones();

  return (
    <AppShell breadcrumbs={["FitKitchen", "Pedidos semanales"]}>
      <div className="p-8">
        <PageHeader backTo="/tenant" eyebrow={`Semana del ${fechaSemana}`} title="Pedidos semanales" description="Vista consolidada de demanda por día." actions={<Btn>Exportar plan</Btn>} />
        <div className="grid sm:grid-cols-4 gap-5 mb-6">
          <KpiCard label="Pedidos totales" value="N/A" />
          <KpiCard label="Porciones planificadas" value={totalPorciones.toString()} />
          <KpiCard label="Ingreso proyectado" value="N/A" />
          <KpiCard label="Capacidad usada" value="N/A" />
        </div>
        <Card className="overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border">
            {displayDays.map((d,i) => (
              <div key={d} className="p-4 text-center border-r border-border last:border-r-0">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{d}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((diaBackend) => (
              <div key={diaBackend} className="p-3 space-y-2 border-r border-border last:border-r-0 min-h-[300px]">
                {isLoading ? (
                  <div className="text-xs text-muted-foreground">Cargando...</div>
                ) : (
                  Object.entries(matrix[diaBackend]).map(([tipo, cant], i) => (
                    <div key={tipo} className="p-2.5 rounded-lg bg-surface border border-border">
                      <Badge tone={i===0?"amber":i===1?"brand":i===2?"neutral":"blue"}>{tipo}</Badge>
                      <div className="text-lg font-semibold tabular-nums mt-1">{cant}</div>
                      <div className="text-[10px] text-muted-foreground">porciones</div>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
