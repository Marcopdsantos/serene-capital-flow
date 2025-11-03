import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Check, Clock, AlertCircle, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Comprovante {
  id: string;
  arquivo: string;
  data: string;
  usuario: string;
  status: "aprovado" | "pendente";
}

interface ComprovanteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  acordo: {
    id: string;
    cliente: string;
    valor: string;
    aquisicao?: string;
  };
}

export const ComprovanteModal = ({ open, onOpenChange, acordo }: ComprovanteModalProps) => {
  const [comprovantes, setComprovantes] = useState<Comprovante[]>([
    {
      id: "1",
      arquivo: "comprovante_pix_001.pdf",
      data: "2024-03-15 10:32",
      usuario: "João Silva",
      status: "pendente"
    }
  ]);

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        const novoComprovante: Comprovante = {
          id: Math.random().toString(),
          arquivo: file.name,
          data: new Date().toLocaleString('pt-BR'),
          usuario: "Antônio (Gestor)",
          status: "pendente"
        };
        
        setComprovantes(prev => [novoComprovante, ...prev]);
        
        toast({
          title: "✓ Comprovante anexado",
          description: "Comprovante recebido — aguardando conciliação.",
          className: "animate-fade-in"
        });
      }
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const aprovarComprovante = (id: string) => {
    const comprovante = comprovantes.find(c => c.id === id);
    if (!comprovante) return;

    // Simular validação de valor
    const valorAcordo = parseFloat(acordo.valor.replace(/[^\d,]/g, "").replace(",", "."));
    const valorComprovante = 149500; // Simular valor do comprovante
    const diferenca = ((valorComprovante - valorAcordo) / valorAcordo) * 100;

    if (Math.abs(diferenca) > 1) {
      const confirmar = window.confirm(
        `Acordo ${acordo.id} — Valor esperado: ${acordo.valor} — Comprovante anexo: R$ 149.500,00 (diferença de ${diferenca.toFixed(2)}%). Confirmar conciliação parcial?`
      );
      if (!confirmar) return;
    }

    setComprovantes(prev =>
      prev.map(c => c.id === id ? { ...c, status: "aprovado" as const } : c)
    );
    
    toast({
      title: "✓ Comprovante conciliado",
      description: "Pagamento confirmado — valores atualizados no fluxo.",
      className: "animate-fade-in"
    });
  };

  const removerComprovante = (id: string) => {
    setComprovantes(prev => prev.filter(c => c.id !== id));
    
    toast({
      title: "Comprovante removido",
      description: "O arquivo foi excluído do histórico.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Comprovantes — {acordo.cliente}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Envie o comprovante recebido do cliente. O sistema registra automaticamente no histórico e vincula ao acordo.
            {acordo.aquisicao && (
              <span className="block mt-1 text-xs">
                Aquisição: <span className="font-medium">{acordo.aquisicao}</span> • Valor esperado: <span className="font-medium">{acordo.valor}</span>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? "border-accent bg-accent/10" : "border-border hover:border-accent/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm font-medium mb-2">Arraste arquivos para cá ou</p>
          <label>
            <input
              type="file"
              accept=".pdf,image/*"
              multiple
              className="hidden"
              onChange={handleFileInput}
            />
            <Button variant="outline" className="cursor-pointer" type="button" onClick={() => document.querySelector('input[type="file"]')?.dispatchEvent(new MouseEvent('click'))}>
              Selecionar Arquivos
            </Button>
          </label>
          <p className="text-xs text-muted-foreground mt-3">PDFs ou imagens • Máx 10MB por arquivo</p>
        </div>

        {/* Lista de Comprovantes */}
        <div className="mt-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Histórico de Anexos
          </h3>
          
          {comprovantes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum comprovante anexado ainda
            </p>
          ) : (
            <div className="space-y-3">
              {comprovantes.map((comp) => (
                <div
                  key={comp.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      comp.status === "aprovado" ? "bg-success/20 text-success-foreground" : "bg-pending/20 text-pending-foreground"
                    }`}>
                      {comp.status === "aprovado" ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Clock className="h-5 w-5" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{comp.arquivo}</p>
                      <p className="text-xs text-muted-foreground">
                        {comp.status === "aprovado" ? "Conciliado" : "Anexado"} por {comp.usuario} • {comp.data}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {comp.status === "pendente" && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => aprovarComprovante(comp.id)}
                      >
                        Conciliar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removerComprovante(comp.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Timeline de Conciliação */}
        {comprovantes.some(c => c.status === "aprovado") && (
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="font-semibold mb-4 text-sm">Histórico de Conciliação</h3>
            <div className="space-y-3">
              {comprovantes
                .filter(c => c.status === "aprovado")
                .map((comp) => (
                  <div key={comp.id} className="flex items-start gap-3 text-sm">
                    <div className="h-6 w-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-success-foreground" />
                    </div>
                    <div>
                      <p className="text-foreground">
                        <span className="font-medium">Conciliado</span> por Antônio (Gestor)
                      </p>
                      <p className="text-xs text-muted-foreground">{comp.data}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
