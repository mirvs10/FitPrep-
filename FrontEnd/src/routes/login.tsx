import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Ingresar — FitPrep" }, { name: "description", content: "Accede a tu cuenta de FitPrep." }] }),
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => authService.login(email, password),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      localStorage.setItem("usuario", JSON.stringify(data));

      // Redirigir según el rol del usuario
      if (data.rol === "ADMIN") {
        navigate({ to: "/admin" });
      } else if (data.rol === "TENANT") {
        navigate({ to: "/tenant" });
      } else {
        navigate({ to: "/athlete" });
      }
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.response?.data?.error || "Error al iniciar sesión. Verifica tus credenciales.";
      setErrorMessage(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("Por favor, ingresa tu email y contraseña.");
      return;
    }
    mutation.mutate();
  };

  return (
    <AuthLayout title="Bienvenido de vuelta" subtitle="Ingresa con tu cuenta para continuar planificando.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 text-xs rounded bg-rose-50 text-rose-600 border border-rose-100">
            {errorMessage}
          </div>
        )}
        <Field 
          label="Email" 
          type="email" 
          placeholder="tu@email.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={mutation.isPending}
          required
        />
        <Field 
          label="Contraseña" 
          type="password" 
          placeholder="•••••••••" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={mutation.isPending}
          required
          right={<Link to="/forgot" className="text-xs text-brand-600 hover:underline">¿Olvidaste?</Link>} 
        />
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" className="rounded" /> Recordarme en este dispositivo
        </label>
        <button 
          type="submit" 
          disabled={mutation.isPending}
          className="w-full h-10 rounded-md bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 disabled:opacity-50 flex items-center justify-center"
        >
          {mutation.isPending ? "Iniciando sesión..." : "Ingresar"}
        </button>
        <p className="text-center text-xs text-muted-foreground mt-4">
          ¿No tienes cuenta? <Link to="/register" className="text-brand-600 font-medium">Crear una</Link>
        </p>
      </form>
    </AuthLayout>
  );
}


export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-surface border-r border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-9 rounded-lg bg-brand-500 grid place-items-center"><div className="size-4 rounded-full border-2 border-white" /></div>
          <span className="font-semibold tracking-tight text-lg">FitPrep</span>
        </Link>
        <div>
          <h2 className="text-3xl font-semibold tracking-tight leading-tight max-w-md text-balance">"Pasamos de Excel a FitPrep y redujimos el desperdicio en un 38%."</h2>
          <div className="mt-6 flex items-center gap-3">
            <div className="size-10 rounded-full bg-brand-100 grid place-items-center text-brand-700 font-semibold">LR</div>
            <div>
              <div className="text-sm font-medium">Laura Restrepo</div>
              <div className="text-xs text-muted-foreground">CEO · FitKitchen Madrid</div>
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">© 2026 FitPrep Cloud Systems</div>
      </div>
      <div className="flex items-center justify-center p-8 relative">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Volver
        </Link>
        <div className="w-full max-w-sm mt-8">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, right, ...rest }: { label: string; right?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-medium">{label}</label>
        {right}
      </div>
      <input {...rest} className="w-full h-10 px-3 rounded-md border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring" />
    </div>
  );
}
