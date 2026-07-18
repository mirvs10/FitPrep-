import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { authService, planesService, platosService } from "../lib/api";
import { AppShell, PageHeader, Card, Btn, Badge, KpiCard, ProgressBar, Donut } from "@/components/layout/Shell";
import { Flame, Trophy, CalendarDays, ChevronRight, MapPin, Star, Building2 } from "lucide-react";

export const Route = createFileRoute("/athlete/")({
  head: () => ({ meta: [{ title: "Mi panel — FitPrep" }] }),
  component: AthleteDashboard,
});

function AthleteDashboard() {
  // 1. Obtener perfil del deportista
  const { data: usuario, isLoading: isUserLoading } = useQuery({
    queryKey: ["usuarioPerfil"],
    queryFn: authService.getMe,
  });

  // 2. Obtener planes semanales
  const { data: planes, isLoading: isPlansLoading } = useQuery({
    queryKey: ["misPlanes"],
    queryFn: planesService.getMisPlanes,
  });

  // 3. Obtener catálogo de platos para resolver nombres y calorías
  const { data: platos, isLoading: isPlatosLoading } = useQuery({
    queryKey: ["catalogoPlatosGeneral"],
    queryFn: platosService.listarPlatosGenerales,
  });

  if (isUserLoading || isPlansLoading || isPlatosLoading) {
    return (
      <AppShell breadcrumbs={["Atleta", "Dashboard"]}>
        <div className="p-8 flex items-center justify-center min-h-[300px]">
          <span className="text-sm text-muted-foreground">Cargando tu panel de control...</span>
        </div>
      </AppShell>
    );
  }

  // Obtener el plan activo más reciente
  const planActivo = planes && planes.length > 0 ? planes[planes.length - 1] : null;

  // Calcular el inicio de la semana actual para poder leer el borrador correspondiente
  const getLunesSemana = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };
  const fechaInicioSemana = getLunesSemana(new Date()).toISOString().split("T")[0];

  // Obtener el día actual (ej: Lun, Mar) para cruzar con el backend/localStorage
  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const diaHoy = diasSemana[new Date().getDay()];

  // Cargar borrador de localStorage para la semana actual
  const draftKey = `plan_semanal_borrador_${usuario?.email}_${fechaInicioSemana}`;
  let comidasBorrador = [];
  if (usuario && typeof window !== "undefined") {
    const saved = localStorage.getItem(draftKey);
    if (saved) {
      try { comidasBorrador = JSON.parse(saved); } catch (e) {}
    }
  }

  // Filtrar comidas programadas para hoy (pagadas + borrador)
  const comidasPagadas = planes?.filter(p => p.fechaInicioSemana === fechaInicioSemana).flatMap(p => p.comidas) || [];
  const todasLasComidas = [...comidasPagadas, ...comidasBorrador];
  const comidasHoy = todasLasComidas.filter((c: any) => c.diaSemana === diaHoy);

  // Resolver detalles de platos de hoy
  const comidasResueltas = comidasHoy.map(c => {
    const plato = platos?.find(p => p.id === c.platoId);
    return {
      id: c.platoId,
      tipo: c.tipoComida,
      nombre: plato?.nombre || "Comida desconocida",
      calorias: (plato?.calorias || 0) * c.cantidad,
      proteinas: (plato?.proteinas || 0) * c.cantidad,
      carbohidratos: (plato?.carbohidratos || 0) * c.cantidad,
      grasas: (plato?.grasas || 0) * c.cantidad,
      cantidad: c.cantidad
    };
  });

  // Sumar calorías y macros consumidos hoy
  const kcalHoy = comidasResueltas.reduce((acc, c) => acc + c.calorias, 0);
  const protHoy = comidasResueltas.reduce((acc, c) => acc + c.proteinas, 0);
  const carbHoy = comidasResueltas.reduce((acc, c) => acc + c.carbohidratos, 0);
  const fatHoy = comidasResueltas.reduce((acc, c) => acc + c.grasas, 0);

  // Metas del usuario en base de datos
  const kcalMeta = usuario?.requerimientoKcal || 2000;
  const protMeta = usuario?.reqProteinasG || 150;
  const carbMeta = usuario?.reqCarbohidratosG || 200;
  const fatMeta = usuario?.reqGrasasG || 60;

  // Porcentajes de macros
  const pctKcal = Math.min(Math.round((kcalHoy / kcalMeta) * 100), 100);
  const pctProt = Math.min(Math.round((protHoy / protMeta) * 100), 100);
  const pctCarb = Math.min(Math.round((carbHoy / carbMeta) * 100), 100);
  const pctFat = Math.min(Math.round((fatHoy / fatMeta) * 100), 100);

  // Mapear objetivo de fitness a etiqueta limpia
  const getObjetivoLabel = (obj = "") => {
    switch (obj) {
      case "DEFINICION": return "Definición";
      case "MANTENIMIENTO": return "Mantenimiento";
      case "VOLUMEN": return "Volumen";
      case "GANANCIA_MUSCULAR": return "Volumen";
      case "PERDIDA_GRASA": return "Definición";
      default: return obj || "Mantenimiento";
    }
  };

  // Saludo dinámico
  const userName = usuario?.nombres || "Atleta";

  return (
    <AppShell breadcrumbs={["Atleta", "Dashboard"]}>
      <div className="p-8">
        <PageHeader 
          eyebrow={`Buenos días, ${userName} 👋`} 
          title="Tu semana en un vistazo" 
          description={planActivo ? `Hoy tienes ${comidasHoy.length} comidas planificadas.` : "No tienes un plan activo esta semana."} 
          actions={
            <Link to="/athlete/plan">
              <Btn><CalendarDays className="size-3.5" /> Planificar semana</Btn>
            </Link>
          } 
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <KpiCard label="Racha actual" value="8 días" delta="↑ Constancia" />
          <KpiCard label="Adherencia semanal" value={planActivo ? "95%" : "0%"} hint="Meta: 90%" />
          <KpiCard label="Kcal hoy" value={`${Math.round(kcalHoy)}`} hint={`de ${kcalMeta} kcal`} />
          <KpiCard label="Objetivo Fitness" value={getObjetivoLabel(usuario?.objetivoFitness)} hint="Tu meta actual" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:row-span-2">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Objetivos hoy</h3>
              <Link to="/athlete/goals" className="text-xs text-brand-600 font-medium hover:underline">Editar objetivos →</Link>
            </div>
            <div className="flex justify-center mb-6">
              <Donut value={pctKcal} label={Math.round(kcalHoy).toString()} sub={`/ ${kcalMeta} kcal`} />
            </div>
            <div className="space-y-4">
              {[
                { label: "Proteína", pct: pctProt, text: `${Math.round(protHoy)} / ${protMeta}g` },
                { label: "Carbohidratos", pct: pctCarb, text: `${Math.round(carbHoy)} / ${carbMeta}g` },
                { label: "Grasas", pct: pctFat, text: `${Math.round(fatHoy)} / ${fatMeta}g` }
              ].map((macro) => (
                <div key={macro.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{macro.label}</span>
                    <span className="font-medium tabular-nums">{macro.text}</span>
                  </div>
                  <ProgressBar value={macro.pct} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Comidas de hoy ({diaHoy})</h3>
              <Link to="/athlete/plan" className="text-xs text-brand-600 font-medium">Editar plan →</Link>
            </div>
            <ul className="divide-y divide-border">
              {comidasResueltas.length > 0 ? (
                comidasResueltas.map((c, i) => (
                  <Link 
                    key={i} 
                    to="/athlete/meal/$id" 
                    params={{ id: c.id.toString() }}
                    className="py-4 flex items-center gap-4 hover:bg-muted/30 px-2 rounded-lg transition-colors block text-left"
                  >
                    <div className="size-10 rounded-lg bg-brand-50 grid place-items-center text-brand-700 shrink-0">
                      <Flame className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground font-semibold">{c.tipo} (x{c.cantidad})</div>
                      <div className="text-sm font-medium truncate">{c.nombre}</div>
                    </div>
                    <div className="text-xs tabular-nums text-muted-foreground hidden sm:block shrink-0">
                      {Math.round(c.calorias)} kcal
                    </div>
                    <Badge tone={i % 2 === 0 ? "brand" : "blue"}>Programado</Badge>
                    <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-sm text-muted-foreground">No tienes comidas planificadas para hoy.</p>
                  <Link to="/athlete/plan" className="mt-4">
                    <Btn size="sm">Comenzar a planificar</Btn>
                  </Link>
                </div>
              )}
            </ul>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Comidas Recomendadas</h3>
              <Link to="/tenants" className="text-xs text-brand-600 font-medium hover:underline flex items-center gap-1">
                <Building2 className="size-3.5" /> Explorar comidas →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {platos?.slice(0, 2).map((p) => (
                <Link key={p.id} to="/athlete/meal/$id" params={{ id: p.id.toString() }} className="block group">
                  <div className="p-4 rounded-xl border border-border hover:border-brand-500/40 transition-colors bg-card/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">Recomendado</span>
                      <span className="text-xs font-semibold tabular-nums">S/ {p.precio.toFixed(2)}</span>
                    </div>
                    <h4 className="font-semibold text-sm group-hover:text-brand-600 transition-colors truncate">{p.nombre}</h4>
                    <p className="text-xs text-muted-foreground mt-2 tabular-nums">{p.calorias} kcal · {p.proteinas}g P</p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

