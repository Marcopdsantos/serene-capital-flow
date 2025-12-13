import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, Lock, Banknote, RefreshCw, FileText } from "lucide-react";

export interface ParcelaCliente {
  numero: number;
  dataVencimento: string;
  valor: number;
  status: "pendente" | "reservada" | "liquidada_saque" | "reinvestida";
  acordoDestino?: string;
}

interface AcordoClienteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  acordo: {
    id: string;
    dataInicio: string;
    valorOriginal: number;
    origemRecurso: string;
    status: string;
    parcelas: ParcelaCliente[];
  } | null;
}

const statusConfig = {
  pendente: {
    label: "Pendente",
    icon: Clock,
    className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  reservada: {
    label: "Reservada",
    icon: Lock,
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  liquidada_saque: {
    label: "Liquidada (Saque)",
    icon: Banknote,
    className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  reinvestida: {
    label: "Reinvestida",
    icon: RefreshCw,
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
};

export const AcordoClienteModal = ({
  open,
  onOpenChange,
  acordo,
}: AcordoClienteModalProps) => {
  if (!acordo) return null;

  const parcelasLiquidadas = acordo.parcelas.filter(
    (p) => p.status === "liquidada_saque" || p.status === "reinvestida"
  ).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200">
            Detalhes do Acordo {acordo.id}
          </DialogTitle>
        </DialogHeader>

        {/* Resumo do Acordo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-b border-border">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Data Início
            </p>
            <p className="font-medium text-slate-800 dark:text-slate-200">
              {acordo.dataInicio}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Valor Original
            </p>
            <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">
              R$ {acordo.valorOriginal.toLocaleString("pt-BR")}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Origem
            </p>
            <p className="font-medium text-slate-800 dark:text-slate-200">
              {acordo.origemRecurso}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Progresso
            </p>
            <p className="font-medium text-slate-800 dark:text-slate-200">
              {parcelasLiquidadas}/{acordo.parcelas.length} pagas
            </p>
          </div>
        </div>

        {/* Cronograma de Parcelas */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Cronograma de Parcelas
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">
                    Nº
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">
                    Vencimento
                  </th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase">
                    Valor
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">
                    Status
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">
                    Destino
                  </th>
                </tr>
              </thead>
              <tbody>
                {acordo.parcelas.map((parcela) => {
                  const config = statusConfig[parcela.status];
                  const Icon = config.icon;
                  return (
                    <tr
                      key={parcela.numero}
                      className="border-b border-border/50 hover:bg-muted/30"
                    >
                      <td className="py-3 px-3 font-medium">
                        {parcela.numero}/10
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {parcela.dataVencimento}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-medium">
                        R$ {parcela.valor.toLocaleString("pt-BR")}
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant="secondary"
                          className={`${config.className} gap-1`}
                        >
                          <Icon className="h-3 w-3" strokeWidth={1.5} />
                          {config.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        {parcela.status === "reinvestida" &&
                          parcela.acordoDestino && (
                            <span className="text-primary font-medium cursor-pointer hover:underline">
                              → {parcela.acordoDestino}
                            </span>
                          )}
                        {parcela.status === "liquidada_saque" && (
                          <span className="text-muted-foreground text-xs">
                            Enviado ao cliente
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Botão de Contrato */}
        <div className="mt-6 pt-4 border-t border-border flex justify-end">
          <button className="flex items-center gap-2 text-sm text-primary hover:underline">
            <FileText className="h-4 w-4" strokeWidth={1.5} />
            Baixar Contrato (PDF)
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
