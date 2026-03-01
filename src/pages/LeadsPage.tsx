import { useState } from "react";
import { LeadCard } from "@/components/LeadCard";
import { useLeads } from "@/hooks/useLeads";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { LeadStatus } from "@/types/lead";

const statusFilters: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "new", label: "Novos" },
  { value: "contacted", label: "Contatados" },
  { value: "converted", label: "Convertidos" },
  { value: "lost", label: "Perdidos" },
];

export default function LeadsPage() {
  const { leads, updateLeadStatus, deleteLead } = useLeads();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");

  const filtered = leads.filter((lead) => {
    const matchSearch = lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Leads</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie todos os seus leads ({leads.length} total)
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {statusFilters.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors whitespace-nowrap ${
                statusFilter === value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onUpdateStatus={updateLeadStatus}
            onDelete={deleteLead}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">Nenhum lead encontrado</p>
        </div>
      )}
    </div>
  );
}
