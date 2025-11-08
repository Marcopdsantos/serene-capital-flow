import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { User, TrendingUp, FileText, Wallet, AlertCircle, Eye, Phone, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FichaCadastralModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: {
    id?: string;
    nome: string;
    telefone?: string;
    totalInvestido: number;
    totalAcordos: number;
    saldoDisponivel: number;
    observacoesPendencias: string;
  } | null;
}

export const FichaCadastralModal = ({ open, onOpenChange, cliente }: FichaCadastralModalProps) => {
  const navigate = useNavigate();
  
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
          {/* Contato */}
          {cliente.telefone && (
            <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium">Contato</p>
                  <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-sans font-semibold text-green-900 dark:text-green-100">
                    {cliente.telefone}
                  </p>
                  <a 
                    href={`https://wa.me/55${cliente.telefone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs transition-colors"
                  >
                    <MessageCircle className="h-3 w-3" />
                    WhatsApp
                  </a>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">Clique para enviar mensagem</p>
              </CardContent>
            </Card>
          )}
          
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

        <DialogFooter>
          <Button 
            onClick={() => {
              onOpenChange(false);
              navigate(`/dashboard/cadastros/clientes/${cliente.id || '1'}`);
            }}
            className="w-full"
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver Ficha Completa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
