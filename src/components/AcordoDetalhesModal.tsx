import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  RefreshCw, 
  User, 
  Calendar,
  DollarSign,
  TrendingUp,
  FileCheck,
  AlertCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ImportarContratoModal } from "./ImportarContratoModal";

interface Parcela {
  numero: number;
  dataVencimento: string;
  valor: number;
  status: "paga" | "pendente";
}

interface ContratoAnexado {
  id: string;
  nomeArquivo: string;
  tipo: "gerado" | "importado";
  tipoContrato: "padrao" | "personalizado" | "retroativo";
  dataUpload: string;
  tamanho: string;
  observacoes?: string;
}

interface AcordoDetalhesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  acordo: {
    id: string;
    numeroAcordo: string;
    cliente: string;
    valorTotal: number;
  } | null;
}

const mockParcelas: Parcela[] = [
  { numero: 1, dataVencimento: "28/10/2024", valor: 5000, status: "paga" },
  { numero: 2, dataVencimento: "28/11/2024", valor: 5000, status: "paga" },
  { numero: 3, dataVencimento: "28/12/2024", valor: 5000, status: "paga" },
  { numero: 4, dataVencimento: "28/01/2025", valor: 5000, status: "pendente" },
  { numero: 5, dataVencimento: "28/02/2025", valor: 5000, status: "pendente" },
  { numero: 6, dataVencimento: "28/03/2025", valor: 5000, status: "pendente" },
  { numero: 7, dataVencimento: "28/04/2025", valor: 5000, status: "pendente" },
  { numero: 8, dataVencimento: "28/05/2025", valor: 5000, status: "pendente" },
  { numero: 9, dataVencimento: "28/06/2025", valor: 5000, status: "pendente" },
  { numero: 10, dataVencimento: "28/07/2025", valor: 5000, status: "pendente" },
];

const tipoContratoLabels: Record<string, string> = {
  padrao: "Padrão",
  personalizado: "Personalizado",
  retroativo: "Retroativo",
};

export const AcordoDetalhesModal = ({ open, onOpenChange, acordo }: AcordoDetalhesModalProps) => {
  const [contratos, setContratos] = useState<ContratoAnexado[]>([]);
  const [importarModalOpen, setImportarModalOpen] = useState(false);
  const [contratoParaSubstituir, setContratoParaSubstituir] = useState<string | null>(null);

  if (!acordo) return null;

  const parcelasPagas = mockParcelas.filter(p => p.status === "paga").length;
  const totalParcelas = mockParcelas.length;
  const valorPago = mockParcelas.filter(p => p.status === "paga").reduce((sum, p) => sum + p.valor, 0);
  const valorPendente = mockParcelas.filter(p => p.status === "pendente").reduce((sum, p) => sum + p.valor, 0);

  const handleImportarContrato = (data: { file: File; tipoContrato: string; observacoes: string }) => {
    const novoContrato: ContratoAnexado = {
      id: Date.now().toString(),
      nomeArquivo: data.file.name,
      tipo: "importado",
      tipoContrato: data.tipoContrato as "padrao" | "personalizado" | "retroativo",
      dataUpload: new Date().toLocaleDateString("pt-BR"),
      tamanho: `${(data.file.size / 1024).toFixed(0)} KB`,
      observacoes: data.observacoes,
    };

    if (contratoParaSubstituir) {
      setContratos(prev => prev.map(c => c.id === contratoParaSubstituir ? novoContrato : c));
      setContratoParaSubstituir(null);
      toast({
        title: "Contrato substituído",
        description: `O contrato foi substituído por "${data.file.name}".`,
      });
    } else {
      setContratos(prev => [...prev, novoContrato]);
      toast({
        title: "Contrato importado",
        description: `"${data.file.name}" foi anexado ao acordo ${acordo.numeroAcordo}.`,
      });
    }
  };

  const handleVisualizarContrato = (contrato: ContratoAnexado) => {
    toast({
      title: "Visualizar contrato",
      description: `Abrindo "${contrato.nomeArquivo}"...`,
    });
    // Em produção, abriria o PDF em nova aba
  };

  const handleRemoverContrato = (contratoId: string) => {
    setContratos(prev => prev.filter(c => c.id !== contratoId));
    toast({
      title: "Contrato removido",
      description: "O contrato foi removido do acordo.",
    });
  };

  const handleSubstituirContrato = (contratoId: string) => {
    setContratoParaSubstituir(contratoId);
    setImportarModalOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              {acordo.cliente} — {acordo.numeroAcordo}
            </DialogTitle>
            <DialogDescription>
              Valor Total: R$ {acordo.valorTotal.toLocaleString("pt-BR")}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="detalhes" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
              <TabsTrigger value="parcelas">
                Parcelas ({totalParcelas})
              </TabsTrigger>
              <TabsTrigger value="contratos" className="relative">
                Contratos
                {contratos.length > 0 && (
                  <Badge variant="default" className="ml-1.5 h-5 min-w-5 px-1 text-xs">
                    {contratos.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="cliente">Cliente</TabsTrigger>
              <TabsTrigger value="arquivos">Arquivos</TabsTrigger>
            </TabsList>

            {/* Aba Detalhes */}
            <TabsContent value="detalhes" className="flex-1 overflow-y-auto mt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                      <DollarSign className="h-4 w-4" />
                      Valor Aporte
                    </div>
                    <p className="text-xl font-bold">
                      R$ {acordo.valorTotal.toLocaleString("pt-BR")}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                      <TrendingUp className="h-4 w-4" />
                      Total a Receber
                    </div>
                    <p className="text-xl font-bold text-success">
                      R$ {(acordo.valorTotal * 1.2).toLocaleString("pt-BR")}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                      <Calendar className="h-4 w-4" />
                      Parcelas
                    </div>
                    <p className="text-xl font-bold">
                      {parcelasPagas}/{totalParcelas}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                      <FileCheck className="h-4 w-4" />
                      Progresso
                    </div>
                    <p className="text-xl font-bold">
                      {Math.round((parcelasPagas / totalParcelas) * 100)}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-1">Valor já pago</p>
                    <p className="text-lg font-semibold text-success">
                      R$ {valorPago.toLocaleString("pt-BR")}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-1">Valor pendente</p>
                    <p className="text-lg font-semibold text-warning">
                      R$ {valorPendente.toLocaleString("pt-BR")}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Nota:</strong> As parcelas são creditadas automaticamente na Conta Corrente do cliente no dia do vencimento, às 05h00.
                </p>
              </div>
            </TabsContent>

            {/* Aba Parcelas */}
            <TabsContent value="parcelas" className="flex-1 overflow-y-auto mt-4">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-24">Parcela Nº</TableHead>
                      <TableHead>Data de Vencimento</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockParcelas.map((parcela) => (
                      <TableRow key={parcela.numero}>
                        <TableCell className="font-medium">
                          {parcela.numero}/{totalParcelas}
                        </TableCell>
                        <TableCell>{parcela.dataVencimento}</TableCell>
                        <TableCell className="text-right font-semibold">
                          R$ {parcela.valor.toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={parcela.status === "paga" ? "default" : "neutral"}
                            className={parcela.status === "paga" ? "bg-success text-success-foreground" : ""}
                          >
                            {parcela.status === "paga" ? "✓ Paga" : "Pendente"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Aba Contratos */}
            <TabsContent value="contratos" className="flex-1 overflow-y-auto mt-4 space-y-4">
              {contratos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum contrato anexado</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                    Este acordo ainda não possui um contrato vinculado. Você pode gerar um novo contrato ou importar um PDF existente.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Gerar Contrato
                    </Button>
                    <Button onClick={() => setImportarModalOpen(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Importar Contrato PDF
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {contratos.map((contrato) => (
                      <Card key={contrato.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium truncate">{contrato.nomeArquivo}</p>
                                <Badge variant="neutral" className="text-xs">
                                  {contrato.tipo === "importado" ? "Importado" : "Gerado"}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {tipoContratoLabels[contrato.tipoContrato]}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Anexado em {contrato.dataUpload} • {contrato.tamanho}
                              </p>
                              {contrato.observacoes && (
                                <p className="text-sm text-muted-foreground mt-1 italic">
                                  "{contrato.observacoes}"
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVisualizarContrato(contrato)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSubstituirContrato(contrato.id)}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleRemoverContrato(contrato.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Gerar Novo Contrato
                    </Button>
                    <Button variant="outline" onClick={() => setImportarModalOpen(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Importar Outro Contrato
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Aba Cliente */}
            <TabsContent value="cliente" className="flex-1 overflow-y-auto mt-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{acordo.cliente}</h3>
                      <p className="text-sm text-muted-foreground">Cliente ativo</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">CPF/CNPJ</p>
                      <p className="font-medium">123.456.789-00</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">E-mail</p>
                      <p className="font-medium">cliente@email.com</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-medium">(11) 99999-9999</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Acordos ativos</p>
                      <p className="font-medium">3 acordos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Arquivos */}
            <TabsContent value="arquivos" className="flex-1 overflow-y-auto mt-4">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Download className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">Outros arquivos</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                  Aqui você pode anexar documentos adicionais relacionados a este acordo (comprovantes, aditivos, etc).
                </p>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Anexar Arquivo
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <ImportarContratoModal
        open={importarModalOpen}
        onOpenChange={(open) => {
          setImportarModalOpen(open);
          if (!open) setContratoParaSubstituir(null);
        }}
        acordo={acordo ? {
          id: acordo.id,
          numeroAcordo: acordo.numeroAcordo,
          cliente: acordo.cliente,
        } : null}
        onConfirm={handleImportarContrato}
      />
    </>
  );
};
