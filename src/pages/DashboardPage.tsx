import { Users, UserPlus, Phone, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { LeadCard } from "@/components/LeadCard";
import { useLeads } from "@/hooks/useLeads";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

export default function DashboardPage() {
  const { leads, stats, isLoading, updateLeadStatus, deleteLead } = useLeads();
  const recentLeads = leads.slice(0, 4);

  const chartData = useMemo(() => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const counts = new Array(7).fill(0);
    leads.forEach((l) => {
      const day = new Date(l.createdAt).getDay();
      counts[day]++;
    });
    return days.map((name, i) => ({ name, leads: counts[i] }));
  }, [leads]);

  const conversionRate = stats.totalLeads > 0
    ? ((stats.converted / stats.totalLeads) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visão geral da sua prospecção</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total de Leads" value={stats.totalLeads} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Novos Hoje" value={stats.newToday} icon={<UserPlus className="h-5 w-5" />} />
        <StatCard label="Contatados" value={stats.contacted} icon={<Phone className="h-5 w-5" />} />
        <StatCard label="Convertidos" value={stats.converted} icon={<TrendingUp className="h-5 w-5" />} trend={`${conversionRate}% taxa de conversão`} trendUp />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5 shadow-card">
          <h2 className="font-semibold mb-4">Leads por Dia da Semana</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="leads" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Leads Recentes</h2>
            <span className="text-xs text-muted-foreground">{recentLeads.length} leads</span>
          </div>
          {isLoading ? (
            <p className="text-sm text-muted-foreground text-center py-8">Carregando...</p>
          ) : recentLeads.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhum lead ainda. Vá para Prospectar!</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} onUpdateStatus={updateLeadStatus} onDelete={deleteLead} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
