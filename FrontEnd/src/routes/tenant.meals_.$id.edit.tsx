import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { platosService } from "../lib/api";
import { MockupShell, PageHeader, Card, Btn } from "@/components/mockup/Shell";
import { ArrowLeft, Upload } from "lucide-react";

export const Route = createFileRoute("/tenant/meals_/$id/edit")({
  head: () => ({ meta: [{ title: "Editar comida — FitKitchen" }] }),
  component: EditMeal,
});

function EditMeal() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: plato, isLoading } = useQuery({
    queryKey: ["plato", id],
    queryFn: () => platosService.obtenerPlato(Number(id)),
  });

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [calorias, setCalorias] = useState("");
  const [proteina, setProteina] = useState("");
  const [carbos, setCarbos] = useState("");
  const [grasas, setGrasas] = useState("");
  const [disponible, setDisponible] = useState(true);

  useEffect(() => {
    if (plato) {
      setNombre(plato.nombre || "");
      setDescripcion(plato.descripcion || "");
      setPrecio(plato.precio?.toString() || "");
      setCalorias(plato.calorias?.toString() || "");
      setProteina(plato.proteinas?.toString() || "");
      setCarbos(plato.carbohidratos?.toString() || "");
      setGrasas(plato.grasas?.toString() || "");
      setDisponible(plato.disponible);
    }
  }, [plato]);

  const mutation = useMutation({
    mutationFn: () =>
      platosService.actualizarPlato(Number(id), {
        nombre,
        descripcion,
        precio: Number(precio),
        calorias: Number(calorias),
        proteinas: Number(proteina),
        carbohidratos: Number(carbos),
        grasas: Number(grasas),
        disponible,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["misPlatosTenant"] });
      queryClient.invalidateQueries({ queryKey: ["catalogoPlatos"] });
      queryClient.invalidateQueries({ queryKey: ["catalogoPlatosGeneral"] });
      navigate({ to: "/tenant/meals" });
    },
  });

  const handleSave = () => {
    mutation.mutate();
  };

  if (isLoading) {
    return (
      <MockupShell breadcrumbs={["FitKitchen", "Catálogo", "Cargando..."]}>
        <div className="p-8 flex items-center justify-center min-h-[300px]">
          <span className="text-sm text-muted-foreground">Cargando datos del plato...</span>
        </div>
      </MockupShell>
    );
  }

  return (
    <MockupShell breadcrumbs={["FitKitchen", "Catálogo", "Editar", nombre]}>
      <div className="p-8 max-w-5xl">
        <div className="flex items-center gap-4 mb-2">
          <Link to="/tenant/meals" className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground transition-colors cursor-pointer">
            <ArrowLeft className="size-5" />
          </Link>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-brand-600">Catálogo</div>
        </div>
        <PageHeader 
          title="Editar comida" 
          description="Actualiza la información de este plato. Los cambios aplicarán para futuros pedidos." 
          actions={
            <>
              <Btn variant="outline" onClick={() => setDisponible(!disponible)}>
                {disponible ? "Desactivar" : "Activar"}
              </Btn>
              <Btn onClick={handleSave} disabled={mutation.isPending}>
                {mutation.isPending ? "Guardando..." : "Guardar cambios"}
              </Btn>
            </>
          } 
        />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <Card className="p-6">
              <h3 className="text-sm font-semibold mb-4">Información básica</h3>
              <div className="space-y-4">
                <Field label="Nombre" placeholder="Ej. Pollo al Limón & Quinoa" value={nombre} onChange={e => setNombre(e.target.value)} />
                <Field label="Descripción" placeholder="Describe la comida en 1-2 frases..." textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                <div className="grid sm:grid-cols-2 gap-3">
                  <Select label="Categoría (Visual UI)" options={["Desayuno","Almuerzo","Cena","Snack"]} />
                  <Field label="Precio" placeholder="8.50" prefix="$" type="number" step="0.01" value={precio} onChange={e => setPrecio(e.target.value)} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-semibold mb-4">Información nutricional</h3>
              <div className="grid sm:grid-cols-4 gap-3">
                <Field label="Calorías" placeholder="520" suffix="kcal" type="number" value={calorias} onChange={e => setCalorias(e.target.value)} />
                <Field label="Proteína" placeholder="45" suffix="g" type="number" value={proteina} onChange={e => setProteina(e.target.value)} />
                <Field label="Carbohidratos" placeholder="52" suffix="g" type="number" value={carbos} onChange={e => setCarbos(e.target.value)} />
                <Field label="Grasas" placeholder="14" suffix="g" type="number" value={grasas} onChange={e => setGrasas(e.target.value)} />
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="p-6">
              <h3 className="text-sm font-semibold mb-4">Estado</h3>
              <div className="text-sm text-muted-foreground mb-4">
                {disponible 
                  ? "Este plato está activo y los atletas pueden agregarlo a sus planes semanales." 
                  : "Este plato está inactivo. Ya no aparecerá en el catálogo para los atletas."}
              </div>
              <Btn variant={disponible ? "outline" : "primary"} onClick={() => setDisponible(!disponible)} className="w-full">
                {disponible ? "Desactivar plato" : "Activar plato"}
              </Btn>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-semibold mb-4">Foto</h3>
              <div className="aspect-square rounded-xl border-2 border-dashed border-border grid place-items-center text-muted-foreground hover:border-brand-500 hover:text-brand-600 cursor-pointer">
                <div className="text-center">
                  <Upload className="size-6 mx-auto mb-2" />
                  <div className="text-xs">Sube una imagen</div>
                  <div className="text-[10px] mt-1">PNG, JPG hasta 5MB</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MockupShell>
  );
}

function Field({ label, prefix, suffix, textarea, ...rest }: { label: string; prefix?: string; suffix?: string; textarea?: boolean } & React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>) {
  return (
    <div>
      {label && <label className="text-xs font-medium mb-1.5 block">{label}</label>}
      {textarea ? (
        <textarea {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} rows={3} className="w-full px-3 py-2 rounded-md border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
      ) : (
        <div className="flex items-center h-10 rounded-md border border-input bg-card overflow-hidden">
          {prefix && <span className="px-3 text-xs text-muted-foreground border-r border-border">{prefix}</span>}
          <input {...(rest as React.InputHTMLAttributes<HTMLInputElement>)} className="flex-1 px-3 bg-transparent outline-none text-sm" />
          {suffix && <span className="px-3 text-xs text-muted-foreground">{suffix}</span>}
        </div>
      )}
    </div>
  );
}
function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="text-xs font-medium mb-1.5 block">{label}</label>
      <select className="w-full h-10 px-3 rounded-md border border-input bg-card text-sm">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
