import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { authService, platosService, planesService } from "../lib/api";
import { AppShell, PageHeader, Card, Btn } from "@/components/layout/Shell";
import { CreditCard, Lock, Truck, ArrowLeft, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/athlete/checkout")({
  head: () => ({ meta: [{ title: "Pago — FitPrep" }] }),
  component: Checkout,
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

function Checkout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: usuario } = useQuery({
    queryKey: ["usuarioPerfil"],
    queryFn: authService.getMe,
  });

  const { data: platos, isLoading: isPlatosLoading } = useQuery({
    queryKey: ["catalogoPlatosGeneral"],
    queryFn: platosService.listarPlatosGenerales,
  });

  const [semanasCart, setSemanasCart] = useState<SemanaCart[]>([]);
  const [metodoPago, setMetodoPago] = useState("Tarjeta");
  const [pagadoExito, setPagadoExito] = useState(false);

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
              console.error("Error parsing checkout week:", key, e);
            }
          }
        }
      }
      weeks.sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime());
      setSemanasCart(weeks);
    }
  }, [usuario]);

  // Agrupar todas las comidas para el subtotal
  let subtotalGlobal = 0;

  const semanasConResumen = semanasCart.map(semana => {
    let subtotalSemana = 0;
    
    const grouped = semana.comidas.reduce((acc, c) => {
      const existing = acc.find(item => item.platoId === c.platoId);
      if (existing) {
        existing.cantidad += c.cantidad;
      } else {
        acc.push({ platoId: c.platoId, cantidad: c.cantidad });
      }
      return acc;
    }, [] as Array<{ platoId: number; cantidad: number }>);

    const items = grouped.map(c => {
      const plato = platos?.find(p => p.id === c.platoId);
      const precio = plato?.precio || 0;
      subtotalSemana += precio * c.cantidad;
      return {
        nombre: plato?.nombre || "Comida",
        cantidad: c.cantidad,
        precio
      };
    });
    
    subtotalGlobal += subtotalSemana;
    return { ...semana, subtotalSemana, items };
  });

  const totalSemanas = semanasCart.length;
  const envio = totalSemanas > 0 ? totalSemanas * 15.00 : 0;
  const total = subtotalGlobal + envio;

  // Mutación para guardar los planes
  const pagarPlanesMutation = useMutation({
    mutationFn: async () => {
      // Agrupar pedidos por semana y por restaurante
      const promesas = semanasCart.flatMap(semana => {
        
        // Agrupar comidas de esta semana por negocioId
        const comidasPorNegocio = new Map<number, typeof semana.comidas>();
        
        semana.comidas.forEach(c => {
          const p = platos?.find(pl => pl.id === c.platoId);
          if (p && p.negocioId) {
            if (!comidasPorNegocio.has(p.negocioId)) {
              comidasPorNegocio.set(p.negocioId, []);
            }
            comidasPorNegocio.get(p.negocioId)!.push(c);
          }
        });

        // Crear una promesa por cada negocio en esta semana
        return Array.from(comidasPorNegocio.entries()).map(([negocioId, comidasRestaurante]) => {
          let subSemana = 0;
          comidasRestaurante.forEach(c => {
            const p = platos?.find(pl => pl.id === c.platoId);
            subSemana += (p?.precio || 0) * c.cantidad;
          });
          // Cobramos envío por cada restaurante de donde se pida
          const totalSemana = subSemana + 15.00;

          return planesService.guardarPlan({
            usuarioId: usuario!.id,
            negocioId: negocioId,
            fechaInicioSemana: semana.fechaInicio,
            montoTotal: totalSemana,
            comidas: comidasRestaurante,
          });
        });
      });

      return Promise.all(promesas);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["misPlanes"] });
      
      // Limpiar los borradores del localStorage
      if (usuario) {
        semanasCart.forEach(semana => {
          localStorage.removeItem(`plan_semanal_borrador_${usuario.email}_${semana.fechaInicio}`);
        });
        localStorage.removeItem(`plan_semanal_activo_checkout_${usuario.email}`);
      }
      
      setPagadoExito(true);
      setTimeout(() => {
        router.navigate({ to: "/athlete/plan" });
      }, 3000);
    },
    onError: (error) => {
      console.error("Error al procesar el pago de los planes:", error);
      alert("Hubo un error al procesar el pago. Por favor intenta de nuevo.");
    }
  });

  const handlePagar = (e: React.FormEvent) => {
    e.preventDefault();
    pagarPlanesMutation.mutate();
  };

  const formatDate = (dateStr: string) => {
    const parts = dateStr.split("-");
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "long" });
  };

  if (pagadoExito) {
    return (
      <AppShell breadcrumbs={["Atleta", "Pago exitoso"]}>
        <div className="p-8 flex flex-col items-center justify-center min-h-[500px] text-center">
          <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="size-10" />
          </div>
          <h2 className="text-3xl font-bold mb-3">¡Pago Exitoso!</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-md">
            Tus planes semanales han sido programados. Las cocinas comenzarán a preparar tus comidas.
          </p>
          <div className="text-sm font-medium animate-pulse text-brand-600">
            Redirigiendo a tu calendario...
          </div>
        </div>
      </AppShell>
    );
  }

  if (isPlatosLoading) {
    return (
      <AppShell breadcrumbs={["Atleta", "Checkout"]}>
        <div className="p-8 flex items-center justify-center min-h-[300px]">
          <span className="text-sm text-muted-foreground">Cargando detalles...</span>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell breadcrumbs={["Atleta", "Checkout"]}>
      <div className="p-8 max-w-5xl mx-auto">
        <PageHeader 
          eyebrow="Checkout Seguro" 
          title="Completa tu suscripción" 
          description={`Estás a un paso de asegurar tu nutrición para ${totalSemanas} semana(s).`} 
        />
        
        <form onSubmit={handlePagar} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <CreditCard className="size-5 text-brand-500" /> Método de pago
              </h3>
              
              <div className="space-y-4">
                {[
                  { id: "Tarjeta", label: "Tarjeta de crédito o débito", desc: "Visa, MasterCard, Amex" },
                  { id: "Yape", label: "Yape / Plin", desc: "Pago rápido con QR" },
                ].map((m) => (
                  <label 
                    key={m.id} 
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      metodoPago === m.id ? "border-brand-500 bg-brand-50/30" : "border-border hover:border-brand-500/30"
                    }`}
                  >
                    <div className="pt-0.5">
                      <input 
                        type="radio" 
                        name="metodoPago" 
                        value={m.id}
                        checked={metodoPago === m.id}
                        onChange={(e) => setMetodoPago(e.target.value)}
                        className="size-4 accent-brand-600"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{m.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{m.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              {metodoPago === "Tarjeta" && (
                <div className="mt-6 space-y-4 pt-6 border-t border-border">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Número de tarjeta</label>
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full h-11 px-3 bg-surface border border-border rounded-lg text-sm" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Vencimiento</label>
                      <input type="text" placeholder="MM/YY" className="w-full h-11 px-3 bg-surface border border-border rounded-lg text-sm" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">CVV</label>
                      <input type="text" placeholder="123" className="w-full h-11 px-3 bg-surface border border-border rounded-lg text-sm" required />
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6 bg-surface/50">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Truck className="size-5 text-brand-500" /> Datos de Envío
              </h3>
              <p className="text-sm text-muted-foreground mb-4">Tus comidas se entregarán diariamente por las mañanas en la siguiente dirección (puedes actualizar esto en tu perfil):</p>
              <div className="bg-card p-4 rounded-xl border border-border">
                <div className="font-semibold text-sm">{usuario?.nombres} {usuario?.apellidos}</div>
                <div className="text-sm text-muted-foreground mt-1">{typeof window !== "undefined" ? localStorage.getItem("user_address") || "Dirección no configurada" : ""}</div>
              </div>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="p-6 h-fit sticky top-8">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Resumen del Pedido</h3>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {semanasConResumen.map(semana => (
                   <div key={semana.fechaInicio} className="mb-4 pb-4 border-b border-border/50 last:border-0 last:pb-0 last:mb-0">
                     <div className="text-[10px] font-bold text-brand-600 mb-2 uppercase">Semana {formatDate(semana.fechaInicio)}</div>
                     {semana.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground truncate pr-4">{item.cantidad}x {item.nombre}</span>
                        <span className="font-medium shrink-0">S/ {(item.cantidad * item.precio).toFixed(2)}</span>
                      </div>
                     ))}
                   </div>
                ))}
              </div>

              <dl className="space-y-3.5 text-sm border-t border-border pt-4">
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
              
              <Btn 
                type="submit"
                className="w-full justify-center py-3 mt-6 font-semibold text-sm flex items-center gap-2"
                disabled={pagarPlanesMutation.isPending || totalSemanas === 0}
              >
                {pagarPlanesMutation.isPending ? "Procesando..." : `Pagar S/ ${total.toFixed(2)}`}
                {!pagarPlanesMutation.isPending && <Lock className="size-4" />}
              </Btn>
              
              <div className="mt-4 flex gap-3">
                <Link to="/athlete/cart" className="flex-1">
                  <Btn variant="outline" className="w-full flex items-center justify-center gap-1 text-xs">
                    <ArrowLeft className="size-3" /> Volver al carrito
                  </Btn>
                </Link>
              </div>
            </Card>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
