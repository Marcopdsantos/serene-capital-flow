import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AnexarComprovanteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  acertoId: string;
  clienteNome: string;
  onConfirm: (file: File) => void;
}

export const AnexarComprovanteModal = ({ 
  open, 
  onOpenChange, 
  acertoId, 
  clienteNome,
  onConfirm 
}: AnexarComprovanteModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleConfirm = () => {
    if (!selectedFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um comprovante para anexar.",
        variant: "destructive",
      });
      return;
    }

    onConfirm(selectedFile);
    setSelectedFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Anexar Comprovante de Pagamento
          </DialogTitle>
          <DialogDescription>
            Vincule o comprovante ao acerto manual de <strong>{clienteNome}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="comprovante">Arquivo do Comprovante *</Label>
            <Input
              id="comprovante"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Formatos aceitos: PDF, JPG, PNG (máx. 5MB)
            </p>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <FileCheck className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedFile(null);
              onOpenChange(false);
            }}
          >
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedFile}>
            <Upload className="h-4 w-4 mr-2" />
            Anexar Comprovante
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
