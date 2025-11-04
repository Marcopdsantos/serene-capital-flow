import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, CheckCircle, Clock, Paperclip, Eye, Mail, ShieldCheck, Edit2, ArrowUpDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { FichaCadastralModal } from "./FichaCadastralModal";

type StatusType = "aguardando_assinatura" | "aguardando_comprovante" | "pendente_conciliacao" | "ativo";
type TipoPagamento = "pix" | "saldo_interno" | "misto";

interface Aquisicao {
  id: string;
  comprador: string;
  aporte: string;
  totalReceber: string;
  detalhePagamento: string;
  tipoPagamento: TipoPagamento;
  status: StatusType;
  notas: string;
  mesReferencia: string;
  dataInicio: string;
}

const statusConfig = {
  aguardando_assinatura: {
    label: "Aguardando Assinatura",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    icon: Clock,
    acao: "Enviar Contrato",
    acaoIcon: Mail,
  },
  aguardando_comprovante: {
    label: "Aguardando Comprovante",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    icon: Paperclip,
    acao: "Anexar Comprovante",
    acaoIcon: Paperclip,
  },
  pendente_conciliacao: {
    label: "Pendente Conciliação",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    icon: Clock,
    acao: "Conciliar Pagamento",
    acaoAlternativa: "Conciliar Saldo Interno",
    acaoIcon: ShieldCheck,
  },
  ativo: {
    label: "Ativo",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    icon: CheckCircle,
    acao: "Ver Detalhes",
    acaoIcon: Eye,
  },
};

// Dados mock - substituir por dados reais do backend
const aquisicoesData: Aquisicao[] = [
  {
    id: "1",
    comprador: "Antônio Braga",
    aporte: "R$ 38.000",
    totalReceber: "R$ 49.400",
    detalhePagamento: "R$ 10k Saldo + R$ 28k PIX",
    tipoPagamento: "misto",
    status: "pendente_conciliacao",
    notas: "",
    mesReferencia: "2024-10",
    dataInicio: "2024-10-15",
  },
  {
    id: "2",
    comprador: "Maria Silva",
    aporte: "R$ 50.000",
    totalReceber: "R$ 65.000",
    detalhePagamento: "R$ 50k PIX",
    tipoPagamento: "pix",
    status: "aguardando_assinatura",
    notas: "",
    mesReferencia: "2024-10",
    dataInicio: "2024-10-18",
  },
  {
    id: "3",
    comprador: "João Santos",
    aporte: "R$ 100.000",
    totalReceber: "R$ 130.000",
    detalhePagamento: "R$ 100k Saldo Interno",
    tipoPagamento: "saldo_interno",
    status: "ativo",
    notas: "",
    mesReferencia: "2024-10",
    dataInicio: "2024-10-01",
  },
  {
    id: "4",
    comprador: "Pedro Oliveira",
    aporte: "R$ 75.000",
    totalReceber: "R$ 97.500",
    detalhePagamento: "R$ 25k Saldo + R$ 50k PIX",
    tipoPagamento: "misto",
    status: "aguardando_comprovante",
    notas: "Desconto 2k aplicado",
    mesReferencia: "2024-10",
    dataInicio: "2024-10-20",
  },
  {
    id: "5",
    comprador: "Ana Costa",
    aporte: "R$ 120.000",
    totalReceber: "R$ 156.000",
    detalhePagamento: "R$ 120k PIX",
    tipoPagamento: "pix",
    status: "pendente_conciliacao",
    notas: "",
    mesReferencia: "2024-11",
    dataInicio: "2024-11-05",
  },
];

// Mock de dados de clientes (para ficha cadastral)
const clientesData = {
  "Antônio Braga": {
    nome: "Antônio Braga",
    totalInvestido: 138000,
    totalAcordos: 3,
    saldoDisponivel: 45000,
    observacoesPendencias: "Nos deve R$ 266.200,00 referente a acordos anteriores",
  },
  "Maria Silva": {
    nome: "Maria Silva",
    totalInvestido: 50000,
    totalAcordos: 1,
    saldoDisponivel: 0,
    observacoesPendencias: "",
  },
  "João Santos": {
    nome: "João Santos",
    totalInvestido: 100000,
    totalAcordos: 1,
    saldoDisponivel: 25000,
    observacoesPendencias: "",
  },
  "Pedro Oliveira": {
    nome: "Pedro Oliveira",
    totalInvestido: 75000,
    totalAcordos: 1,
    saldoDisponivel: 10000,
    observacoesPendencias: "Desconto de R$ 2.000 aplicado no último acordo",
  },
  "Ana Costa": {
    nome: "Ana Costa",
    totalInvestido: 120000,
    totalAcordos: 1,
    saldoDisponivel: 0,
    observacoesPendencias: "",
  },
};

interface FilaAquisicoesTabProps {
  mesSelecionado: string;
}

export const FilaAquisicoesTab = ({ mesSelecionado }: FilaAquisicoesTabProps) => {
  const [filtroStatus, setFiltroStatus] = useState<StatusType | "todos">("todos");
  const [notas, setNotas] = useState<Record<string, string>>(
    aquisicoesData.reduce((acc, aq) => ({ ...acc, [aq.id]: aq.notas }), {})
  );
  const [editandoNota, setEditandoNota] = useState<string | null>(null);
  const [modalCliente, setModalCliente] = useState<{
    open: boolean;
    cliente: typeof clientesData[keyof typeof clientesData] | null;
  }>({ open: false, cliente: null });
  const [ordenacaoComprador, setOrdenacaoComprador] = useState<"asc" | "desc" | null>(null);

  // Filtra aquisições por mês
  const aquisicoesPorMes = aquisicoesData.filter((aq) => aq.mesReferencia === mesSelecionado);

  // Filtra aquisições por status
  let aquisicoesFiltradas =
    filtroStatus === "todos" ? aquisicoesPorMes : aquisicoesPorMes.filter((aq) => aq.status === filtroStatus);

  // Aplica ordenação por comprador se ativa
  if (ordenacaoComprador) {
    aquisicoesFiltradas = [...aquisicoesFiltradas].sort((a, b) => {
      if (ordenacaoComprador === "asc") {
        return a.comprador.localeCompare(b.comprador);
      } else {
        return b.comprador.localeCompare(a.comprador);
      }
    });
  }

  const contadores = {
    todos: aquisicoesPorMes.length,
    aguardando_assinatura: aquisicoesPorMes.filter((aq) => aq.status === "aguardando_assinatura").length,
    aguardando_comprovante: aquisicoesPorMes.filter((aq) => aq.status === "aguardando_comprovante").length,
    pendente_conciliacao: aquisicoesPorMes.filter((aq) => aq.status === "pendente_conciliacao").length,
    ativo: aquisicoesPorMes.filter((aq) => aq.status === "ativo").length,
  };

  const salvarNota = (id: string, texto: string) => {
    setNotas((prev) => ({ ...prev, [id]: texto }));
    setEditandoNota(null);
  };

  const handleAcao = (aquisicao: Aquisicao) => {
    const config = statusConfig[aquisicao.status];
    const acaoLabel =
      aquisicao.status === "pendente_conciliacao" && aquisicao.tipoPagamento === "saldo_interno"
        ? statusConfig.pendente_conciliacao.acaoAlternativa
        : config.acao;

    toast({
      description: `Ação "${acaoLabel}" executada para ${aquisicao.comprador}`,
      duration: 3000,
    });

    // Aqui você implementaria a lógica real de cada ação
    console.log(`Ação: ${acaoLabel}`, aquisicao);
  };

  const getMesLabel = (mesRef: string) => {
    const [ano, mes] = mesRef.split("-");
    const meses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return `${meses[parseInt(mes) - 1]} ${ano}`;
  };

  const formatarData = (dataISO: string) => {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const toggleOrdenacaoComprador = () => {
    if (ordenacaoComprador === null) {
      setOrdenacaoComprador("asc");
    } else if (ordenacaoComprador === "asc") {
      setOrdenacaoComprador("desc");
    } else {
      setOrdenacaoComprador(null);
    }
  };

  return (
    <>
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center gap-3">
            <ClipboardList className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg font-sans font-bold">Fila de Aquisições do Mês</CardTitle>
              <CardDescription>
                Gerencie todas as aquisições iniciadas no mês selecionado — substitui a planilha manual
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Tabs de Filtro de Status */}
          <Tabs value={filtroStatus} onValueChange={(v) => setFiltroStatus(v as StatusType | "todos")}>
            <TabsList className="grid grid-cols-5 w-full bg-slate-100 dark:bg-slate-800">
              <TabsTrigger 
                value="todos" 
                className="text-xs data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Todos ({contadores.todos})
              </TabsTrigger>
              <TabsTrigger 
                value="aguardando_assinatura" 
                className="text-xs data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Assinatura ({contadores.aguardando_assinatura})
              </TabsTrigger>
              <TabsTrigger 
                value="aguardando_comprovante" 
                className="text-xs data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Comprovante ({contadores.aguardando_comprovante})
              </TabsTrigger>
              <TabsTrigger 
                value="pendente_conciliacao" 
                className="text-xs data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Conciliação ({contadores.pendente_conciliacao})
              </TabsTrigger>
              <TabsTrigger 
                value="ativo" 
                className="text-xs data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Ativos ({contadores.ativo})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Tabela de Aquisições */}
          <div className="border rounded-lg border-slate-200 dark:border-slate-700">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    <button 
                      onClick={toggleOrdenacaoComprador}
                      className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                    >
                      Comprador
                      <ArrowUpDown className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Aporte</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Total a Receber</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Detalhes do Pagamento</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Notas</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aquisicoesFiltradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhuma aquisição encontrada para {getMesLabel(mesSelecionado)}
                      {filtroStatus !== "todos" && ` com status "${statusConfig[filtroStatus as StatusType].label}"`}
                    </TableCell>
                  </TableRow>
                ) : (
                  aquisicoesFiltradas.map((aquisicao) => {
                    const config = statusConfig[aquisicao.status];
                    const StatusIcon = config.icon;
                    const AcaoIcon = config.acaoIcon;
                    const acaoLabel =
                      aquisicao.status === "pendente_conciliacao" && aquisicao.tipoPagamento === "saldo_interno"
                        ? statusConfig.pendente_conciliacao.acaoAlternativa
                        : config.acao;

                    return (
                      <TableRow key={aquisicao.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                        <TableCell>
                          <button
                            onClick={() => setModalCliente({ open: true, cliente: clientesData[aquisicao.comprador as keyof typeof clientesData] })}
                            className="font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors text-left"
                          >
                            {aquisicao.comprador} <span className="text-xs text-slate-500 dark:text-slate-400">({formatarData(aquisicao.dataInicio)})</span>
                          </button>
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900 dark:text-slate-100" style={{ fontWeight: 500 }}>
                          {aquisicao.aporte}
                        </TableCell>
                        <TableCell className="font-medium text-slate-700 dark:text-slate-300">
                          {aquisicao.totalReceber}
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{aquisicao.detalhePagamento}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${config.color} border font-normal px-3 py-1 min-w-[200px] inline-flex items-center`}>
                            <StatusIcon className="h-4 w-4 mr-2" strokeWidth={2} />
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-[220px] max-w-[320px]">
                          {editandoNota === aquisicao.id ? (
                            <Input
                              defaultValue={notas[aquisicao.id] || ""}
                              autoFocus
                              onBlur={(e) => {
                                salvarNota(aquisicao.id, e.target.value);
                                toast({
                                  description: `✓ Nota salva`,
                                  duration: 2000,
                                });
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  salvarNota(aquisicao.id, e.currentTarget.value);
                                  toast({
                                    description: `✓ Nota salva`,
                                    duration: 2000,
                                  });
                                }
                              }}
                              placeholder="Ex: Desconto 2k aplicado..."
                              className="h-8 text-xs border-slate-300 dark:border-slate-600"
                            />
                          ) : (
                            <div
                              className="flex items-center gap-2 cursor-pointer group"
                              onClick={() => setEditandoNota(aquisicao.id)}
                            >
                              <p className="text-sm text-slate-600 dark:text-slate-400 flex-1">
                                {notas[aquisicao.id] || "Adicionar nota..."}
                              </p>
                              <Edit2 className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant={aquisicao.status === "ativo" ? "outline" : "default"}
                            onClick={() => handleAcao(aquisicao)}
                            className={`whitespace-nowrap h-9 px-4 ${
                              aquisicao.status === "ativo" 
                                ? "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent" 
                                : ""
                            }`}
                          >
                            <AcaoIcon className="h-4 w-4 mr-2" strokeWidth={2} />
                            {acaoLabel}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <FichaCadastralModal
        open={modalCliente.open}
        onOpenChange={(open) => setModalCliente({ open, cliente: null })}
        cliente={modalCliente.cliente}
      />
    </>
  );
};
