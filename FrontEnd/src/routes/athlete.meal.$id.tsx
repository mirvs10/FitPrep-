import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { platosService, authService, negocioService } from "../lib/api";
import { useState, useEffect } from "react";
import { AppShell, Card, Btn, Badge, ProgressBar } from "@/components/layout/Shell";
import { Star, Clock, Flame, Heart, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/athlete/meal/$id")({
  head: () => ({ meta: [{ title: "Detalle de comida — FitPrep" }] }),
  component: MealDetail,
});

function MealDetail() {
  const { id } = Route.useParams();

  // Cargar usuario
  const { data: usuario } = useQuery({
    queryKey: ["usuarioPerfil"],
    queryFn: authService.getMe,
  });

  const [favoritos, setFavoritos] = useState<number[]>([]);

  useEffect(() => {
    if (usuario) {
      const key = `favoritos_${usuario.email}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try { setFavoritos(JSON.parse(saved)); } catch(e) {}
      }
    }
  }, [usuario]);

  const toggleFavorito = () => {
    if (!usuario) return;
    const key = `favoritos_${usuario.email}`;
    let newFavs = [...favoritos];
    const platoIdNum = Number(id);
    if (newFavs.includes(platoIdNum)) {
      newFavs = newFavs.filter(f => f !== platoIdNum);
    } else {
      newFavs.push(platoIdNum);
    }
    setFavoritos(newFavs);
    localStorage.setItem(key, JSON.stringify(newFavs));
  };

  const isFavorito = favoritos.includes(Number(id));

  // Cargar detalles del plato
  const { data: plato, isLoading, error } = useQuery({
    queryKey: ["platoDetalle", id],
    queryFn: () => platosService.obtenerPlato(Number(id)),
  });

  if (isLoading) {
    return (
      <AppShell breadcrumbs={["Catálogo", "Detalle"]}>
        <div className="p-8 flex items-center justify-center min-h-[300px]">
          <span className="text-sm text-muted-foreground">Cargando detalle del plato...</span>
        </div>
      </AppShell>
    );
  }

  if (error || !plato) {
    return (
      <AppShell breadcrumbs={["Catálogo", "Error"]}>
        <div className="p-8">
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-sm">
            Error al cargar la información de la comida o plato no encontrado.
          </div>
          <Link to="/athlete/plan" className="mt-4 inline-block">
            <Btn variant="outline">Volver a planificación</Btn>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell breadcrumbs={["Catálogo", plato.nombre]}>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <Link to=".." className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground transition-colors cursor-pointer" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
            <ArrowLeft className="size-5" />
          </Link>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-brand-600">Atrás</div>
        </div>
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="aspect-square rounded-2xl bg-muted border border-border overflow-hidden">
              {plato.imagenUrl ? (
                <img src={plato.imagenUrl} alt={plato.nombre} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand-100 to-brand-50" />
              )}
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge tone="brand">Comida Saludable</Badge>
              {plato.etiquetas?.map(tag => (
                <Badge key={tag}>{tag}</Badge>
              ))}
              {(!plato.etiquetas || plato.etiquetas.length === 0) && plato.proteinas >= 30 && <Badge>Alto en proteína</Badge>}
              {(!plato.etiquetas || plato.etiquetas.length === 0) && plato.carbohidratos <= 20 && <Badge>Bajo en carbos</Badge>}
              {!plato.disponible && <Badge tone="neutral">No disponible</Badge>}
            </div>
            
            <h1 className="text-3xl font-semibold tracking-tight">{plato.nombre}</h1>
            
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="size-3 fill-amber-400 text-amber-400" /> 4.8 • 24 reseñas</span>
              <span className="flex items-center gap-1"><Clock className="size-3" /> Listo en 24h</span>
              <NegocioLink negocioId={plato.negocioId} />
            </div>
            
            <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
              {plato.descripcion || "Plato balanceado optimizado con macros de alta calidad, elaborado por nutricionistas y cocineros expertos para favorecer tu rendimiento físico."}
            </p>

            <Card className="p-5 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Información nutricional</h3>
                <div className="text-xs text-muted-foreground font-semibold">Por porción</div>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <Macro label="Calorías" value={plato.calorias.toString()} of="kcal" pct={Math.min(Math.round((plato.calorias / 2000) * 100), 100)} />
                <Macro label="Proteína" value={plato.proteinas.toString()} of="g" pct={Math.min(Math.round((plato.proteinas / 150) * 100), 100)} tone="brand" />
                <Macro label="Carbohidratos" value={plato.carbohidratos.toString()} of="g" pct={Math.min(Math.round((plato.carbohidratos / 200) * 100), 100)} tone="blue" />
                <Macro label="Grasas" value={plato.grasas.toString()} of="g" pct={Math.min(Math.round((plato.grasas / 60) * 100), 100)} tone="amber" />
              </div>
            </Card>

            <div className="mt-6 flex items-center gap-3">
              <div className="text-2xl font-semibold">S/ {plato.precio.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">por porción</div>
              <div className="flex-1" />
              <Btn 
                variant={isFavorito ? "primary" : "outline"} 
                size="sm" 
                onClick={toggleFavorito}
              >
                <Heart className={`size-3.5 ${isFavorito ? "fill-white" : ""}`} />
              </Btn>
              <Link to="/tenants"><Btn variant="outline" className="border-border">Seguir Explorando</Btn></Link>
              <Link to="/athlete/plan"><Btn><Flame className="size-3.5" /> Ir al Plan</Btn></Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Macro({ label, value, of, pct, tone = "brand" }: { label: string; value: string; of: string; pct: number; tone?: "brand" | "blue" | "amber" }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold tabular-nums">{value} <span className="text-xs text-muted-foreground font-normal">{of}</span></span>
      </div>
      <ProgressBar value={pct} tone={tone} />
    </div>
  );
}

function NegocioLink({ negocioId }: { negocioId: number }) {
  const { data: negocios, isLoading, isError } = useQuery({
    queryKey: ["negociosPublicos"],
    queryFn: negocioService.getAll,
  });

  if (isLoading) return <span className="text-muted-foreground ml-2 text-xs">Cargando perfil...</span>;
  if (isError || !negocios) return null;

  const negocio = negocios.find((n: any) => n.id === negocioId);
  if (!negocio) return null;

  return (
    <Link to="/tenants/$slug" params={{ slug: negocio.slug }} className="flex items-center gap-1 font-semibold text-brand-600 hover:underline ml-2">
      Visitar Perfil del Negocio 
    </Link>
  );
}
