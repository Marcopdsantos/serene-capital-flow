import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PenTool, User } from "lucide-react";

interface DefinirSignatarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nomeBeneficiario: string;
  onConfirmar: (signatarioId: string | null) => void;
}

// Mock de clientes para seleção
const clientesMock = [
  { id: "1", nome: "Maria Silva" },
  { id: "2", nome: "João Santos" },
  { id: "3", nome: "Pedro Oliveira" },
  { id: "4", nome: "Ana Costa" },
];

export const DefinirSignatarioModal = ({
  open,
  onOpenChange,
  nomeBeneficiario,
  onConfirmar,
}: DefinirSignatarioModalProps) => {
  const [signatarioTipo, setSignatarioTipo] = useState<"beneficiario" | "outro">("beneficiario");
  const [signatarioSelecionado, setSignatarioSelecionado] = useState<string>("");

  const handleConfirmar = () => {
    if (signatarioTipo === "beneficiario") {
      onConfirmar(null); // null significa que o beneficiário é o signatário
    } else {
      if (!signatarioSelecionado) {
        return; // Não confirmar se não houver signatário selecionado
      }
      onConfirmar(signatarioSelecionado);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <PenTool className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">Quem assinará o contrato?</DialogTitle>
            </div>
          </div>
          <DialogDescription>
            O beneficiário (proprietário financeiro) é <span className="font-semibold">{nomeBeneficiario}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <RadioGroup
            value={signatarioTipo}
            onValueChange={(value) => setSignatarioTipo(value as "beneficiario" | "outro")}
            className="space-y-4"
          >
            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="beneficiario" id="beneficiario" className="mt-1" />
              <Label htmlFor="beneficiario" className="cursor-pointer flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">O próprio beneficiário</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {nomeBeneficiario} assinará e será o titular legal
                </p>
              </Label>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="outro" id="outro" className="mt-1" />
              <Label htmlFor="outro" className="cursor-pointer flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <PenTool className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Outra pessoa</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Selecione um signatário diferente do beneficiário
                </p>
              </Label>
            </div>
          </RadioGroup>

          {signatarioTipo === "outro" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-muted/50 p-4 rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground mb-3">
                  Busque um cliente existente ou cadastre um novo signatário
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="signatario-select">Selecione o Signatário</Label>
                  <Select value={signatarioSelecionado} onValueChange={setSignatarioSelecionado}>
                    <SelectTrigger id="signatario-select" className="bg-background">
                      <SelectValue placeholder="Buscar cliente..." />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      {clientesMock.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="button"
                  variant="link"
                  className="mt-3 h-auto p-0 text-primary"
                  onClick={() => {
                    // TODO: Implementar modal de cadastro de novo cliente
                    console.log("Cadastrar novo signatário");
                  }}
                >
                  + Cadastrar novo signatário
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmar}
            disabled={signatarioTipo === "outro" && !signatarioSelecionado}
          >
            Confirmar e Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
