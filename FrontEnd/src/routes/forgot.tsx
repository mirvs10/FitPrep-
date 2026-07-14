import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout, Field } from "./login";

export const Route = createFileRoute("/forgot")({
  head: () => ({ meta: [{ title: "Recuperar contraseña — NutriFlow" }, { name: "description", content: "Recupera el acceso a tu cuenta NutriFlow." }] }),
  component: Forgot,
});

function Forgot() {
  return <AuthLayout title="Recuperar contraseña" subtitle="Te enviaremos un enlace seguro a tu email.">
    <form className="space-y-4">
      <Field label="Email" type="email" placeholder="tu@email.com" />
      <button className="w-full h-10 rounded-md bg-brand-500 text-white text-sm font-medium hover:bg-brand-600">Enviar enlace</button>
      <p className="text-center text-xs text-muted-foreground">¿Lo recordaste? <Link to="/login" className="text-brand-600 font-medium">Volver al login</Link></p>
    </form>
  </AuthLayout>;
}
