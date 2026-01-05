import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Users, Briefcase, TrendingUp, FileText, Upload } from "lucide-react";
import { AcordoDetalhesModal } from "./AcordoDetalhesModal";
import { EditarAcordoModal } from "./EditarAcordoModal";
import { ImportarContratoModal } from "./ImportarContratoModal";
import { toast } from "@/hooks/use-toast";

interface ContratoAnexado {
  id: string;
  nomeArquivo: string;
  tipo: "gerado" | "importado";
  tipoContrato: "padrao" | "personalizado" | "retroativo";
  dataUpload: string;
  tamanho: string;
  observacoes?: string;
}

interface AcordoDetalhado {
  id: string;
  cliente: string;
  acordo: string;
  mesRef: string;
  valorTotal: string;
  origemPagamento: "PIX/Cheque" | "Saldo Interno";
  parcelasRestantes: number;
  valorPago: string;
  proximaParcela: string;
  dataProximaParcela: string;
  status: "Em dia" | "Pendente" | "Atrasado";
  observacoes: string;
  contratos?: ContratoAnexado[];
}

const mockAcordos: AcordoDetalhado[] = [
  {
    id: "1",
    cliente: "Marcos Silva",
    acordo: "#1001",
    mesRef: "Outubro/24",
    valorTotal: "R$ 150.000,00",
    origemPagamento: "PIX/Cheque",
    parcelasRestantes: 8,
    valorPago: "R$ 50.000,00",
    proximaParcela: "R$ 12.500,00",
    dataProximaParcela: "25/11/2024",
    status: "Em dia",
    observacoes: "Pix até dia 25",
    contratos: [
      {
        id: "c1",
        nomeArquivo: "Contrato_1001_Marcos_Silva.pdf",
        tipo: "gerado",
        tipoContrato: "padrao",
        dataUpload: "15/10/2024",
        tamanho: "245 KB",
      }
    ]
  },
  {
    id: "2",
    cliente: "Ana Costa",
    acordo: "#1002",
    mesRef: "Outubro/24",
    valorTotal: "R$ 200.000,00",
    origemPagamento: "Saldo Interno",
    parcelasRestantes: 10,
    valorPago: "R$ 80.000,00",
    proximaParcela: "R$ 12.000,00",
    dataProximaParcela: "30/11/2024",
    status: "Em dia",
    observacoes: "Desconto aplicado",
    contratos: []
  },
  {
    id: "3",
    cliente: "Pedro Santos",
    acordo: "#1003",
    mesRef: "Setembro/24",
    valorTotal: "R$ 95.000,00",
    origemPagamento: "PIX/Cheque",
    parcelasRestantes: 3,
    valorPago: "R$ 75.000,00",
    proximaParcela: "R$ 6.666,67",
    dataProximaParcela: "20/11/2024",
    status: "Pendente",
    observacoes: "Cheque em compensação",
    contratos: []
  }
];

export const AcordosDetalhadosTab = () => {
  const [acordos, setAcordos] = useState<AcordoDetalhado[]>(mockAcordos);
  const [busca, setBusca] = useState("");
  const [filtroMes, setFiltroMes] = useState<string>("todos");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroContrato, setFiltroContrato] = useState<string>("todos");
  const [modalAcordo, setModalAcordo] = useState<{ id: string; numeroAcordo: string; cliente: string; valorTotal: number } | null>(null);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [acordoParaEditar, setAcordoParaEditar] = useState<AcordoDetalhado | null>(null);
  const [importarModalOpen, setImportarModalOpen] = useState(false);
  const [acordoParaImportar, setAcordoParaImportar] = useState<{ id: string; numeroAcordo: string; cliente: string } | null>(null);

  // KPIs de Carteira
  const acordosAtivos = acordos.filter(a => a.status === "Em dia");
  const clientesAtivos = new Set(acordosAtivos.map(a => a.cliente)).size;
  const acordosAtivosTotal = acordosAtivos.length;
  const totalInvestidoAtivo = acordosAtivos.reduce(
    (sum, a) => sum + parseFloat(a.valorTotal.replace(/[^\d,]/g, "").replace(",", ".")), 
    0
  );

  const acordosFiltrados = acordos.filter(acordo => {
    const matchBusca = acordo.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      acordo.acordo.toLowerCase().includes(busca.toLowerCase());
    
    const matchMes = filtroMes === "todos" || acordo.mesRef === filtroMes;
    const matchStatus = filtroStatus === "todos" || acordo.status.toLowerCase() === filtroStatus.toLowerCase();
    
    const temContrato = acordo.contratos && acordo.contratos.length > 0;
    const matchContrato = filtroContrato === "todos" || 
      (filtroContrato === "com" && temContrato) || 
      (filtroContrato === "sem" && !temContrato);
    
    return matchBusca && matchMes && matchStatus && matchContrato;
  });

  const handleImportarContrato = (data: { file: File; tipoContrato: string; observacoes: string }) => {
    if (!acordoParaImportar) return;

    const novoContrato: ContratoAnexado = {
      id: Date.now().toString(),
      nomeArquivo: data.file.name,
      tipo: "importado",
      tipoContrato: data.tipoContrato as "padrao" | "personalizado" | "retroativo",
      dataUpload: new Date().toLocaleDateString("pt-BR"),
      tamanho: `${(data.file.size / 1024).toFixed(0)} KB`,
      observacoes: data.observacoes,
    };

    setAcordos(prev => prev.map(acordo => {
      if (acordo.id === acordoParaImportar.id) {
        return {
          ...acordo,
          contratos: [...(acordo.contratos || []), novoContrato],
        };
      }
      return acordo;
    }));

    toast({
      title: "Contrato importado",
      description: `"${data.file.name}" foi anexado ao acordo ${acordoParaImportar.numeroAcordo}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* KPIs de Carteira */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" strokeWidth={1.5} />
              Clientes Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesAtivos}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Com pelo menos um acordo ativo
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4" strokeWidth={1.5} />
              Acordos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acordosAtivosTotal}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Contratos em andamento
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" strokeWidth={1.5} />
              Total Investido (Ativo)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalInvestidoAtivo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Valor sob gestão
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Busca e Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente ou acordo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filtroMes} onValueChange={setFiltroMes}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por Mês" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Meses</SelectItem>
            <SelectItem value="Outubro/24">Outubro/24</SelectItem>
            <SelectItem value="Setembro/24">Setembro/24</SelectItem>
            <SelectItem value="Agosto/24">Agosto/24</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Status</SelectItem>
            <SelectItem value="em dia">Em dia</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="atrasado">Atrasado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filtroContrato} onValueChange={setFiltroContrato}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por Contrato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Contratos</SelectItem>
            <SelectItem value="com">Com contrato</SelectItem>
            <SelectItem value="sem">Sem contrato</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">
        Visualize cada acordo como uma linha financeira — do aporte à última parcela.
      </p>

      {/* Tabela Detalhada */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Cliente</th>
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Acordo</th>
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Mês Ref.</th>
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Valor Total</th>
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Contrato</th>
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Parc. Rest.</th>
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Status</th>
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {acordosFiltrados.map((acordo) => {
                const temContrato = acordo.contratos && acordo.contratos.length > 0;
                return (
                  <tr 
                    key={acordo.id} 
                    className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={(e) => {
                      // Não abrir modal se clicar em botão
                      if ((e.target as HTMLElement).closest('button')) {
                        return;
                      }
                      setAcordoParaEditar(acordo);
                      setEditarModalOpen(true);
                    }}
                  >
                    <td className="py-4 px-4">
                      <p className="font-medium">{acordo.cliente}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-muted-foreground">{acordo.acordo}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm">{acordo.mesRef}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold numeric-value">{acordo.valorTotal}</p>
                    </td>
                    <td className="py-4 px-4">
                      {temContrato ? (
                        <Badge className="bg-success/10 text-success hover:bg-success/20 border-success/30">
                          <FileText className="h-3 w-3 mr-1" />
                          Anexado
                          {acordo.contratos!.length > 1 && ` (${acordo.contratos!.length})`}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-warning border-warning/50">
                          Pendente
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm">{acordo.parcelasRestantes}x</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="neutral">
                        {acordo.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalAcordo({
                              id: acordo.id,
                              numeroAcordo: acordo.acordo,
                              cliente: acordo.cliente,
                              valorTotal: parseFloat(acordo.valorTotal.replace(/[^\d,]/g, "").replace(",", "."))
                            });
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!temContrato && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAcordoParaImportar({
                                id: acordo.id,
                                numeroAcordo: acordo.acordo,
                                cliente: acordo.cliente,
                              });
                              setImportarModalOpen(true);
                            }}
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {acordosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum acordo encontrado</p>
          </div>
        )}
      </Card>

      <AcordoDetalhesModal
        open={!!modalAcordo}
        onOpenChange={(open) => !open && setModalAcordo(null)}
        acordo={modalAcordo}
      />

      <EditarAcordoModal
        open={editarModalOpen}
        onOpenChange={setEditarModalOpen}
        acordo={acordoParaEditar ? {
          id: acordoParaEditar.id,
          comprador: acordoParaEditar.cliente,
          aporte: acordoParaEditar.valorTotal,
          totalReceber: acordoParaEditar.valorTotal,
          detalhePagamento: acordoParaEditar.origemPagamento,
          notas: acordoParaEditar.observacoes,
          mesReferencia: acordoParaEditar.mesRef,
        } : null}
      />

      <ImportarContratoModal
        open={importarModalOpen}
        onOpenChange={(open) => {
          setImportarModalOpen(open);
          if (!open) setAcordoParaImportar(null);
        }}
        acordo={acordoParaImportar}
        onConfirm={handleImportarContrato}
      />
    </div>
  );
};
