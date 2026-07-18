import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { authService } from "../lib/api";
import { AppShell, PageHeader, Card, Btn, Badge } from "@/components/layout/Shell";
import { useState } from "react";

export const Route = createFileRoute("/athlete/profile")({
  head: () => ({ meta: [{ title: "Perfil — FitPrep" }] }),
  component: Profile,
});

function Profile() {
  const navigate = useNavigate();
  const { data: usuario, isLoading, error } = useQuery({
    queryKey: ["usuarioPerfil"],
    queryFn: authService.getMe,
  });

  const getInitials = (nombres = "", apellidos = "") => {
    return `${nombres?.[0] || ""}${apellidos?.[0] || ""}`.toUpperCase() || "US";
  };

  const getObjetivoLabel = (obj = "") => {
    switch (obj) {
      case "DEFINICION": return "Definición (Pérdida de grasa)";
      case "MANTENIMIENTO": return "Mantenimiento";
      case "VOLUMEN": return "Volumen (Ganancia muscular)";
      default: return obj || "No configurado";
    }
  };

  if (isLoading) {
    return (
      <AppShell breadcrumbs={["Atleta", "Perfil"]}>
        <div className="p-8 flex items-center justify-center min-h-[300px]">
          <span className="text-sm text-muted-foreground">Cargando perfil...</span>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell breadcrumbs={["Atleta", "Perfil"]}>
        <div className="p-8">
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-sm">
            Error al cargar la información del perfil.
          </div>
        </div>
      </AppShell>
    );
  }

  const initials = getInitials(usuario?.nombres, usuario?.apellidos);
  const fullName = `${usuario?.nombres || ""} ${usuario?.apellidos || ""}`.trim();
  
  const [direccion, setDireccion] = useState(() => localStorage.getItem("user_address") || "No configurado");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempDireccion, setTempDireccion] = useState(direccion);

  const handleSaveAddress = () => {
    localStorage.setItem("user_address", tempDireccion);
    setDireccion(tempDireccion);
    setIsEditingAddress(false);
  };

  return (
    <AppShell breadcrumbs={["Atleta", "Perfil"]}>
      <div className="p-8 max-w-5xl mx-auto">
        <PageHeader 
          eyebrow="Mi cuenta" 
          title="Perfil del usuario" 
          actions={
            <Btn 
              variant="outline" 
              className="text-rose-600 hover:bg-rose-50 border-rose-200"
              onClick={() => {
                localStorage.removeItem("token");
                navigate({ to: "/login" });
              }}
            >
              Cerrar sesión
            </Btn>
          } 
        />
        
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="size-24 rounded-full bg-brand-100 grid place-items-center text-2xl font-bold text-brand-700 mx-auto">
              {initials}
            </div>
            <h2 className="mt-4 text-lg font-semibold">{fullName}</h2>
            <p className="text-sm text-muted-foreground">{usuario?.email}</p>
            <div className="mt-3 flex justify-center gap-1.5">
              <Badge tone="brand">{usuario?.rol === "ATHLETE" ? "Plan Atleta" : usuario?.rol}</Badge>
              <Badge>Activo</Badge>
            </div>
            <div className="mt-6 pt-5 border-t border-border grid grid-cols-3 gap-4 text-center">
              {[["12","Semanas"],["45","Comidas"],["8d","Racha"]].map(([v,l]) => (
                <div key={l}>
                  <div className="text-lg font-semibold">{v}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-5">Información personal</h3>
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              {[
                ["Nombre", fullName],
                ["Email", usuario?.email || ""],
                ["Objetivo Nutricional", getObjetivoLabel(usuario?.objetivoFitness)],
                ["Límite Diario de Kcal", usuario?.requerimientoKcal ? `${usuario.requerimientoKcal} kcal` : "No configurado"],
                ["Proteínas diarias", usuario?.reqProteinasG ? `${usuario.reqProteinasG} g` : "No configurado"],
                ["Carbohidratos diarios", usuario?.reqCarbohidratosG ? `${usuario.reqCarbohidratosG} g` : "No configurado"],
                ["Grasas diarias", usuario?.reqGrasasG ? `${usuario.reqGrasasG} g` : "No configurado"],
              ].map(([l,v]) => (
                <div key={l}>
                  <dt className="text-xs text-muted-foreground mb-1">{l}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
              <div className="sm:col-span-2 mt-2 pt-4 border-t border-border">
                <dt className="text-xs text-muted-foreground mb-1 flex items-center justify-between">
                  Dirección de Envío
                  {!isEditingAddress && (
                    <button onClick={() => setIsEditingAddress(true)} className="text-brand-600 hover:underline">Editar</button>
                  )}
                </dt>
                <dd className="font-medium">
                  {isEditingAddress ? (
                    <div className="flex gap-2 items-center mt-2">
                      <input 
                        type="text" 
                        value={tempDireccion} 
                        onChange={(e) => setTempDireccion(e.target.value)}
                        className="flex-1 h-9 rounded-md border border-border px-3 text-sm"
                        placeholder="Ej: Av. Principal 123, Ciudad"
                      />
                      <Btn size="sm" onClick={handleSaveAddress}>Guardar</Btn>
                      <Btn size="sm" variant="outline" onClick={() => { setIsEditingAddress(false); setTempDireccion(direccion); }}>Cancelar</Btn>
                    </div>
                  ) : (
                    direccion
                  )}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

