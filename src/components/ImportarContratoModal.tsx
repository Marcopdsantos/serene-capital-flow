import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileCheck, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ImportarContratoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  acordo: {
    id: string;
    numeroAcordo: string;
    cliente: string;
  } | null;
  onConfirm: (data: {
    file: File;
    tipoContrato: string;
    observacoes: string;
  }) => void;
}

export const ImportarContratoModal = ({ 
  open, 
  onOpenChange, 
  acordo,
  onConfirm 
}: ImportarContratoModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tipoContrato, setTipoContrato] = useState<string>("padrao");
  const [observacoes, setObservacoes] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo PDF.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleConfirm = () => {
    if (!selectedFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um contrato PDF para importar.",
        variant: "destructive",
      });
      return;
    }

    onConfirm({
      file: selectedFile,
      tipoContrato,
      observacoes,
    });
    
    // Reset form
    setSelectedFile(null);
    setTipoContrato("padrao");
    setObservacoes("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setTipoContrato("padrao");
    setObservacoes("");
    onOpenChange(false);
  };

  if (!acordo) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Importar Contrato PDF
          </DialogTitle>
          <DialogDescription>
            Anexe o contrato ao acordo <strong>{acordo.numeroAcordo}</strong> de <strong>{acordo.cliente}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Upload de arquivo */}
          <div className="space-y-2">
            <Label htmlFor="contrato">Arquivo do Contrato *</Label>
            <Input
              id="contrato"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Formato aceito: PDF (máx. 10MB)
            </p>
          </div>

          {/* Preview do arquivo */}
          {selectedFile && (
            <div className="flex items-center gap-3 p-3 bg-muted rounded-md border border-border">
              <FileCheck className="h-5 w-5 text-success" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
          )}

          {/* Tipo de contrato */}
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Contrato</Label>
            <Select value={tipoContrato} onValueChange={setTipoContrato}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="padrao">Padrão</SelectItem>
                <SelectItem value="personalizado">Personalizado</SelectItem>
                <SelectItem value="retroativo">Retroativo (Regularização)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Retroativo: contrato anexado após a assinatura original
            </p>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Textarea
              id="observacoes"
              placeholder="Adicione informações relevantes sobre este contrato..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedFile}>
            <Upload className="h-4 w-4 mr-2" />
            Importar Contrato
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
