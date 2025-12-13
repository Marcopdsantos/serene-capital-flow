import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrendingUp, Clock, CalendarClock } from "lucide-react";

interface KpiItem {
  acordoId: string;
  descricao: string;
  valor: number;
}

interface KpiDetalheModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipo: "total_investido" | "aguardando_destinacao" | "proximo_vencimento";
  titulo: string;
  subtitulo?: string;
  valor: number;
  itens: KpiItem[];
  onItemClick?: (acordoId: string) => void;
}

const tipoConfig = {
  total_investido: {
    icon: TrendingUp,
    iconClass: "text-primary",
    borderClass: "border-l-primary",
  },
  aguardando_destinacao: {
    icon: Clock,
    iconClass: "text-blue-600",
    borderClass: "border-l-blue-500",
  },
  proximo_vencimento: {
    icon: CalendarClock,
    iconClass: "text-slate-600",
    borderClass: "border-l-slate-400",
  },
};

export const KpiDetalheModal = ({
  open,
  onOpenChange,
  tipo,
  titulo,
  subtitulo,
  valor,
  itens,
  onItemClick,
}: KpiDetalheModalProps) => {
  const config = tipoConfig[tipo];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
            <Icon className={`h-5 w-5 ${config.iconClass}`} strokeWidth={1.5} />
            {titulo}
          </DialogTitle>
          {subtitulo && (
            <p className="text-sm text-muted-foreground mt-1">{subtitulo}</p>
          )}
        </DialogHeader>

        {/* Valor Total */}
        <div className={`p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-l-4 ${config.borderClass}`}>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Valor Total
          </p>
          <p className="text-2xl font-mono font-bold text-slate-900 dark:text-slate-100">
            R$ {valor.toLocaleString("pt-BR")}
          </p>
        </div>

        {/* Lista de Itens */}
        <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Composição ({itens.length} {itens.length === 1 ? "item" : "itens"})
          </p>
          {itens.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 ${
                onItemClick ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors" : ""
              }`}
              onClick={() => onItemClick?.(item.acordoId)}
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-primary text-sm">
                  {item.acordoId}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.descricao}
                </p>
              </div>
              <p className="font-mono font-medium text-slate-900 dark:text-slate-100 ml-4">
                R$ {item.valor.toLocaleString("pt-BR")}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
