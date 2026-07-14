import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout, Field } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Crear cuenta — NutriFlow" }, { name: "description", content: "Crea tu cuenta NutriFlow en menos de 60 segundos." }] }),
  component: Register,
});

function Register() {
  return <AuthLayout title="Crea tu cuenta" subtitle="Empieza gratis. Sin tarjeta de crédito.">
    <div className="flex gap-2 p-1 rounded-lg bg-muted mb-5 text-xs font-medium">
      <button className="flex-1 h-8 rounded-md bg-card shadow-sm">Soy atleta</button>
      <button className="flex-1 h-8 rounded-md text-muted-foreground">Tengo un negocio</button>
    </div>
    <form className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nombre" placeholder="Marcos" />
        <Field label="Apellido" placeholder="Rivas" />
      </div>
      <Field label="Email" type="email" placeholder="tu@email.com" />
      <Field label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" />
      <label className="flex items-start gap-2 text-xs text-muted-foreground"><input type="checkbox" className="mt-0.5 rounded" /> Acepto los términos de servicio y la política de privacidad.</label>
      <button className="w-full h-10 rounded-md bg-brand-500 text-white text-sm font-medium hover:bg-brand-600">Crear cuenta</button>
      <p className="text-center text-xs text-muted-foreground">¿Ya tienes cuenta? <Link to="/login" className="text-brand-600 font-medium">Ingresar</Link></p>
    </form>
  </AuthLayout>;
}
