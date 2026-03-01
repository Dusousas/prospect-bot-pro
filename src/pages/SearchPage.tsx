import { SearchForm } from "@/components/SearchForm";
import { LeadCard } from "@/components/LeadCard";
import { useLeads } from "@/hooks/useLeads";
import { toast } from "sonner";

export default function SearchPage() {
  const { leads, isSearching, searchPlaces, updateLeadStatus, deleteLead } = useLeads();
  const newLeads = leads.filter((l) => l.status === "new");

  const handleSearch = async (category: string, city: string) => {
    const results = await searchPlaces(category, city);
    toast.success(`${results.length} empresa(s) encontrada(s)!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Prospectar</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Encontre novas empresas para prospectar
        </p>
      </div>

      <SearchForm onSearch={handleSearch} isSearching={isSearching} />

      {newLeads.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3">Resultados ({newLeads.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {newLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onUpdateStatus={updateLeadStatus}
                onDelete={deleteLead}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
