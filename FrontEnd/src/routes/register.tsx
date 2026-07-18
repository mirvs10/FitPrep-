import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthLayout, Field } from "./login";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../lib/api";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Crear cuenta — FitPrep" }, { name: "description", content: "Crea tu cuenta FitPrep en menos de 60 segundos." }] }),
  component: Register,
});

function Register() {
  const [type, setType] = useState<"atleta" | "negocio">("atleta");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  
  // Negocio specific fields
  const [nombreComercial, setNombreComercial] = useState("");
  const [ruc, setRuc] = useState("");
  const [telefono, setTelefono] = useState("");
  
  // Shared fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Checkout Modal State
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Growth");
  const [paymentMethod, setPaymentMethod] = useState("Tarjeta");
  
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const mutationAtleta = useMutation({
    mutationFn: () => authService.registrarDeportista({ nombres, apellidos, email, password }),
    onSuccess: (data) => {
      if (data.token) localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data));
      navigate({ to: "/athlete" });
    },
    onError: (error: any) => {
      setErrorMsg(error.response?.data?.message || "Error al crear cuenta.");
    }
  });

  const mutationNegocio = useMutation({
    mutationFn: () => {
      const slug = nombreComercial.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return authService.registrarNegocio({ 
        nombreComercial, slug, ruc, telefono, email, password, plan: selectedPlan, metodoPago: paymentMethod
      });
    },
    onSuccess: (data: any) => {
      if (data.token) localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data));
      navigate({ to: "/tenant" });
    },
    onError: (error: any) => {
      setErrorMsg(error.response?.data?.message || "Error al registrar el negocio.");
      setShowCheckout(false);
    }
  });

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (type === "atleta") {
      mutationAtleta.mutate();
    } else {
      // Show checkout modal for business instead of immediate submission
      setShowCheckout(true);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutationNegocio.mutate();
  };

  const isPending = mutationAtleta.isPending || mutationNegocio.isPending;

  return (
    <>
      <AuthLayout title="Crea tu cuenta" subtitle="Empieza gratis.">
        <div className="flex gap-2 p-1 rounded-lg bg-muted mb-5 text-xs font-medium">
          <button 
            type="button"
            onClick={() => { setType("atleta"); setErrorMsg(""); setShowCheckout(false); }}
            className={`flex-1 h-8 rounded-md transition-all ${type === "atleta" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Soy atleta
          </button>
          <button 
            type="button"
            onClick={() => { setType("negocio"); setErrorMsg(""); setShowCheckout(false); }}
            className={`flex-1 h-8 rounded-md transition-all ${type === "negocio" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Tengo un negocio
          </button>
        </div>

        <form onSubmit={handleInitialSubmit} className="space-y-4">
          {errorMsg && !showCheckout && (
            <div className="p-3 text-xs rounded bg-rose-50 text-rose-600 border border-rose-100">
              {errorMsg}
            </div>
          )}

          {type === "atleta" ? (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre" placeholder="Marcos" value={nombres} onChange={e => setNombres(e.target.value)} required disabled={isPending} />
              <Field label="Apellido" placeholder="Rivas" value={apellidos} onChange={e => setApellidos(e.target.value)} required disabled={isPending} />
            </div>
          ) : (
            <>
              <Field label="Nombre Comercial" placeholder="Ej. FitKitchen" value={nombreComercial} onChange={e => setNombreComercial(e.target.value)} required disabled={isPending} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="RUC" placeholder="10293..." value={ruc} onChange={e => setRuc(e.target.value)} required disabled={isPending} />
                <Field label="Teléfono" placeholder="+1..." value={telefono} onChange={e => setTelefono(e.target.value)} required disabled={isPending} />
              </div>
            </>
          )}

          <Field label="Email" type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required disabled={isPending} />
          <Field label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" value={password} onChange={e => setPassword(e.target.value)} required disabled={isPending} />

          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input type="checkbox" className="mt-0.5 rounded" required disabled={isPending} /> 
            Acepto los términos de servicio y la política de privacidad.
          </label>
          <button type="submit" disabled={isPending} className="w-full h-10 rounded-md bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 disabled:opacity-50">
            {isPending && type === "atleta" ? "Procesando..." : type === "atleta" ? "Crear cuenta" : "Siguiente: Elegir Plan"}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            ¿Ya tienes cuenta? <Link to="/login" className="text-brand-600 font-medium">Ingresar</Link>
          </p>
        </form>
      </AuthLayout>

      {/* Checkout Modal Overlay para Negocios */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">Checkout de Suscripción</h2>
              <p className="text-sm text-muted-foreground mb-6">Elige el plan ideal para {nombreComercial}</p>
              
              {errorMsg && (
                <div className="p-3 text-xs rounded bg-rose-50 text-rose-600 border border-rose-100 mb-4">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleCheckoutSubmit}>
                {/* Paso 1: Selección de Plan */}
                <div className="mb-6 space-y-3">
                  <h3 className="text-sm font-semibold">1. Selecciona un Plan</h3>
                  {[
                    { id: "Starter", price: "$0/mes", desc: "Hasta 50 pedidos mensuales" },
                    { id: "Growth", price: "$49/mes", desc: "Pedidos ilimitados, analíticas básicas" },
                    { id: "Scale", price: "$149/mes", desc: "Marca blanca, integraciones API" }
                  ].map(plan => (
                    <label key={plan.id} className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPlan === plan.id ? 'border-brand-500 bg-brand-50' : 'border-border hover:border-brand-200'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="plan" value={plan.id} checked={selectedPlan === plan.id} onChange={(e) => setSelectedPlan(e.target.value)} className="text-brand-600 focus:ring-brand-500" />
                        <div>
                          <p className="font-semibold">{plan.id}</p>
                          <p className="text-xs text-muted-foreground">{plan.desc}</p>
                        </div>
                      </div>
                      <span className="font-bold">{plan.price}</span>
                    </label>
                  ))}
                </div>

                {/* Paso 2: Método de Pago */}
                <div className="mb-8 space-y-3">
                  <h3 className="text-sm font-semibold">2. Método de Pago</h3>
                  {selectedPlan !== "Starter" ? (
                    <div className="grid grid-cols-3 gap-3">
                      {["Tarjeta", "Yape", "Plin"].map(method => (
                        <label key={method} className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === method ? 'border-brand-500 bg-brand-50' : 'border-border hover:border-brand-200'}`}>
                          <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} className="sr-only" />
                          <span className="font-medium text-sm">{method}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md text-center">
                      No se requiere tarjeta para el plan Starter.
                    </p>
                  )}
                  
                  {/* Tarjeta Mock fields si selecciona Tarjeta y no es Starter */}
                  {selectedPlan !== "Starter" && paymentMethod === "Tarjeta" && (
                    <div className="mt-4 p-4 border border-border rounded-lg bg-muted/20 space-y-3">
                      <div className="flex gap-2 text-xs text-muted-foreground items-center mb-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        Pago seguro y encriptado
                      </div>
                      <input type="text" placeholder="Número de tarjeta (simulado)" className="w-full h-9 px-3 text-sm rounded border border-border bg-surface" required />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="MM/AA" className="h-9 px-3 text-sm rounded border border-border bg-surface" required />
                        <input type="text" placeholder="CVC" className="h-9 px-3 text-sm rounded border border-border bg-surface" required />
                      </div>
                    </div>
                  )}
                  
                  {/* QR Mock si selecciona Yape o Plin */}
                  {selectedPlan !== "Starter" && (paymentMethod === "Yape" || paymentMethod === "Plin") && (
                    <div className="mt-4 p-4 border border-border rounded-lg bg-muted/20 text-center">
                      <div className="w-32 h-32 mx-auto bg-white p-2 border border-border rounded-lg shadow-sm mb-3">
                        {/* Fake QR code using a simple grid pattern */}
                        <div className="w-full h-full border-[8px] border-black p-1">
                          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDAiPjwvcmVjdD4KPC9zdmc+')] opacity-80" />
                        </div>
                      </div>
                      <p className="text-sm font-medium">Escanea este código con {paymentMethod}</p>
                      <p className="text-xs text-muted-foreground mt-1">El registro se completará automáticamente</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-8">
                  <button type="button" onClick={() => setShowCheckout(false)} disabled={isPending} className="flex-1 h-10 rounded-md border border-border bg-surface text-sm font-medium hover:bg-muted">
                    Cancelar
                  </button>
                  <button type="submit" disabled={isPending} className="flex-[2] h-10 rounded-md bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 disabled:opacity-50">
                    {isPending ? "Procesando pago..." : `Pagar e Iniciar Sesión`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
