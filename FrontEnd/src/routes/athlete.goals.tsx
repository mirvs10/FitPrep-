import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { authService } from "../lib/api";
import { MockupShell, PageHeader, Card, Btn } from "@/components/mockup/Shell";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/athlete/goals")({
  head: () => ({ meta: [{ title: "Objetivos nutricionales — NutriFlow" }] }),
  component: Goals,
});

function Goals() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Estados del formulario para la base de datos
  const [objetivo, setObjetivo] = useState("MANTENIMIENTO");
  const [calorias, setCalorias] = useState(2000);
  const [proteinas, setProteinas] = useState(150);
  const [carbohidratos, setCarbohidratos] = useState(200);
  const [grasas, setGrasas] = useState(60);

  // Estados del formulario locales (no guardados en base de datos)
  const [peso, setPeso] = useState("75");
  const [altura, setAltura] = useState("175");
  const [edad, setEdad] = useState("25");
  const [restricciones, setRestricciones] = useState<string[]>(["Sin lactosa"]);

  // Cargar perfil actual
  const { data: usuario, isLoading, error } = useQuery({
    queryKey: ["usuarioPerfil"],
    queryFn: authService.getMe,
  });

  // Rellenar formulario cuando se cargan los datos
  useEffect(() => {
    if (usuario) {
      setObjetivo(usuario.objetivoFitness || "MANTENIMIENTO");
      setCalorias(usuario.requerimientoKcal || 2000);
      setProteinas(usuario.reqProteinasG || 150);
      setCarbohidratos(usuario.reqCarbohidratosG || 200);
      setGrasas(usuario.reqGrasasG || 60);
    }
  }, [usuario]);

  // Mutación para guardar
  const mutation = useMutation({
    mutationFn: () =>
      authService.updateObjectives({
        objetivoFitness: objetivo,
        requerimientoKcal: Number(calorias),
        reqProteinasG: Number(proteinas),
        reqCarbohidratosG: Number(carbohidratos),
        reqGrasasG: Number(grasas),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarioPerfil"] });
      navigate({ to: "/athlete" });
    },
  });

  const handleSave = () => {
    mutation.mutate();
  };

  const toggleRestriccion = (r: string) => {
    if (restricciones.includes(r)) {
      setRestricciones(restricciones.filter((x) => x !== r));
    } else {
      setRestricciones([...restricciones, r]);
    }
  };

  if (isLoading) {
    return (
      <MockupShell breadcrumbs={["Atleta", "Objetivos"]}>
        <div className="p-8 flex items-center justify-center min-h-[300px]">
          <span className="text-sm text-muted-foreground">Cargando tus objetivos nutricionales...</span>
        </div>
      </MockupShell>
    );
  }

  if (error) {
    return (
      <MockupShell breadcrumbs={["Atleta", "Objetivos"]}>
        <div className="p-8">
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-sm">
            Error al cargar la información del perfil del deportista.
          </div>
        </div>
      </MockupShell>
    );
  }

  return (
    <MockupShell breadcrumbs={["Atleta", "Objetivos"]}>
      <div className="p-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={() => navigate({ to: "/athlete" })} className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground transition-colors cursor-pointer">
            <ArrowLeft className="size-5" />
          </button>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-brand-600">Configuración</div>
        </div>
        <PageHeader 
          title="Objetivos y Requerimientos" 
          description="Ajusta tu meta calórica y los macros. Las recomendaciones se recalculan automáticamente." 
          actions={
            <>
              <Btn variant="outline" onClick={() => navigate({ to: "/athlete" })} disabled={mutation.isPending}>Cancelar</Btn>
              <Btn onClick={handleSave} disabled={mutation.isPending}>
                {mutation.isPending ? "Guardando..." : "Guardar"}
              </Btn>
            </>
          } 
        />
        
        {mutation.isError && (
          <div className="p-3 mb-4 text-xs rounded bg-rose-50 text-rose-600 border border-rose-100">
            Error al guardar objetivos: {(mutation.error as any).response?.data?.message || mutation.error.message}
          </div>
        )}

        <Card className="p-7 space-y-8">
          <Section title="Datos básicos (Locales)">
            <div className="grid md:grid-cols-3 gap-4">
              <Input label="Peso" value={peso} onChange={(e) => setPeso(e.target.value)} placeholder="78" suffix="kg" />
              <Input label="Altura" value={altura} onChange={(e) => setAltura(e.target.value)} placeholder="180" suffix="cm" />
              <Input label="Edad" value={edad} onChange={(e) => setEdad(e.target.value)} placeholder="29" suffix="años" />
            </div>
          </Section>
          
          <Section title="Objetivo Fitness (Persistido)">
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { key: "DEFINICION", label: "Definición", desc: "Pierde grasa" },
                { key: "MANTENIMIENTO", label: "Mantenimiento", desc: "Recompón" },
                { key: "VOLUMEN", label: "Volumen", desc: "Gana músculo" },
              ].map((opt) => (
                <button 
                  type="button"
                  key={opt.key} 
                  onClick={() => setObjetivo(opt.key)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-colors ${
                    objetivo === opt.key 
                      ? "border-brand-500 bg-brand-50/40 ring-1 ring-brand-500/30 font-semibold" 
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <div className="text-sm font-semibold">{opt.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </Section>
          
          <Section title="Macros diarios (Persistido en BD)">
            <div className="grid sm:grid-cols-4 gap-4">
              <Input 
                label="Calorías" 
                type="number" 
                value={calorias} 
                onChange={(e) => setCalorias(Number(e.target.value))} 
                placeholder="2800" 
                suffix="kcal" 
              />
              <Input 
                label="Proteína" 
                type="number" 
                value={proteinas} 
                onChange={(e) => setProteinas(Number(e.target.value))} 
                placeholder="210" 
                suffix="g" 
              />
              <Input 
                label="Carbohidratos" 
                type="number" 
                value={carbohidratos} 
                onChange={(e) => setCarbohidratos(Number(e.target.value))} 
                placeholder="300" 
                suffix="g" 
              />
              <Input 
                label="Grasas" 
                type="number" 
                value={grasas} 
                onChange={(e) => setGrasas(Number(e.target.value))} 
                placeholder="75" 
                suffix="g" 
              />
            </div>
          </Section>
          
          <Section title="Restricciones Alimentarias (Locales)">
            <div className="flex flex-wrap gap-2">
              {["Sin gluten", "Vegano", "Sin lactosa", "Sin frutos secos", "Sin pescado", "Low-carb"].map((t) => {
                const active = restricciones.includes(t);
                return (
                  <button 
                    type="button"
                    key={t} 
                    onClick={() => toggleRestriccion(t)}
                    className={`px-3 h-8 rounded-full text-xs font-medium border cursor-pointer transition-colors ${
                      active ? "bg-brand-500 text-white border-brand-500" : "border-border hover:bg-muted"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </Section>
        </Card>
      </div>
    </MockupShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Input({ label, suffix, ...rest }: { label: string; suffix?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs font-medium mb-1.5 block">{label}</label>
      <div className="flex items-center h-10 rounded-md border border-input bg-card pr-3">
        <input {...rest} className="flex-1 px-3 bg-transparent outline-none text-sm" />
        {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}

