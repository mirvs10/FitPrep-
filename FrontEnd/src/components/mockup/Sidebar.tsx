import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Home, LogIn, UserPlus, KeyRound, Building2, Store, UtensilsCrossed,
  LayoutDashboard, Target, CalendarDays, Plus, Apple, Activity, ShoppingCart,
  CreditCard, History, User, Settings, ChefHat, Package, Edit3, Carrot, Users,
  ListOrdered, Factory, ClipboardList, ShoppingBasket, Truck, Calendar,
  BarChart3, PieChart, Cog, Shield, Building, UserCog, Receipt, FileBarChart,
  SlidersHorizontal, LogOut, Dumbbell, ChefHat as ChefIcon, ShieldCheck,
} from "lucide-react";

type Item = { to: string; label: string; icon: typeof Home };
type Group = { title: string; items: Item[] };

type Role = "public" | "athlete" | "tenant" | "admin";

const publicGroup: Group = {
  title: "Público",
  items: [
    { to: "/", label: "Landing", icon: Home },
    { to: "/login", label: "Login", icon: LogIn },
    { to: "/register", label: "Registro", icon: UserPlus },
    { to: "/forgot", label: "Recuperar contraseña", icon: KeyRound },
    { to: "/tenants", label: "Directorio negocios", icon: Building2 },
    { to: "/tenants/fitkitchen", label: "Perfil negocio", icon: Store },
    { to: "/tenants/fitkitchen/catalog", label: "Catálogo público", icon: UtensilsCrossed },
  ],
};

const athleteGroups: Group[] = [
  {
    title: "Mi nutrición",
    items: [
      { to: "/athlete", label: "Dashboard", icon: LayoutDashboard },
      { to: "/athlete/goals", label: "Objetivos", icon: Target },
      { to: "/athlete/plan", label: "Plan semanal", icon: CalendarDays },
    ],
  },
  {
    title: "Comidas",
    items: [
      { to: "/tenants", label: "Explorar negocios", icon: Building2 },
    ],
  },
  {
    title: "Pedidos",
    items: [
      { to: "/athlete/cart", label: "Carrito semanal", icon: ShoppingCart },
      { to: "/athlete/checkout", label: "Checkout", icon: CreditCard },
      { to: "/athlete/orders", label: "Historial", icon: History },
    ],
  },
  {
    title: "Cuenta",
    items: [
      { to: "/athlete/profile", label: "Perfil", icon: User },
    ],
  },
];

const tenantGroups: Group[] = [
  {
    title: "Operación",
    items: [
      { to: "/tenant", label: "Dashboard", icon: LayoutDashboard },
      { to: "/tenant/orders", label: "Pedidos semanales", icon: ListOrdered },
      { to: "/tenant/delivery", label: "Entregas", icon: Truck },
    ],
  },
  {
    title: "Catálogo",
    items: [
      { to: "/tenant/meals", label: "Comidas", icon: ChefHat },
      { to: "/tenant/meals/new", label: "Nueva comida", icon: Package },
      { to: "/tenant/meals/1/edit", label: "Editar nutrición", icon: Edit3 },
    ],
  },
  {
    title: "Negocio",
    items: [
      { to: "/tenant/clients", label: "Clientes", icon: Users },
      { to: "/tenant/reports", label: "Reportes", icon: FileBarChart },
    ],
  },
];

const adminGroups: Group[] = [
  {
    title: "Plataforma",
    items: [
      { to: "/admin", label: "Dashboard general", icon: Shield },
      { to: "/admin/businesses", label: "Negocios registrados", icon: Building },
      { to: "/admin/users", label: "Usuarios", icon: UserCog },
      { to: "/admin/subscriptions", label: "Suscripciones", icon: Receipt },
      { to: "/admin/reports", label: "Reportes", icon: PieChart },
      { to: "/admin/settings", label: "Configuración", icon: SlidersHorizontal },
    ],
  },
];

function detectRole(pathname: string): Role {
  if (pathname.startsWith("/athlete")) return "athlete";
  if (pathname.startsWith("/tenant") && !pathname.startsWith("/tenants")) return "tenant";
  if (pathname.startsWith("/admin")) return "admin";
  return "public";
}

const roleMeta: Record<Role, { label: string; sub: string; icon: typeof Home; accent: string; groups: Group[]; user: { name: string; sub: string; initials: string } }> = {
  public: {
    label: "NutriFlow",
    sub: "Vista pública",
    icon: Home,
    accent: "bg-brand-500",
    groups: [publicGroup],
    user: { name: "Invitado", sub: "Explorando la plataforma", initials: "IV" },
  },
  athlete: {
    label: "Marcos Rivas",
    sub: "Deportista · Plan Fuerza",
    icon: Dumbbell,
    accent: "bg-brand-500",
    groups: athleteGroups,
    user: { name: "Marcos Rivas", sub: "marcos@nutriflow.io", initials: "MR" },
  },
  tenant: {
    label: "FitKitchen Madrid",
    sub: "Restaurante · Tenant",
    icon: ChefIcon,
    accent: "bg-emerald-600",
    groups: tenantGroups,
    user: { name: "Elena García", sub: "Gerente de cocina", initials: "EG" },
  },
  admin: {
    label: "NutriFlow SaaS",
    sub: "Administración",
    icon: ShieldCheck,
    accent: "bg-slate-900",
    groups: adminGroups,
    user: { name: "Admin Root", sub: "Superadmin plataforma", initials: "AR" },
  },
};

export function MockupSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const [activeUser, setActiveUser] = useState<{ name: string; sub: string; initials: string; rol: Role } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const initials = `${parsed.nombres?.[0] || ""}${parsed.apellidos?.[0] || ""}`.toUpperCase() || "US";
        
        let mappedRol: Role = "public";
        if (parsed.rol === "ADMIN") mappedRol = "admin";
        else if (parsed.rol === "TENANT") mappedRol = "tenant";
        else if (parsed.rol === "ATHLETE") mappedRol = "athlete";

        setActiveUser({
          name: `${parsed.nombres} ${parsed.apellidos}`,
          sub: parsed.email,
          initials,
          rol: mappedRol,
        });
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    } else {
      setActiveUser(null);
    }
  }, [pathname]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate({ to: "/login" });
  };

  // Usar el rol del usuario logueado en lugar de deducirlo del path si está autenticado
  const detectedRole = detectRole(pathname);
  const role = activeUser?.rol || detectedRole;
  const meta = roleMeta[role];
  const RoleIcon = meta.icon;

  const displayName = activeUser?.name || meta.user.name;
  const displaySub = activeUser?.sub || meta.user.sub;
  const displayInitials = activeUser?.initials || meta.user.initials;

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-surface h-screen sticky top-0">
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className={`size-9 rounded-lg ${meta.accent} grid place-items-center shrink-0`}>
            <RoleIcon className="size-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold tracking-tight truncate">{meta.label}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">{meta.sub}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {meta.groups.map((g) => (
          <div key={g.title}>
            <div className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {g.title}
            </div>
            <ul className="space-y-0.5">
              {g.items.map((it) => {
                const active = pathname === it.to;
                const Icon = it.icon;
                return (
                  <li key={it.to}>
                    <Link
                      to={it.to}
                      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition-colors ${
                        active
                          ? "bg-brand-50 text-brand-700 font-medium"
                          : "text-foreground/70 hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="size-3.5 shrink-0" />
                      <span className="truncate">{it.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2.5 px-1.5 py-1.5 rounded-md">
          <div className="size-8 rounded-full bg-brand-100 grid place-items-center text-[11px] font-semibold text-brand-700 shrink-0">
            {displayInitials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-medium truncate">{displayName}</div>
            <div className="text-[10px] text-muted-foreground truncate">{displaySub}</div>
          </div>
          <button 
            onClick={handleLogout} 
            title="Salir" 
            className="size-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground cursor-pointer"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
