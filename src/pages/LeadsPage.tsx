import { useState } from "react";
import { LeadCard } from "@/components/LeadCard";
import { useLeads } from "@/hooks/useLeads";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { LeadStatus } from "@/types/lead";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { whatsappLink } from "@/lib/utils";

const statusFilters: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "new", label: "Novos" },
  { value: "contacted", label: "Contatados" },
  { value: "converted", label: "Convertidos" },
  { value: "lost", label: "Perdidos" },
];

export default function LeadsPage() {
  const { leads, updateLeadStatus, deleteLead } = useLeads();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [noSiteFilter, setNoSiteFilter] = useState(false);
  const [message, setMessage] = useState("");
  const [onlyWithWhatsapp, setOnlyWithWhatsapp] = useState(true);

  const filtered = leads.filter((lead) => {
    const matchSearch = lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchNoSite = !noSiteFilter || !lead.website;
    return matchSearch && matchStatus && matchNoSite;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const sendMessageToSelected = () => {
    if (!message.trim()) {
      toast.error("Digite uma mensagem antes de enviar");
      return;
    }

    const recipients = leads.filter((l) => selectedIds.includes(l.id)).filter((l) => {
      if (!l.phone) return false;
      if (onlyWithWhatsapp) return Boolean(l.phone);
      return Boolean(l.phone);
    });

    if (recipients.length === 0) {
      toast.error("Nenhum lead selecionado com telefone/WhatsApp");
      return;
    }

    recipients.forEach((r, i) => {
      setTimeout(() => {
        window.open(whatsappLink(r.phone, message), "_blank");
      }, i * 300);
    });

    toast.success(`Enviando mensagem para ${recipients.length} lead(s)`);
    setSelectedIds([]);
    setMessage("");
  };

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
          <button
            onClick={() => setNoSiteFilter((s) => !s)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors whitespace-nowrap ${
              noSiteFilter
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            Sem Site
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground">Mensagem</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escreva a mensagem que será enviada por WhatsApp..."
                className="w-full mt-2 min-h-[80px] rounded-md border border-border p-2 text-sm bg-input resize-none"
              />
              <div className="text-xs text-muted-foreground mt-1">A mensagem será enviada para os leads selecionados.</div>
            </div>
            <div className="w-full sm:w-64 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox checked={onlyWithWhatsapp} onCheckedChange={() => setOnlyWithWhatsapp((s) => !s)} />
                  <span className="text-sm">Apenas com WPP</span>
                </div>
                <div className="text-sm text-muted-foreground">Selecionados: {selectedIds.length}</div>
              </div>
              <Button onClick={sendMessageToSelected} className="w-full">Enviar mensagem</Button>
              <Button variant="ghost" onClick={() => setSelectedIds([])} className="w-full">Limpar seleção</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onUpdateStatus={updateLeadStatus}
              onDelete={deleteLead}
              selected={selectedIds.includes(lead.id)}
              onToggleSelect={toggleSelect}
            />
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">Nenhum lead encontrado</p>
        </div>
      )}
    </div>
  );
}
