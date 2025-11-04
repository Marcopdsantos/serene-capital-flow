import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, TrendingUp, FileText, Wallet, AlertCircle } from "lucide-react";

interface FichaCadastralModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: {
    nome: string;
    totalInvestido: number;
    totalAcordos: number;
    saldoDisponivel: number;
    observacoesPendencias: string;
  } | null;
}

export const FichaCadastralModal = ({ open, onOpenChange, cliente }: FichaCadastralModalProps) => {
  if (!cliente) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-sans">{cliente.nome}</DialogTitle>
              <DialogDescription>Ficha Cadastral — Dados Consolidados</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="space-y-4">
          {/* Grid de Métricas */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Total Investido */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Total Investido (Ativo)</p>
                  <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-2xl font-sans font-semibold text-blue-900 dark:text-blue-100">
                  R$ {cliente.totalInvestido.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Soma de acordos ativos</p>
              </CardContent>
            </Card>

            {/* Total de Acordos */}
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-950/20 dark:to-slate-900/10 border-slate-200 dark:border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Total de Acordos</p>
                  <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
                <p className="text-2xl font-sans font-semibold text-slate-900 dark:text-slate-100">
                  {cliente.totalAcordos}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Acordos com status ativo</p>
              </CardContent>
            </Card>

            {/* Saldo em Conta */}
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-950/20 dark:to-slate-900/10 border-slate-200 dark:border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Saldo Disponível</p>
                  <Wallet className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
                <p className="text-2xl font-sans font-semibold text-slate-900 dark:text-slate-100">
                  R$ {cliente.saldoDisponivel.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Saldo interno disponível</p>
              </CardContent>
            </Card>

            {/* Observações/Pendências */}
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-950/20 dark:to-slate-900/10 border-slate-200 dark:border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Status de Pagamento</p>
                  <AlertCircle className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {cliente.observacoesPendencias || "Nenhuma pendência registrada"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
