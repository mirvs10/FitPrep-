import type { ReactNode } from "react";
import { Bell, ChevronRight, User, Target, CalendarDays, History, LogOut, LayoutDashboard, ListOrdered, Truck, ChefHat, Users, BarChart3 } from "lucide-react";
import { useLocation, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";

export function AppShell({
  children,
  breadcrumbs,
  topbar = true,
}: {
  children: ReactNode;
  breadcrumbs?: string[];
  topbar?: boolean;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAthleteOrTenants = location.pathname.startsWith('/athlete') || location.pathname.startsWith('/tenants') || location.pathname === '/tenants';

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("usuario");
    if (userStr) {
      try {
        setUsuario(JSON.parse(userStr));
      } catch (e) {}
    }
  }, []);

  const iniciales = usuario 
    ? (usuario.rol === 'TENANT' || usuario.rol === 'ADMIN'
        ? `${usuario.apellidos?.substring(0, 2) || ""}`.toUpperCase().trim() || "AD"
        : `${usuario.nombres?.[0] || ""}${usuario.apellidos?.[0] || ""}`.toUpperCase().trim())
    : "MR";
  const nombreUsuario = usuario 
    ? (usuario.rol === 'TENANT' || usuario.rol === 'ADMIN'
        ? `${usuario.apellidos}`.trim() || "Administrador"
        : `${usuario.nombres} ${usuario.apellidos}`.trim()) 
    : "Mi Cuenta";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      
      <div className="flex-1 min-w-0 flex flex-col">
        {topbar && (
          <header className="sticky top-0 z-30 h-14 border-b border-border bg-background/80 backdrop-blur flex items-center justify-between px-6 gap-4">
            
            {/* Izquierda: Breadcrumbs o Logo */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
              {isAthleteOrTenants ? (
                <div className="font-bold text-base text-foreground mr-4">FitPrep</div>
              ) : (
                breadcrumbs?.map((b, i) => {
                  let displayText = b;
                  if (usuario && (b.includes("FitKitchen") || b === "FitKitchen Madrid")) {
                    displayText = usuario.nombres;
                  }
                  return (
                    <span key={i} className="flex items-center gap-2 truncate">
                      {i > 0 && <ChevronRight className="size-3" />}
                      <span className={i === (breadcrumbs.length - 1) ? "text-foreground font-medium" : ""}>{displayText}</span>
                    </span>
                  );
                })
              )}
            </div>

            {/* Centro: Navegación Principal para Atletas */}
            {isAthleteOrTenants && (
              <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center bg-muted/50 p-1 rounded-lg">
                <Link 
                  to="/athlete" 
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${location.pathname === '/athlete' || location.pathname === '/athlete/' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/tenants" 
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${location.pathname.startsWith('/tenants') ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Comidas
                </Link>
              </div>
            )}

            {/* Derecha: Acciones y Perfil */}
            <div className="flex items-center gap-3">
              
              {/* Perfil Dropdown */}
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="size-8 rounded-full bg-brand-100 grid place-items-center text-[11px] font-semibold text-brand-700 cursor-pointer hover:ring-2 hover:ring-brand-500/50 transition-all"
                >
                  {iniciales || "U"}
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-xl overflow-hidden py-1 z-50">
                    <div className="px-4 py-2 border-b border-border mb-1">
                      <div className="text-sm font-semibold truncate">{nombreUsuario}</div>
                      <div className="text-xs text-muted-foreground">{usuario?.rol === 'ADMIN' ? "SuperAdmin" : isAthleteOrTenants ? "Atleta" : "Restaurante"}</div>
                    </div>
                    
                    {usuario?.rol === 'ADMIN' ? (
                      <>
                        <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setIsProfileOpen(false)}>
                          <LayoutDashboard className="size-4 text-muted-foreground" /> Dashboard
                        </Link>
                        <Link to="/admin/businesses" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setIsProfileOpen(false)}>
                          <Truck className="size-4 text-muted-foreground" /> Negocios
                        </Link>
                        <Link to="/admin/users" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setIsProfileOpen(false)}>
                          <Users className="size-4 text-muted-foreground" /> Usuarios
                        </Link>
                        <Link to="/admin/subscriptions" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setIsProfileOpen(false)}>
                          <ListOrdered className="size-4 text-muted-foreground" /> Suscripciones
                        </Link>
                        <Link to="/admin/reports" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setIsProfileOpen(false)}>
                          <BarChart3 className="size-4 text-muted-foreground" /> Reportes
                        </Link>
                      </>
                    ) : usuario?.rol === 'TENANT' ? (
                      <>
                        <Link to="/tenant" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setIsProfileOpen(false)}>
                          <LayoutDashboard className="size-4 text-muted-foreground" /> Dashboard
                        </Link>
                        <Link to="/tenant/delivery" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setIsProfileOpen(false)}>
                          <Truck className="size-4 text-muted-foreground" /> Entregas
                        </Link>
                        <Link to="/tenant/meals" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setIsProfileOpen(false)}>
                          <ChefHat className="size-4 text-muted-foreground" /> Comidas
                        </Link>
                        <Link to="/tenant/clients" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setIsProfileOpen(false)}>
                          <Users className="size-4 text-muted-foreground" /> Clientes
                        </Link>
                        <Link to="/tenant/reports" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setIsProfileOpen(false)}>
                          <BarChart3 className="size-4 text-muted-foreground" /> Reportes
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/athlete/goals" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setIsProfileOpen(false)}>
                          <Target className="size-4 text-muted-foreground" /> Objetivos
                        </Link>
                        <Link to="/athlete/plan" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setIsProfileOpen(false)}>
                          <CalendarDays className="size-4 text-muted-foreground" /> Plan semanal
                        </Link>
                        <Link to="/athlete/orders" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setIsProfileOpen(false)}>
                          <History className="size-4 text-muted-foreground" /> Historial
                        </Link>
                        <Link to="/athlete/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setIsProfileOpen(false)}>
                          <User className="size-4 text-muted-foreground" /> Perfil
                        </Link>
                      </>
                    )}
                    
                    <div className="h-px bg-border my-1" />
                    
                    <button 
                      onClick={() => {
                        localStorage.removeItem("token");
                        navigate({ to: "/login" });
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="size-4" /> Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>
        )}
        <main className="flex-1 min-w-0 mx-auto w-full max-w-7xl">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, actions, backTo }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode; backTo?: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div className="min-w-0">
        {backTo && (
          <Link to={backTo} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Volver
          </Link>
        )}
        {eyebrow && (
          <div className="text-[11px] font-semibold uppercase tracking-widest text-brand-600 mb-1.5">{eyebrow}</div>
        )}
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card shadow-sm ${className}`}>{children}</div>
  );
}

export function KpiCard({ label, value, delta, hint }: { label: string; value: string; delta?: string; hint?: string }) {
  return (
    <Card className="p-5">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">{label}</div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      {(delta || hint) && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {delta && <span className="text-brand-600 font-medium">{delta}</span>}
          {hint && <span className="text-muted-foreground">{hint}</span>}
        </div>
      )}
    </Card>
  );
}

export function Btn({
  children, variant = "primary", size = "md", className = "", ...rest
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const sizes = { sm: "h-8 px-3 text-xs", md: "h-9 px-4 text-sm" };
  const variants = {
    primary: "bg-brand-500 text-white hover:bg-brand-600 shadow-sm shadow-brand-500/20",
    secondary: "bg-foreground text-background hover:opacity-90",
    outline: "border border-border bg-card hover:bg-muted",
    ghost: "hover:bg-muted",
  };
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-md font-medium transition-colors ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "brand" | "amber" | "blue" | "rose" }) {
  const tones = {
    neutral: "bg-muted text-muted-foreground",
    brand: "bg-brand-50 text-brand-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    rose: "bg-rose-50 text-rose-700",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function ProgressBar({ value, tone = "brand" }: { value: number; tone?: "brand" | "blue" | "amber" }) {
  const tones = { brand: "bg-brand-500", blue: "bg-blue-500", amber: "bg-amber-500" };
  return (
    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div className={`h-full rounded-full ${tones[tone]}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export function Donut({ value, size = 140, label, sub }: { value: number; size?: number; label: string; sub?: string }) {
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(var(--brand-500) ${value * 3.6}deg, var(--muted) 0)`,
        }}
      />
      <div
        className="absolute rounded-full bg-card grid place-items-center flex-col"
        style={{ width: size * 0.72, height: size * 0.72 }}
      >
        <div className="text-center">
          <div className="text-xl font-semibold tabular-nums">{label}</div>
          {sub && <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{sub}</div>}
        </div>
      </div>
    </div>
  );
}
