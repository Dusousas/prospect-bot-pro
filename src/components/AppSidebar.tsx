import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Search, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/search", icon: Search, label: "Prospectar" },
  { to: "/leads", icon: Users, label: "Leads" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <h1 className="text-xl font-bold text-sidebar-primary-foreground tracking-widest">
          <span className="text-gradient uppercase">Prospect</span>
          <span className="text-sidebar-foreground uppercase">youon</span>
        </h1>

      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary shadow-glow"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mx-3 mb-4 rounded-lg bg-sidebar-accent/50 border border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/60">Status da API</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse-soft" />
          <span className="text-xs text-sidebar-foreground/80">Google Maps Conectado</span>
        </div>
      </div>
    </aside>
  );
}
