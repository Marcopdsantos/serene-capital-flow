import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface EditarAcordoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  acordo: {
    id: string;
    comprador: string;
    aporte: string;
    totalReceber: string;
    detalhePagamento: string;
    notas?: string;
    mesReferencia: string;
  } | null;
}

export const EditarAcordoModal = ({ open, onOpenChange, acordo }: EditarAcordoModalProps) => {
  const [aporte, setAporte] = useState("");
  const [totalReceber, setTotalReceber] = useState("");
  const [detalhePagamento, setDetalhePagamento] = useState("");
  const [notas, setNotas] = useState("");

  // Atualiza os campos quando o acordo muda
  useEffect(() => {
    if (acordo) {
      setAporte(acordo.aporte);
      setTotalReceber(acordo.totalReceber);
      setDetalhePagamento(acordo.detalhePagamento);
      setNotas(acordo.notas || "");
    }
  }, [acordo]);

  const handleSalvar = () => {
    toast({
      title: "✓ Acordo atualizado",
      description: `As alterações em ${acordo?.comprador} foram salvas com sucesso`,
    });
    console.log("Acordo atualizado:", {
      id: acordo?.id,
      aporte,
      totalReceber,
      detalhePagamento,
      notas,
    });
    onOpenChange(false);
  };

  if (!acordo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-sans font-bold">
            Editar Acordo - {acordo.comprador}
          </DialogTitle>
          <DialogDescription>
            Ajuste os valores e informações do acordo #{acordo.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="aporte">Valor de Aporte</Label>
              <Input
                id="aporte"
                value={aporte}
                onChange={(e) => setAporte(e.target.value)}
                placeholder="R$ 50.000"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="totalReceber">Total a Receber</Label>
              <Input
                id="totalReceber"
                value={totalReceber}
                onChange={(e) => setTotalReceber(e.target.value)}
                placeholder="R$ 65.000"
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="detalhePagamento">Detalhes do Pagamento</Label>
            <Input
              id="detalhePagamento"
              value={detalhePagamento}
              onChange={(e) => setDetalhePagamento(e.target.value)}
              placeholder="R$ 50k PIX"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="notas">Notas / Observações</Label>
            <Textarea
              id="notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Adicione observações sobre este acordo..."
              className="mt-2 min-h-[100px]"
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-muted-foreground">
              <strong>Mês de Referência:</strong> {acordo.mesReferencia}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSalvar}>
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
