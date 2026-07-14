import { createFileRoute, Link, useRouter, useBlocker, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { authService, planesService, platosService } from "../lib/api";
import { MockupShell, PageHeader, Card, Btn, Badge, ProgressBar, Donut } from "@/components/mockup/Shell";
import { Plus, ChevronLeft, ChevronRight, Trash2, X, Search, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/athlete/plan")({
  head: () => ({ meta: [{ title: "Planificación semanal — NutriFlow" }] }),
  component: Plan,
});

function Plan() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const navigate = useNavigate();

  // Estados del plan en edición
  const [comidasProgramadas, setComidasProgramadas] = useState<Array<{ platoId: number; diaSemana: string; tipoComida: string; cantidad: number; isPaid?: boolean; isNew?: boolean }>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Lun");
  const [selectedTipo, setSelectedTipo] = useState("Almuerzo");
  const [cantidad, setCantidad] = useState(1);
  const [isDirty, setIsDirty] = useState(false);

  // Estados para la vista diaria / semanal
  const [viewMode, setViewMode] = useState<"semana" | "dia">("semana");
  const [selectedDayTab, setSelectedDayTab] = useState("Lun");

  // Calcular lunes de esta semana como baseline
  const getLunesSemana = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // lunes
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const [fechaInicioSemana, setFechaInicioSemana] = useState(() => {
    const baseline = getLunesSemana(new Date());
    return baseline.toISOString().split("T")[0]; // YYYY-MM-DD
  });

  const esSemanaPasada = (() => {
    const todayLunes = getLunesSemana(new Date());
    const selectedLunes = new Date(fechaInicioSemana);
    return selectedLunes.getTime() < todayLunes.getTime();
  })();

  const formatDate = (dateStr: string) => {
    const parts = dateStr.split("-");
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };

  const fechaFinSemana = (() => {
    const parts = fechaInicioSemana.split("-");
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    d.setDate(d.getDate() + 6);
    return d.toISOString().split("T")[0];
  })();

  const handlePrevWeek = () => {
    const parts = fechaInicioSemana.split("-");
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    d.setDate(d.getDate() - 7);
    setFechaInicioSemana(d.toISOString().split("T")[0]);
  };

  const handleNextWeek = () => {
    const parts = fechaInicioSemana.split("-");
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    d.setDate(d.getDate() + 7);
    setFechaInicioSemana(d.toISOString().split("T")[0]);
  };

  // Estados para la ventana flotante /add-meal
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedPlatoIdInModal, setSelectedPlatoIdInModal] = useState<number | null>(null);
  const [favoritos, setFavoritos] = useState<number[]>([]);

  // Cargar datos del backend
  const { data: usuario } = useQuery({
    queryKey: ["usuarioPerfil"],
    queryFn: authService.getMe,
  });

  const { data: misPlanes, isLoading: isPlanesLoading } = useQuery({
    queryKey: ["misPlanes"],
    queryFn: planesService.getMisPlanes,
  });

  const { data: platos, isLoading: isPlatosLoading } = useQuery({
    queryKey: ["catalogoPlatosGeneral"],
    queryFn: platosService.listarPlatosGenerales,
  });

  // Inicializar comidas programadas desde el borrador temporal y planes pagados
  useEffect(() => {
    if (usuario) {
      // 1. Buscar si hay planes pagados en la base de datos para esta semana
      const planesSemana = misPlanes?.filter(p => p.fechaInicioSemana === fechaInicioSemana) || [];
      const comidasPagadas = planesSemana.flatMap(p => p.comidas.map((c) => ({
        platoId: c.platoId,
        diaSemana: c.diaSemana,
        tipoComida: c.tipoComida,
        cantidad: c.cantidad,
        isPaid: true
      })));

      // 2. Buscar si hay un borrador guardado en localStorage para esta semana (adiciones nuevas)
      const key = `plan_semanal_borrador_${usuario.email}_${fechaInicioSemana}`;
      const saved = localStorage.getItem(key);
      let comidasBorrador: any[] = [];
      if (saved) {
        try {
          comidasBorrador = JSON.parse(saved).map((c: any) => ({ ...c, isNew: true }));
        } catch (e) {
          console.error("Error parsing plan draft from localStorage:", e);
        }
      }

      setComidasProgramadas([...comidasPagadas, ...comidasBorrador]);
      setIsDirty(comidasBorrador.length > 0);
    }
  }, [fechaInicioSemana, misPlanes, usuario]);

  // Cargar favoritos del localStorage
  useEffect(() => {
    if (usuario) {
      const key = `favoritos_${usuario.email}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try { setFavoritos(JSON.parse(saved)); } catch(e) {}
      }
    }
  }, [usuario, isModalOpen]);

  // Bloqueador de navegación nativo de TanStack Router con Resolver para interceptar enlaces
  const blocker = useBlocker({
    shouldBlockFn: ({ next }) => {
      const targetPath = next.pathname;
      // Permitir checkout, carrito o detalle de comida
      if (targetPath.includes("/cart") || targetPath.includes("/checkout") || targetPath.includes("/meal")) {
        return false;
      }
      return isDirty;
    },
    withResolver: true
  });

  useEffect(() => {
    if (blocker.status === "blocked") {
      const confirmLeave = window.confirm(
        "¿Deseas salir? Se perderá toda tu planificación actual..."
      );
      if (confirmLeave) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);

  // Interceptar recarga / cierre de pestaña en el navegador
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "¿Deseas salir? Se perderá toda tu planificación actual...";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Guardar cambios en el estado local y marcar como modificado (dirty)
  const updateComidas = (newComidas: typeof comidasProgramadas) => {
    setComidasProgramadas(newComidas);
    
    const borradores = newComidas.filter(c => !c.isPaid).map(c => ({
      platoId: c.platoId,
      diaSemana: c.diaSemana,
      tipoComida: c.tipoComida,
      cantidad: c.cantidad,
    }));
    
    setIsDirty(borradores.length > 0);

    if (usuario) {
      const key = `plan_semanal_borrador_${usuario.email}_${fechaInicioSemana}`;
      if (borradores.length > 0) {
        localStorage.setItem(key, JSON.stringify(borradores));
      } else {
        localStorage.removeItem(key);
      }
    }
  };

  const handleGoToCart = () => {
    if (usuario) {
      localStorage.setItem(`plan_semanal_activo_checkout_${usuario.email}`, fechaInicioSemana);
      const key = `plan_semanal_borrador_${usuario.email}_${fechaInicioSemana}`;
      const borradores = comidasProgramadas.filter(c => !c.isPaid).map(c => ({
        platoId: c.platoId,
        diaSemana: c.diaSemana,
        tipoComida: c.tipoComida,
        cantidad: c.cantidad,
      }));
      if (borradores.length > 0) {
        localStorage.setItem(key, JSON.stringify(borradores));
      } else {
        localStorage.removeItem(key);
      }
    }
    setIsDirty(false);
  };

  const planEsPagado = misPlanes?.some(p => p.fechaInicioSemana === fechaInicioSemana) || false;

  // Cálculos dinámicos
  const targetKcalSem = (usuario?.requerimientoKcal || 2000) * 7;
  const targetProtSem = (usuario?.reqProteinasG || 150) * 7;
  const targetCarbSem = (usuario?.reqCarbohidratosG || 200) * 7;
  const targetFatSem = (usuario?.reqGrasasG || 60) * 7;

  const totalSemanaKcal = comidasProgramadas.reduce((sum, c) => {
    const plato = platos?.find((p) => p.id === c.platoId);
    return sum + (plato?.calorias || 0) * c.cantidad;
  }, 0);

  const totalSemanaProt = comidasProgramadas.reduce((sum, c) => {
    const plato = platos?.find((p) => p.id === c.platoId);
    return sum + (plato?.proteinas || 0) * c.cantidad;
  }, 0);

  const totalSemanaCarb = comidasProgramadas.reduce((sum, c) => {
    const plato = platos?.find((p) => p.id === c.platoId);
    return sum + (plato?.carbohidratos || 0) * c.cantidad;
  }, 0);

  const totalSemanaFat = comidasProgramadas.reduce((sum, c) => {
    const plato = platos?.find((p) => p.id === c.platoId);
    return sum + (plato?.grasas || 0) * c.cantidad;
  }, 0);

  const totalPrecio = comidasProgramadas.reduce((sum, c) => {
    const plato = platos?.find((p) => p.id === c.platoId);
    return sum + (plato?.precio || 0) * c.cantidad;
  }, 0);

  const pctKcal = Math.min(Math.round((totalSemanaKcal / targetKcalSem) * 100), 100);
  const pctProt = Math.min(Math.round((totalSemanaProt / targetProtSem) * 100), 100);
  const pctCarb = Math.min(Math.round((totalSemanaCarb / targetCarbSem) * 100), 100);
  const pctFat = Math.min(Math.round((totalSemanaFat / targetFatSem) * 100), 100);

  const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const handleAddComida = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlatoIdInModal) return;

    const nuevasComidas = [
      ...comidasProgramadas,
      {
        platoId: selectedPlatoIdInModal,
        diaSemana: selectedDay,
        tipoComida: selectedTipo,
        cantidad: Number(cantidad),
        isNew: true,
      },
    ];

    updateComidas(nuevasComidas);

    // Limpiar y cerrar modal
    setSelectedPlatoIdInModal(null);
    setSelectedFilter(null);
    setCantidad(1);
    setIsModalOpen(false);
  };

  const handleRemoveComida = (index: number) => {
    const nuevasComidas = comidasProgramadas.filter((_, i) => i !== index);
    updateComidas(nuevasComidas);
  };

  if (isPlanesLoading || isPlatosLoading) {
    return (
      <MockupShell breadcrumbs={["Atleta", "Plan semanal"]}>
        <div className="p-8 flex items-center justify-center min-h-[300px]">
          <span className="text-sm text-muted-foreground">Cargando tu plan y catálogo...</span>
        </div>
      </MockupShell>
    );
  }

  return (
    <MockupShell breadcrumbs={["Atleta", "Plan semanal"]}>
      <div className="p-8">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={() => navigate({ to: "/athlete" })} className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground transition-colors cursor-pointer">
            <ArrowLeft className="size-5" />
          </button>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-brand-600">Nutrición inteligente</div>
        </div>
        <PageHeader 
          title="Tu plan semanal" 
          description="Agrega comidas para cada día de la semana. Los macros se recalcularán automáticamente." 
          actions={
            <div className="flex items-center gap-3">
              {planEsPagado && (
                <Badge tone="success" className="px-3 py-1.5 text-xs font-semibold">✓ Plan Activo</Badge>
              )}
              {(!planEsPagado || isDirty) && comidasProgramadas.filter(c => !c.isPaid).length > 0 && (
                <Link to="/athlete/cart" onClick={handleGoToCart}>
                  <Btn>Ir al carrito (Nuevos) →</Btn>
                </Link>
              )}
            </div>
          } 
        />

        {/* Selector de Semana */}
        <div className="flex items-center justify-between mb-4 bg-surface border border-border px-4 py-3 rounded-xl">
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={handlePrevWeek}
              className="p-2 hover:bg-muted rounded-lg border border-border cursor-pointer transition-colors"
            >
              <ChevronLeft className="size-4 text-foreground" />
            </button>
            <div className="min-w-0">
              <div className="text-sm font-bold text-foreground">
                Semana del {formatDate(fechaInicioSemana)} al {formatDate(fechaFinSemana)}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {planEsPagado ? "✓ Plan pagado y activo para esta semana" : "⚠️ Plan en borrador (pendiente de pago)"}
              </div>
            </div>
            <button 
              type="button"
              onClick={handleNextWeek}
              className="p-2 hover:bg-muted rounded-lg border border-border cursor-pointer transition-colors"
            >
              <ChevronRight className="size-4 text-foreground" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!planEsPagado && comidasProgramadas.length > 0 && (
              <Badge tone="warning">Borrador</Badge>
            )}
            {planEsPagado && (
              <Badge tone="success">Pagado</Badge>
            )}
          </div>
        </div>

        {/* Selector de modo Vista */}
        <div className="flex items-center justify-between mb-6 bg-surface border border-border p-2 rounded-xl">
          <div className="text-xs text-muted-foreground font-semibold px-2">Visualización del Plan</div>
          <div className="flex bg-muted p-1 rounded-lg text-xs font-semibold">
            <button 
              type="button"
              onClick={() => setViewMode("semana")}
              className={`px-4 py-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "semana" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Semana
            </button>
            <button 
              type="button"
              onClick={() => setViewMode("dia")}
              className={`px-4 py-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "dia" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Día
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Tarjeta lateral de macros semanales acumulados */}
          <Card className="p-6 lg:col-span-1 h-fit lg:sticky lg:top-20">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Resumen semana</h3>
            <div className="flex justify-center mb-5">
              <Donut value={pctKcal} label={Math.round(totalSemanaKcal).toString()} sub={`/ ${targetKcalSem} kcal`} />
            </div>
            <div className="space-y-3">
              {[
                { label: "Proteína", pct: pctProt, text: `${Math.round(totalSemanaProt)} / ${targetProtSem}g` },
                { label: "Carbohidratos", pct: pctCarb, text: `${Math.round(totalSemanaCarb)} / ${targetCarbSem}g` },
                { label: "Grasas", pct: pctFat, text: `${Math.round(totalSemanaFat)} / ${targetFatSem}g` }
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
            <div className="mt-6 pt-5 border-t border-border text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Comidas planificadas</span>
                <span className="font-medium">{comidasProgramadas.length} porciones</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Costo Total</span>
                <span className="font-semibold text-brand-600">S/ {totalPrecio.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Calendario grid o Vista por Día */}
          <div className="lg:col-span-3">
            {viewMode === "semana" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {dias.map((day) => {
                  // Filtrar comidas del día
                  const comidasDia = comidasProgramadas.map((c, i) => ({ ...c, originalIndex: i })).filter(c => c.diaSemana === day);
                  
                  return (
                    <div key={day} className="space-y-2 min-h-[300px] bg-surface/30 p-2 rounded-xl border border-border/60">
                      <div className="flex items-baseline justify-between px-1 mb-1">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{day}</div>
                      </div>
                      
                      {comidasDia.map((c) => {
                        const plato = platos?.find(p => p.id === c.platoId);
                        return (
                          <Link 
                            key={c.originalIndex} 
                            to="/athlete/meal/$id" 
                            params={{ id: c.platoId.toString() }}
                            className="block text-left p-2.5 rounded-lg border border-border bg-card hover:border-brand-500/30 transition-colors relative group"
                          >
                             {!esSemanaPasada && !c.isPaid && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleRemoveComida(c.originalIndex);
                                }}
                                className="absolute top-1 right-1 size-5 rounded-full hover:bg-muted text-muted-foreground hover:text-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                              >
                                <Trash2 className="size-3" />
                              </button>
                             )}
                             <div className="flex gap-1.5 items-center">
                               <Badge tone={c.tipoComida === "Desayuno" ? "amber" : c.tipoComida === "Almuerzo" ? "brand" : "blue"}>
                                 {c.tipoComida}
                               </Badge>
                               {c.isNew && <Badge tone="warning" className="text-[9px] px-1.5 py-0.5">NUEVO</Badge>}
                             </div>
                             <div className="text-[11px] font-semibold mt-1.5 leading-tight truncate pr-4">{plato?.nombre}</div>
                             <div className="text-[10px] text-muted-foreground mt-1 tabular-nums">
                               {(plato?.calorias || 0) * c.cantidad} kcal {c.cantidad > 1 && `(x${c.cantidad})`}
                             </div>
                           </Link>
                         );
                       })}
                       
                       {!esSemanaPasada && (
                        <button 
                          type="button"
                          onClick={() => {
                            setSelectedDay(day);
                            setIsModalOpen(true);
                          }}
                          className="w-full h-12 rounded-lg border border-dashed border-border grid place-items-center text-muted-foreground hover:border-brand-500 hover:text-brand-600 transition-colors cursor-pointer"
                        >
                          <Plus className="size-4" />
                        </button>
                       )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Selector de día horizontal */}
                <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-border">
                  {dias.map((day) => (
                    <button
                      type="button"
                      key={day}
                      onClick={() => setSelectedDayTab(day)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedDayTab === day
                          ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                          : "bg-surface hover:bg-muted text-muted-foreground border border-border/60"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {/* Comidas del día agrupadas */}
                <div className="space-y-4">
                  {["Desayuno", "Almuerzo", "Cena"].map((tipo) => {
                    const comidasMomento = comidasProgramadas
                      .map((c, i) => ({ ...c, originalIndex: i }))
                      .filter((c) => c.diaSemana === selectedDayTab && c.tipoComida === tipo);

                    return (
                      <Card key={tipo} className="p-5">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{tipo}</h4>
                          <span className="text-xs text-muted-foreground font-semibold">{comidasMomento.length} seleccionadas</span>
                        </div>

                        <div className="space-y-3">
                          {comidasMomento.length > 0 ? (
                            comidasMomento.map((c) => {
                              const plato = platos?.find((p) => p.id === c.platoId);
                              return (
                                <Link
                                  key={c.originalIndex}
                                  to="/athlete/meal/$id"
                                  params={{ id: c.platoId.toString() }}
                                  className="flex items-center gap-4 p-3 rounded-xl border border-border bg-card hover:border-brand-500/30 transition-all relative group block text-left"
                                >
                                  <div className="size-12 rounded-lg bg-gradient-to-br from-brand-100 to-brand-50 shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <h5 className="text-sm font-semibold truncate text-foreground pr-6 flex items-center gap-2">
                                      {plato?.nombre}
                                      {c.isNew && <Badge tone="warning" className="text-[9px] px-1.5 py-0.5">NUEVO</Badge>}
                                    </h5>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {plato?.calorias} kcal · P {plato?.proteinas}g · C {plato?.carbohidratos}g · G {plato?.grasas}g
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-4 shrink-0">
                                    <div className="text-xs text-muted-foreground font-semibold tabular-nums">
                                      x{c.cantidad} porción(es)
                                    </div>
                                    <div className="text-sm font-bold text-brand-600 tabular-nums">
                                      S/ {((plato?.precio || 0) * c.cantidad).toFixed(2)}
                                    </div>
                                    {!esSemanaPasada && !c.isPaid && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleRemoveComida(c.originalIndex);
                                        }}
                                        className="size-8 rounded-full hover:bg-muted text-muted-foreground hover:text-destructive flex items-center justify-center cursor-pointer transition-colors z-10"
                                      >
                                        <Trash2 className="size-4" />
                                      </button>
                                    )}
                                  </div>
                                 </Link>
                               );
                             })
                           ) : (
                             <div className="text-center py-6 border border-dashed border-border rounded-xl text-xs text-muted-foreground">
                               No hay comidas programadas para el {tipo} del {selectedDayTab}
                             </div>
                           )}
 
                           {!esSemanaPasada && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDay(selectedDayTab);
                                setSelectedTipo(tipo);
                                setIsModalOpen(true);
                              }}
                              className="w-full h-10 rounded-xl border border-dashed border-border hover:border-brand-500/40 hover:bg-brand-50/10 flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-brand-600 transition-all cursor-pointer font-medium mt-2"
                            >
                              <Plus className="size-3.5" /> Agregar plato para {tipo}
                            </button>
                           )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ventana flotante (Modal) con el diseño de /add-meal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl shadow-foreground/5 overflow-hidden my-8">
            <div className="px-6 h-14 flex items-center justify-between border-b border-border">
              <div>
                <div className="text-xs text-brand-600 font-semibold">{selectedDay} · {selectedTipo}</div>
                <div className="text-sm font-bold">Agregar comida al plan</div>
              </div>
              <button 
                onClick={() => {
                  setSelectedPlatoIdInModal(null);
                  setIsModalOpen(false);
                }} 
                className="size-8 grid place-items-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Selector del tipo de comida */}
              <div className="mb-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Momento del día</label>
                <div className="flex gap-2">
                  {["Desayuno", "Almuerzo", "Cena"].map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setSelectedTipo(t)}
                      className={`px-3 h-8 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                        selectedTipo === t
                          ? "bg-brand-500 text-white border-brand-500 font-semibold"
                          : "border-border hover:bg-muted text-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4 bg-brand-50/50 p-4 rounded-xl border border-brand-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-brand-800">Tus favoritos</h4>
                  <p className="text-xs text-brand-600/80 mt-1 max-w-sm">Aquí solo se mostrarán las comidas favoritas. Agrega un plato a favoritos para agregarlo al plan semanal.</p>
                </div>
                <Link to="/tenants" className="shrink-0">
                  <Btn variant="outline" size="sm">Ver comidas</Btn>
                </Link>
              </div>

              {/* Botones de Filtro */}
              <div className="flex flex-wrap gap-2 mb-5">
                {["Alto en proteína", "Bajo en carbos", "Vegano", "Sin gluten", "< 500 kcal"].map((t) => {
                  const active = selectedFilter === t;
                  return (
                    <button 
                      type="button"
                      key={t} 
                      onClick={() => setSelectedFilter(active ? null : t)}
                      className={`px-3 h-7 rounded-full text-xs font-medium border cursor-pointer transition-colors ${
                        active ? "bg-foreground text-background border-foreground font-semibold" : "border-border hover:bg-muted text-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>

              {/* Lista de Platos */}
              <div className="max-h-[350px] overflow-y-auto pr-1">
                {/* Recomendados */}
                <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 rounded-lg mb-2">
                  Recomendados para ti
                </div>
                <ul className="divide-y divide-border mb-6">
                  {platos && platos
                    .filter(p => !favoritos.includes(p.id))
                    .filter(p => {
                      if (!selectedFilter) return true;
                      if (selectedFilter === "Alto en proteína") return p.proteinas >= 30;
                      if (selectedFilter === "Bajo en carbos") return p.carbohidratos <= 20;
                      if (selectedFilter === "Vegano") return p.descripcion?.toLowerCase().includes("vegano");
                      if (selectedFilter === "Sin gluten") return p.descripcion?.toLowerCase().includes("sin gluten");
                      if (selectedFilter === "< 500 kcal") return p.calorias < 500;
                      return true;
                    })
                    .slice(0, 2)
                    .map(p => {
                      const isSelected = selectedPlatoIdInModal === p.id;
                      return (
                        <li key={`rec-${p.id}`} className={`flex items-center gap-4 py-3 px-3 rounded-xl transition-colors ${isSelected ? "bg-brand-50/50 border border-brand-100" : "border border-transparent"}`}>
                          <div className="size-12 rounded-lg bg-gradient-to-br from-brand-100 to-brand-50 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate text-foreground">{p.nombre}</div>
                            <div className="text-xs text-muted-foreground tabular-nums mt-0.5">
                              {p.calorias} kcal · P {p.proteinas}g · C {p.carbohidratos}g · G {p.grasas}g · S/ {p.precio.toFixed(2)}
                            </div>
                          </div>
                          {isSelected ? (
                            <Badge tone="brand">Seleccionado</Badge>
                          ) : (
                            <Btn type="button" variant="outline" size="sm" onClick={() => setSelectedPlatoIdInModal(p.id)}>Seleccionar</Btn>
                          )}
                        </li>
                      );
                    })}
                </ul>

                {/* Favoritos */}
                <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 rounded-lg mb-2">
                  Tus Favoritos
                </div>
                <ul className="divide-y divide-border">
                  {platos && platos
                    .filter(p => favoritos.includes(p.id))
                    .filter(p => {
                      if (!selectedFilter) return true;
                      if (selectedFilter === "Alto en proteína") return p.proteinas >= 30;
                      if (selectedFilter === "Bajo en carbos") return p.carbohidratos <= 20;
                      if (selectedFilter === "Vegano") return p.descripcion?.toLowerCase().includes("vegano");
                      if (selectedFilter === "Sin gluten") return p.descripcion?.toLowerCase().includes("sin gluten");
                      if (selectedFilter === "< 500 kcal") return p.calorias < 500;
                      return true;
                    })
                    .map(p => {
                      const isSelected = selectedPlatoIdInModal === p.id;
                      return (
                        <li key={`fav-${p.id}`} className={`flex items-center gap-4 py-3 px-3 rounded-xl transition-colors ${isSelected ? "bg-brand-50/50 border border-brand-100" : "border border-transparent"}`}>
                          <div className="size-12 rounded-lg bg-gradient-to-br from-brand-100 to-brand-50 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate text-foreground">{p.nombre}</div>
                            <div className="text-xs text-muted-foreground tabular-nums mt-0.5">
                              {p.calorias} kcal · P {p.proteinas}g · C {p.carbohidratos}g · G {p.grasas}g · S/ {p.precio.toFixed(2)}
                            </div>
                          </div>
                          {isSelected ? (
                            <Badge tone="brand">Seleccionado</Badge>
                          ) : (
                            <Btn type="button" variant="outline" size="sm" onClick={() => setSelectedPlatoIdInModal(p.id)}>Seleccionar</Btn>
                          )}
                        </li>
                      );
                    })}
                </ul>
                {platos && platos.filter(p => favoritos.includes(p.id)).length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    Aún no tienes favoritos. Explora negocios para agregarlos.
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between bg-surface gap-4">
              <div className="flex items-center gap-4">
                <div className="text-xs text-muted-foreground">
                  {selectedPlatoIdInModal ? "1 comida seleccionada" : "Ninguna comida seleccionada"}
                  {selectedPlatoIdInModal && ` · ${platos?.find(p => p.id === selectedPlatoIdInModal)?.calorias} kcal`}
                </div>
                {selectedPlatoIdInModal && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Porciones:</span>
                    <input 
                      type="number" 
                      min="1" 
                      max="10" 
                      value={cantidad} 
                      onChange={(e) => setCantidad(Number(e.target.value))}
                      className="w-12 h-7 px-1 text-center rounded border border-border bg-card text-xs focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Btn 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setSelectedPlatoIdInModal(null);
                    setIsModalOpen(false);
                  }}
                >
                  Cancelar
                </Btn>
                <Btn 
                  type="button" 
                  onClick={handleAddComida} 
                  disabled={!selectedPlatoIdInModal}
                >
                  Agregar al plan
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}
    </MockupShell>
  );
}

