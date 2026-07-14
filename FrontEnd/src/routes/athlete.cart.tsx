import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { authService, platosService } from "../lib/api";
import { MockupShell, PageHeader, Card, Btn } from "@/components/mockup/Shell";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/athlete/cart")({
  head: () => ({ meta: [{ title: "Carrito semanal — NutriFlow" }] }),
  component: Cart,
});

interface ComidaBorrador {
  platoId: number;
  diaSemana: string;
  tipoComida: string;
  cantidad: number;
}

interface SemanaCart {
  fechaInicio: string;
  comidas: ComidaBorrador[];
}

function Cart() {
  const navigate = useNavigate();
  const { data: usuario } = useQuery({
    queryKey: ["usuarioPerfil"],
    queryFn: authService.getMe,
  });

  const { data: platos, isLoading: isPlatosLoading } = useQuery({
    queryKey: ["catalogoPlatosGeneral"],
    queryFn: platosService.listarPlatosGenerales,
  });

  const [semanasCart, setSemanasCart] = useState<SemanaCart[]>([]);

  useEffect(() => {
    if (usuario) {
      const prefix = `plan_semanal_borrador_${usuario.email}_`;
      const weeks: SemanaCart[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          const fechaInicio = key.replace(prefix, "");
          const saved = localStorage.getItem(key);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed && parsed.length > 0) {
                weeks.push({ fechaInicio, comidas: parsed });
              }
            } catch (e) {
              console.error("Error parsing cart week:", key, e);
            }
          }
        }
      }
      weeks.sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime());
      setSemanasCart(weeks);
    }
  }, [usuario]);

  const updateSemana = (fechaInicio: string, nuevasComidas: ComidaBorrador[]) => {
    setSemanasCart((prev) => {
      const copy = [...prev];
      const index = copy.findIndex((s) => s.fechaInicio === fechaInicio);
      if (index !== -1) {
        copy[index] = { ...copy[index], comidas: nuevasComidas };
      }
      return copy.filter((s) => s.comidas.length > 0);
    });

    if (usuario) {
      const key = `plan_semanal_borrador_${usuario.email}_${fechaInicio}`;
      if (nuevasComidas.length > 0) {
        localStorage.setItem(key, JSON.stringify(nuevasComidas));
      } else {
        localStorage.removeItem(key);
      }
    }
  };

  const handleIncrement = (fechaInicio: string, platoId: number) => {
    const semana = semanasCart.find((s) => s.fechaInicio === fechaInicio);
    if (semana) {
      const index = semana.comidas.findIndex((c) => c.platoId === platoId);
      if (index !== -1) {
        const copy = [...semana.comidas];
        copy[index] = { ...copy[index], cantidad: copy[index].cantidad + 1 };
        updateSemana(fechaInicio, copy);
      }
    }
  };

  const handleDecrement = (fechaInicio: string, platoId: number) => {
    const semana = semanasCart.find((s) => s.fechaInicio === fechaInicio);
    if (semana) {
      const index = semana.comidas.findIndex((c) => c.platoId === platoId);
      if (index !== -1) {
        const copy = [...semana.comidas];
        if (copy[index].cantidad > 1) {
          copy[index] = { ...copy[index], cantidad: copy[index].cantidad - 1 };
          updateSemana(fechaInicio, copy);
        } else {
          const filtradas = copy.filter((_, i) => i !== index);
          updateSemana(fechaInicio, filtradas);
        }
      }
    }
  };

  const handleRemove = (fechaInicio: string, platoId: number) => {
    const semana = semanasCart.find((s) => s.fechaInicio === fechaInicio);
    if (semana) {
      const filtradas = semana.comidas.filter((c) => c.platoId !== platoId);
      updateSemana(fechaInicio, filtradas);
    }
  };

  const formatDate = (dateStr: string) => {
    const parts = dateStr.split("-");
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "long" });
  };

  let subtotalGlobal = 0;
  let totalComidasGlobal = 0;

  const semanasConItems = semanasCart.map((semana) => {
    const groupedItems = semana.comidas.reduce((acc, c) => {
      const existing = acc.find((item) => item.platoId === c.platoId);
      if (existing) {
        existing.cantidad += c.cantidad;
        if (!existing.dias.includes(c.diaSemana)) {
          existing.dias.push(c.diaSemana);
        }
      } else {
        acc.push({ platoId: c.platoId, cantidad: c.cantidad, dias: [c.diaSemana] });
      }
      return acc;
    }, [] as Array<{ platoId: number; cantidad: number; dias: string[] }>);

    const items = groupedItems.map((item) => {
      const plato = platos?.find((p) => p.id === item.platoId);
      const precio = plato?.precio || 0;
      subtotalGlobal += item.cantidad * precio;
      totalComidasGlobal += item.cantidad;
      return {
        id: item.platoId,
        nombre: plato?.nombre || "Comida desconocida",
        dias: item.dias.join(", "),
        cantidad: item.cantidad,
        precio,
      };
    });

    return { ...semana, items };
  });

  const totalSemanas = semanasConItems.length;
  const envio = totalSemanas > 0 ? totalSemanas * 15.00 : 0;
  const total = subtotalGlobal + envio;

  if (isPlatosLoading) {
    return (
      <MockupShell breadcrumbs={["Atleta", "Carrito de Planes"]}>
        <div className="p-8 flex items-center justify-center min-h-[300px]">
          <span className="text-sm text-muted-foreground">Cargando carrito...</span>
        </div>
      </MockupShell>
    );
  }

  return (
    <MockupShell breadcrumbs={["Atleta", "Carrito de Planes"]}>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={() => navigate({ to: "/athlete/plan" })} className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground transition-colors cursor-pointer">
            <ArrowLeft className="size-5" />
          </button>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-brand-600">Resumen de Compra</div>
        </div>
        <PageHeader 
          title="Tu carrito de planes" 
          description={`${totalComidasGlobal} porción(es) planificada(s) a lo largo de ${totalSemanas} semana(s).`}
        />
        
        {totalSemanas > 0 ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {semanasConItems.map((semana) => (
                <div key={semana.fechaInicio}>
                  <h4 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-widest pl-2">
                    Semana del {formatDate(semana.fechaInicio)}
                  </h4>
                  <Card className="overflow-hidden">
                    <ul className="divide-y divide-border">
                      {semana.items.map((item) => (
                        <li key={item.id} className="p-5 flex items-center gap-4 hover:bg-card/50 transition-colors">
                          <div className="size-14 rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate text-foreground">{item.nombre}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">Días planificados: {item.dias}</div>
                          </div>
                          <div className="flex items-center gap-1.5 border border-border rounded-lg h-8 px-1 shrink-0 bg-surface">
                            <button 
                              type="button"
                              onClick={() => handleDecrement(semana.fechaInicio, item.id)}
                              className="size-6 grid place-items-center hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="text-sm font-bold w-5 text-center tabular-nums text-foreground">{item.cantidad}</span>
                            <button 
                              type="button"
                              onClick={() => handleIncrement(semana.fechaInicio, item.id)}
                              className="size-6 grid place-items-center hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <div className="w-24 text-right text-sm font-bold tabular-nums text-foreground shrink-0">
                            S/ {(item.cantidad * item.precio).toFixed(2)}
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleRemove(semana.fechaInicio, item.id)}
                            className="size-8 grid place-items-center text-muted-foreground hover:text-destructive hover:bg-muted rounded-md cursor-pointer shrink-0 transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              ))}
            </div>
            
            <Card className="p-6 h-fit lg:sticky lg:top-8">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Resumen</h3>
              <dl className="space-y-3.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal comidas</dt>
                  <dd className="tabular-nums font-semibold text-foreground">S/ {subtotalGlobal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Envío ({totalSemanas} sem)</dt>
                  <dd className="tabular-nums font-semibold text-foreground">S/ {envio.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3.5 items-baseline">
                  <dt className="text-base font-semibold text-foreground">Total general</dt>
                  <dd className="text-2xl font-bold tabular-nums text-brand-600">S/ {total.toFixed(2)}</dd>
                </div>
              </dl>
              
              <Link to="/athlete/checkout" className="block mt-6">
                <Btn className="w-full justify-center py-2.5 font-semibold text-sm">
                  Continuar al pago ({totalSemanas} semanas)
                </Btn>
              </Link>
              <p className="text-[11px] text-muted-foreground text-center mt-3">
                Cobro único integrado · Cancelación en un clic
              </p>
            </Card>
          </div>
        ) : (
          <Card className="p-10 flex flex-col items-center justify-center text-center max-w-xl mx-auto border-dashed">
            <div className="size-16 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 mb-4">
              <ShoppingBag className="size-8" />
            </div>
            <h3 className="text-lg font-bold mb-2">Tu carrito está vacío</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Aún no tienes platos en ningún plan semanal. Diseña tu plan e ingresa porciones de comidas antes de realizar el pago.
            </p>
            <div className="flex gap-3">
              <Link to="/athlete/plan">
                <Btn variant="outline" className="flex items-center gap-1">
                  <ArrowLeft className="size-4" /> Ir a Plan Semanal
                </Btn>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </MockupShell>
  );
}
