import { Lead, LeadStatus } from "@/types/lead";
import { Star, Phone, MapPin, MoreHorizontal, Globe, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, whatsappLink } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: "Novo", className: "bg-primary/15 text-primary border-primary/20" },
  contacted: { label: "Contatado", className: "bg-warning/15 text-warning border-warning/20" },
  converted: { label: "Convertido", className: "bg-success/15 text-success border-success/20" },
  lost: { label: "Perdido", className: "bg-destructive/15 text-destructive border-destructive/20" },
};

interface LeadCardProps {
  lead: Lead;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onDelete: (id: string) => void;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export function LeadCard({ lead, onUpdateStatus, onDelete, selected, onToggleSelect }: LeadCardProps) {
  const status = statusConfig[lead.status];

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-card hover:shadow-elevated transition-shadow duration-300 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="pt-1">
            <Checkbox
              checked={Boolean((selected))}
              onCheckedChange={() => onToggleSelect?.(lead.id)}
              className="mt-1"
            />
          </div>
          <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm truncate">{lead.name}</h3>
            <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 shrink-0", status.className)}>
              {status.label}
            </Badge>
          </div>

          <div className="space-y-1 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{lead.address}</span>
            </div>

            {lead.phone && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Phone className="h-3 w-3 shrink-0" />
                <span>{lead.phone}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0"
                  onClick={() => window.open(whatsappLink(lead.phone), "_blank")}
                >
                  <MessageCircle className="h-3 w-3 text-green-500" />
                </Button>
              </div>
            )}

            {/* website info */}
            <div className="flex items-center gap-1.5 text-xs">
              <Globe className="h-3 w-3 shrink-0" />
              {lead.website ? (
                <a
                  href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate underline"
                >
                  {lead.website}
                </a>
              ) : (
                <span className="text-muted-foreground">Sem site</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Star className="h-3 w-3 text-warning fill-warning" />
              <span className="font-medium">{lead.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({lead.totalRatings} avaliações)</span>
            </div>
          </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onUpdateStatus(lead.id, "contacted")}>
              Marcar como Contatado
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus(lead.id, "converted")}>
              Marcar como Convertido
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus(lead.id, "lost")}>
              Marcar como Perdido
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(lead.id)}>
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
          </DropdownMenu>
          {lead.phone && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => window.open(whatsappLink(lead.phone), "_blank")}
            >
              <MessageCircle className="h-4 w-4 text-green-500" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
