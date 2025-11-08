import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { FolderOpen, Upload, Download, File, Search, Grid3x3, List, FileText, Image as ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Arquivo {
  id: string;
  nomeArquivo: string;
  clienteVinculado: string;
  tipoVinculo: string;
  dataUpload: Date;
  status: "vinculado" | "orfao";
  tamanho: string;
  tipo: "pdf" | "imagem" | "documento";
}

// Mock de arquivos
const arquivosMock: Arquivo[] = [
  {
    id: "1",
    nomeArquivo: "comprovante_pix_001.pdf",
    clienteVinculado: "João Silva",
    tipoVinculo: "acordo",
    dataUpload: new Date(2024, 9, 15, 14, 30),
    status: "vinculado",
    tamanho: "245 KB",
    tipo: "pdf",
  },
  {
    id: "2",
    nomeArquivo: "contrato_assinado.pdf",
    clienteVinculado: "João Silva",
    tipoVinculo: "acordo",
    dataUpload: new Date(2024, 9, 5, 10, 15),
    status: "vinculado",
    tamanho: "1.2 MB",
    tipo: "pdf",
  },
  {
    id: "3",
    nomeArquivo: "extrato_bancario.pdf",
    clienteVinculado: "João Silva",
    tipoVinculo: "outro",
    dataUpload: new Date(2024, 10, 2, 9, 45),
    status: "vinculado",
    tamanho: "892 KB",
    tipo: "pdf",
  },
  {
    id: "4",
    nomeArquivo: "comprovante_saque_maria.pdf",
    clienteVinculado: "Maria Silva",
    tipoVinculo: "acerto_manual",
    dataUpload: new Date(2024, 10, 10, 16, 20),
    status: "vinculado",
    tamanho: "156 KB",
    tipo: "pdf",
  },
  {
    id: "5",
    nomeArquivo: "documento_pendente.pdf",
    clienteVinculado: "",
    tipoVinculo: "",
    dataUpload: new Date(2024, 10, 12, 11, 0),
    status: "orfao",
    tamanho: "320 KB",
    tipo: "pdf",
  },
];

// Mock de clientes para seleção
const clientesMock = [
  { id: "1", nome: "João Silva" },
  { id: "2", nome: "Maria Silva" },
  { id: "3", nome: "Pedro Oliveira" },
  { id: "4", nome: "Ana Costa" },
];

export default function CentralArquivos() {
  const [visualizacao, setVisualizacao] = useState<"pastas" | "tabela">("tabela");
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "vinculado" | "orfao">("todos");
  const [busca, setBusca] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
  const [clienteUpload, setClienteUpload] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");

  const arquivosFiltrados = arquivosMock.filter((arquivo) => {
    const matchStatus = filtroStatus === "todos" || arquivo.status === filtroStatus;
    const matchBusca = arquivo.nomeArquivo.toLowerCase().includes(busca.toLowerCase()) ||
                       arquivo.clienteVinculado.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchBusca;
  });

  const handleUpload = () => {
    if (!arquivoSelecionado || !clienteUpload) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione um arquivo e um cliente.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "✓ Arquivo enviado",
      description: `${arquivoSelecionado.name} foi carregado com sucesso.`,
    });

    setUploadModalOpen(false);
    setArquivoSelecionado(null);
    setClienteUpload("");
    setTipoDocumento("");
  };

  const handleDownload = (arquivo: Arquivo) => {
    toast({
      title: "Download iniciado",
      description: `${arquivo.nomeArquivo}`,
    });
  };

  const getIconeTipo = (tipo: string) => {
    switch (tipo) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-600" />;
      case "imagem":
        return <ImageIcon className="h-4 w-4 text-blue-600" />;
      default:
        return <File className="h-4 w-4 text-slate-600" />;
    }
  };

  const contadores = {
    todos: arquivosMock.length,
    vinculado: arquivosMock.filter((a) => a.status === "vinculado").length,
    orfao: arquivosMock.filter((a) => a.status === "orfao").length,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FolderOpen className="h-8 w-8 text-primary" />
            Central de Arquivos
          </h1>
          <p className="text-muted-foreground mt-2">
            Repositório centralizado de documentos e comprovantes
          </p>
        </div>

        <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload de Arquivo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload de Arquivo</DialogTitle>
              <DialogDescription>
                Envie um novo documento e vincule a um cliente
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Selecionar Arquivo</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) => setArquivoSelecionado(e.target.files?.[0] || null)}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    {arquivoSelecionado ? (
                      <p className="text-sm font-medium">{arquivoSelecionado.name}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Clique para selecionar ou arraste aqui
                      </p>
                    )}
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo-doc">Tipo de Documento</Label>
                <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                  <SelectTrigger id="tipo-doc">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="comprovante_aporte">Comprovante de Aporte</SelectItem>
                    <SelectItem value="comprovante_saque">Comprovante de Saque</SelectItem>
                    <SelectItem value="contrato">Contrato</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cliente-upload">Cliente Vinculado *</Label>
                <Select value={clienteUpload} onValueChange={setClienteUpload}>
                  <SelectTrigger id="cliente-upload">
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
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpload}>Upload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Arquivos Armazenados</CardTitle>
              <CardDescription>
                Gerencie todos os documentos da plataforma
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={visualizacao === "pastas" ? "default" : "ghost"}
                size="sm"
                onClick={() => setVisualizacao("pastas")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={visualizacao === "tabela" ? "default" : "ghost"}
                size="sm"
                onClick={() => setVisualizacao("tabela")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome de arquivo ou cliente..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Abas de Status */}
          <Tabs value={filtroStatus} onValueChange={(v) => setFiltroStatus(v as any)}>
            <TabsList>
              <TabsTrigger value="todos">Todos ({contadores.todos})</TabsTrigger>
              <TabsTrigger value="vinculado">Vinculados ({contadores.vinculado})</TabsTrigger>
              <TabsTrigger value="orfao">Órfãos ({contadores.orfao})</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Visualização em Pastas */}
          {visualizacao === "pastas" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">João Silva</h3>
                      <p className="text-sm text-muted-foreground">3 arquivos</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">📁 2024 → Outubro</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Maria Silva</h3>
                      <p className="text-sm text-muted-foreground">1 arquivo</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">📁 2024 → Novembro</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Visualização em Tabela */}
          {visualizacao === "tabela" && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Arquivo</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo de Vínculo</TableHead>
                    <TableHead>Data Upload</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {arquivosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhum arquivo encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    arquivosFiltrados.map((arquivo) => (
                      <TableRow key={arquivo.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getIconeTipo(arquivo.tipo)}
                            <span className="font-medium">{arquivo.nomeArquivo}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {arquivo.clienteVinculado || (
                            <span className="text-muted-foreground italic">Não vinculado</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {arquivo.tipoVinculo ? (
                            <Badge variant="outline">
                              {arquivo.tipoVinculo === "acordo" ? "Acordo" : 
                               arquivo.tipoVinculo === "acerto_manual" ? "Acerto Manual" : "Outro"}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(arquivo.dataUpload, "dd/MM/yyyy HH:mm")}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {arquivo.tamanho}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={arquivo.status === "vinculado" ? "default" : "secondary"}
                            className={
                              arquivo.status === "vinculado"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                : ""
                            }
                          >
                            {arquivo.status === "vinculado" ? "✓ Vinculado" : "Órfão"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(arquivo)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
