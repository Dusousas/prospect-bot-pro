import { useState } from "react";
import { Search, Loader2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchFormProps {
  onSearch: (category: string, city: string) => Promise<any>;
  isSearching: boolean;
}

const suggestions = [
  "Restaurante", "Clínica", "Academia", "Salão de Beleza",
  "Pet Shop", "Dentista", "Advogado", "Contabilidade",
];

export function SearchForm({ onSearch, isSearching }: SearchFormProps) {
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category && city) {
      onSearch(category, city);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-card">
      <h2 className="text-lg font-semibold mb-1">Nova Prospecção</h2>
      <p className="text-sm text-muted-foreground mb-5">
        Busque empresas por categoria e cidade usando o Google Maps
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Categoria</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ex: Restaurante, Dentista..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Cidade</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ex: São Paulo, Curitiba..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Sugestões:</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setCategory(s)}
                className="px-2.5 py-1 text-xs rounded-full border border-border bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={isSearching || !category || !city} className="w-full">
          {isSearching ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Buscando...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Buscar Empresas
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
