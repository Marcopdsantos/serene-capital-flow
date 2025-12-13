import { useState, useMemo } from "react";
import {
  TrendingUp,
  Clock,
  Home,
  Briefcase,
  ArrowLeftRight,
  UserCircle,
  CalendarClock,
  AlertCircle,
  FileText,
  ArrowUpRight,
  RefreshCw,
  ArrowDownLeft,
  Paperclip,
  Info,
  User,
  CreditCard,
  Globe,
  Heart,
  Briefcase as BriefcaseIcon,
  Mail,
  Phone,
  MapPin,
  Building2,
  QrCode,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo.png";
import { AcordoClienteModal, ParcelaCliente } from "@/components/portal/AcordoClienteModal";
import { KpiDetalheModal } from "@/components/portal/KpiDetalheModal";

// Mock data para acordos com estrutura expandida
const mockAcordos = [
  {
    id: "#1001",
    dataInicio: "15/09/2024",
    valorOriginal: 50000,
    origemRecurso: "Novo Aporte (PIX)",
    progresso: 5,
    total: 10,
    valorParcela: 6500,
    status: "Ativo",
    parcelas: [
      { numero: 1, dataVencimento: "28/09/2024", valor: 6500, status: "liquidada_saque" as const },
      { numero: 2, dataVencimento: "28/10/2024", valor: 6500, status: "liquidada_saque" as const },
      { numero: 3, dataVencimento: "28/11/2024", valor: 6500, status: "reinvestida" as const, acordoDestino: "#1005" },
      { numero: 4, dataVencimento: "28/12/2024", valor: 6500, status: "reinvestida" as const, acordoDestino: "#1005" },
      { numero: 5, dataVencimento: "28/01/2025", valor: 6500, status: "reservada" as const },
      { numero: 6, dataVencimento: "28/02/2025", valor: 6500, status: "pendente" as const },
      { numero: 7, dataVencimento: "28/03/2025", valor: 6500, status: "pendente" as const },
      { numero: 8, dataVencimento: "28/04/2025", valor: 6500, status: "pendente" as const },
      { numero: 9, dataVencimento: "28/05/2025", valor: 6500, status: "pendente" as const },
      { numero: 10, dataVencimento: "28/06/2025", valor: 6500, status: "pendente" as const },
    ] as ParcelaCliente[],
  },
  {
    id: "#1002",
    dataInicio: "10/10/2024",
    valorOriginal: 75000,
    origemRecurso: "Novo Aporte (TED)",
    progresso: 3,
    total: 10,
    valorParcela: 9750,
    status: "Ativo",
    parcelas: [
      { numero: 1, dataVencimento: "28/10/2024", valor: 9750, status: "liquidada_saque" as const },
      { numero: 2, dataVencimento: "28/11/2024", valor: 9750, status: "liquidada_saque" as const },
      { numero: 3, dataVencimento: "28/12/2024", valor: 9750, status: "liquidada_saque" as const },
      { numero: 4, dataVencimento: "28/01/2025", valor: 9750, status: "reservada" as const },
      { numero: 5, dataVencimento: "28/02/2025", valor: 9750, status: "pendente" as const },
      { numero: 6, dataVencimento: "28/03/2025", valor: 9750, status: "pendente" as const },
      { numero: 7, dataVencimento: "28/04/2025", valor: 9750, status: "pendente" as const },
      { numero: 8, dataVencimento: "28/05/2025", valor: 9750, status: "pendente" as const },
      { numero: 9, dataVencimento: "28/06/2025", valor: 9750, status: "pendente" as const },
      { numero: 10, dataVencimento: "28/07/2025", valor: 9750, status: "pendente" as const },
    ] as ParcelaCliente[],
  },
  {
    id: "#1005",
    dataInicio: "01/12/2024",
    valorOriginal: 13000,
    origemRecurso: "Renovação (#1001)",
    progresso: 0,
    total: 10,
    valorParcela: 1690,
    status: "Ativo",
    parcelas: Array.from({ length: 10 }, (_, i) => ({
      numero: i + 1,
      dataVencimento: `28/${String((i + 12) % 12 + 1).padStart(2, "0")}/2025`,
      valor: 1690,
      status: "pendente" as const,
    })) as ParcelaCliente[],
  },
];

// Mock data para histórico de movimentações
const mockMovimentacoes = [
  {
    data: "28/11/2024",
    evento: "saque",
    detalhes: "Parcelas 1-2 dos Acordos #1001 e #1002 enviados para Banco Itaú - Ag 1234 CC 56789-0",
    valor: 32500,
    temComprovante: true,
  },
  {
    data: "01/12/2024",
    evento: "renovacao",
    detalhes: "Parcelas 3-4 do Acordo #1001 utilizadas para abertura do Acordo #1005",
    valor: 13000,
    temComprovante: false,
  },
  {
    data: "28/10/2024",
    evento: "credito",
    detalhes: "Crédito da parcela 1/10 do Acordo #1002 disponível para destinação",
    valor: 9750,
    temComprovante: false,
  },
  {
    data: "28/10/2024",
    evento: "credito",
    detalhes: "Crédito da parcela 2/10 do Acordo #1001 disponível para destinação",
    valor: 6500,
    temComprovante: false,
  },
];

// Dados do perfil expandido
const perfilCliente = {
  nome: "João Silva Santos",
  cpf: "123.456.789-00",
  nacionalidade: "Brasileiro",
  estadoCivil: "Casado",
  profissao: "Empresário",
  email: "joao.silva@email.com",
  telefone: "(11) 98765-4321",
  endereco: {
    rua: "Rua das Flores",
    numero: "123",
    complemento: "Apto 45",
    bairro: "Centro",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01234-567",
  },
  banco: {
    nome: "Itaú Unibanco",
    agencia: "1234",
    conta: "56789-0",
    chavePix: "joao.silva@email.com",
  },
};

// Helper para parsear data BR para Date
const parseDateBR = (dateStr: string) => {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
};

// Helper para formatar data
const formatDateBR = (date: Date) => {
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

const ClientPortal = () => {
  const [activeTab, setActiveTab] = useState("visao-geral");
  const [acordoSelecionado, setAcordoSelecionado] = useState<typeof mockAcordos[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [kpiModalOpen, setKpiModalOpen] = useState(false);
  const [kpiModalTipo, setKpiModalTipo] = useState<"total_investido" | "aguardando_destinacao" | "proximo_vencimento">("total_investido");

  const hoje = new Date();

  // Cálculos para KPIs com itens detalhados
  const acordosAtivos = mockAcordos.filter((a) => a.status === "Ativo");
  const totalInvestido = acordosAtivos.reduce((sum, a) => sum + a.valorOriginal, 0);
  const totalInvestidoItens = acordosAtivos.map((a) => ({
    acordoId: a.id,
    descricao: `Início: ${a.dataInicio} • ${a.origemRecurso}`,
    valor: a.valorOriginal,
  }));

  // Parcelas vencidas aguardando destinação
  const parcelasAguardando = useMemo(() => {
    const itens: { acordoId: string; descricao: string; valor: number; parcela: ParcelaCliente }[] = [];
    mockAcordos.forEach((acordo) => {
      acordo.parcelas.forEach((p) => {
        const dataVenc = parseDateBR(p.dataVencimento);
        if ((p.status === "pendente" || p.status === "reservada") && dataVenc < hoje) {
          itens.push({
            acordoId: acordo.id,
            descricao: `Parcela ${p.numero}/${acordo.total} • Venc: ${p.dataVencimento}`,
            valor: p.valor,
            parcela: p,
          });
        }
      });
    });
    return itens;
  }, []);

  const aguardandoDestinacao = parcelasAguardando.reduce((sum, item) => sum + item.valor, 0);

  // Próximo vencimento dinâmico
  const proximoVencimento = useMemo(() => {
    let proximaData: Date | null = null;
    const parcelas: { acordoId: string; descricao: string; valor: number; data: Date }[] = [];

    mockAcordos.forEach((acordo) => {
      acordo.parcelas.forEach((p) => {
        if (p.status === "pendente" || p.status === "reservada") {
          const dataVenc = parseDateBR(p.dataVencimento);
          if (dataVenc >= hoje) {
            if (!proximaData || dataVenc < proximaData) {
              proximaData = dataVenc;
            }
          }
        }
      });
    });

    if (proximaData) {
      mockAcordos.forEach((acordo) => {
        acordo.parcelas.forEach((p) => {
          if (p.status === "pendente" || p.status === "reservada") {
            const dataVenc = parseDateBR(p.dataVencimento);
            if (dataVenc.getTime() === proximaData!.getTime()) {
              parcelas.push({
                acordoId: acordo.id,
                descricao: `Parcela ${p.numero}/${acordo.total}`,
                valor: p.valor,
                data: dataVenc,
              });
            }
          }
        });
      });
    }

    return {
      data: proximaData,
      dataFormatada: proximaData ? formatDateBR(proximaData) : null,
      valor: parcelas.reduce((sum, p) => sum + p.valor, 0),
      itens: parcelas,
    };
  }, []);

  const handleAcordoClick = (acordo: typeof mockAcordos[0]) => {
    setAcordoSelecionado(acordo);
    setModalOpen(true);
  };

  const handleAcordoClickById = (acordoId: string) => {
    const acordo = mockAcordos.find((a) => a.id === acordoId);
    if (acordo) {
      handleAcordoClick(acordo);
    }
  };

  const handleKpiClick = (tipo: typeof kpiModalTipo) => {
    setKpiModalTipo(tipo);
    setKpiModalOpen(true);
  };

  const eventoConfig = {
    saque: {
      label: "Saque",
      icon: ArrowUpRight,
      className: "bg-slate-700 text-slate-100 dark:bg-slate-600 dark:text-slate-100",
    },
    renovacao: {
      label: "Renovação",
      icon: RefreshCw,
      className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    },
    credito: {
      label: "Crédito",
      icon: ArrowDownLeft,
      className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    },
  };

  const getKpiModalData = () => {
    switch (kpiModalTipo) {
      case "total_investido":
        return {
          titulo: "Total Investido (Ativo)",
          subtitulo: "Acordos com capital em operação",
          valor: totalInvestido,
          itens: totalInvestidoItens,
        };
      case "aguardando_destinacao":
        return {
          titulo: "Disponível para Destinação",
          subtitulo: "Parcelas vencidas aguardando ação",
          valor: aguardandoDestinacao,
          itens: parcelasAguardando.map((p) => ({
            acordoId: p.acordoId,
            descricao: p.descricao,
            valor: p.valor,
          })),
        };
      case "proximo_vencimento":
        return {
          titulo: `Próximo Vencimento (${proximoVencimento.dataFormatada || "—"})`,
          subtitulo: "Parcelas previstas para a próxima data",
          valor: proximoVencimento.valor,
          itens: proximoVencimento.itens.map((p) => ({
            acordoId: p.acordoId,
            descricao: p.descricao,
            valor: p.valor,
          })),
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/30 to-white dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-editorial mx-auto px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between">
          <img src={logo} alt="Acordo Capital" className="h-6 sm:h-8" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs sm:text-sm text-muted-foreground">Bem-vindo,</p>
              <p className="font-semibold text-sm sm:text-base">{perfilCliente.nome.split(" ")[0]}</p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-600">
              <span className="text-slate-600 dark:text-slate-300 font-semibold text-sm">
                {perfilCliente.nome.split(" ").map(n => n[0]).slice(0, 2).join("")}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-editorial mx-auto px-4 sm:px-8 py-6 sm:py-12 space-y-6 sm:space-y-8">
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-3xl mx-auto h-auto">
            <TabsTrigger value="visao-geral" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 sm:px-4">
              <Home className="h-4 w-4" strokeWidth={1.5} />
              <span className="text-[10px] sm:text-sm">Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="carteira" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 sm:px-4">
              <Briefcase className="h-4 w-4" strokeWidth={1.5} />
              <span className="text-[10px] sm:text-sm">Carteira</span>
            </TabsTrigger>
            <TabsTrigger value="historico" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 sm:px-4">
              <ArrowLeftRight className="h-4 w-4" strokeWidth={1.5} />
              <span className="text-[10px] sm:text-sm">Histórico</span>
            </TabsTrigger>
            <TabsTrigger value="perfil" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 sm:px-4">
              <UserCircle className="h-4 w-4" strokeWidth={1.5} />
              <span className="text-[10px] sm:text-sm">Perfil</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB: Visão Geral (Dashboard) */}
          <TabsContent value="visao-geral" className="space-y-8 sm:space-y-12">
            <div className="animate-fade-in">
              <h1 className="text-2xl sm:text-4xl font-sans font-bold mb-2 sm:mb-3 leading-tight text-slate-800 dark:text-slate-100">
                Visão Geral
              </h1>
              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Acompanhe o ciclo de vida do seu capital: Aporte → Recebimento → Destinação.
              </p>
            </div>

            {/* KPIs Cards - Wrapper sutil para unificar visualmente */}
            <div className="bg-slate-50/30 dark:bg-slate-800/20 rounded-xl p-3 sm:p-4 -mx-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Total Investido (Ativo) - Tom mais forte */}
                <Card 
                  className="shadow-sm border border-slate-100 dark:border-slate-700 border-l-4 border-l-slate-600 hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-in"
                  onClick={() => handleKpiClick("total_investido")}
                >
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardDescription className="text-xs sm:text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-slate-600" strokeWidth={1.5} />
                      Total Investido (Ativo)
                    </CardDescription>
                    <CardTitle className="text-2xl sm:text-3xl font-mono mt-2 text-slate-700 dark:text-slate-300 tracking-tight">
                      R$ {totalInvestido.toLocaleString("pt-BR")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Capital trabalhando em {acordosAtivos.length} acordos ativos.
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-2 flex items-center gap-1">
                      <Info className="h-3 w-3" /> Clique para detalhes
                    </p>
                  </CardContent>
                </Card>

                {/* Disponível para Destinação - Tom intermediário */}
                <Card 
                  className="shadow-sm border border-slate-100 dark:border-slate-700 border-l-4 border-l-slate-400 hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-in [animation-delay:100ms]"
                  style={{ animationFillMode: 'backwards' }}
                  onClick={() => handleKpiClick("aguardando_destinacao")}
                >
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardDescription className="text-xs sm:text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
                      Disponível para Destinação
                      {aguardandoDestinacao > 0 && (
                        <AlertCircle className="h-4 w-4 text-slate-500" strokeWidth={1.5} />
                      )}
                    </CardDescription>
                    <CardTitle className="text-2xl sm:text-3xl font-mono mt-2 text-slate-700 dark:text-slate-300 tracking-tight">
                      R$ {aguardandoDestinacao.toLocaleString("pt-BR")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {aguardandoDestinacao > 0
                        ? "Parcelas vencidas aguardando ação."
                        : "Nenhuma parcela aguardando destinação."}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-2 flex items-center gap-1">
                      <Info className="h-3 w-3" /> Clique para detalhes
                    </p>
                  </CardContent>
                </Card>

                {/* Próximo Vencimento - Tom mais suave */}
                <Card 
                  className="shadow-sm border border-slate-100 dark:border-slate-700 border-l-4 border-l-slate-300 hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer sm:col-span-2 lg:col-span-1 animate-fade-in [animation-delay:200ms]"
                  style={{ animationFillMode: 'backwards' }}
                  onClick={() => handleKpiClick("proximo_vencimento")}
                >
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardDescription className="text-xs sm:text-sm flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
                      Próximo Vencimento {proximoVencimento.dataFormatada && `(${proximoVencimento.dataFormatada})`}
                    </CardDescription>
                    <CardTitle className="text-2xl sm:text-3xl font-mono mt-2 text-slate-700 dark:text-slate-300 tracking-tight">
                      R$ {proximoVencimento.valor.toLocaleString("pt-BR")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {proximoVencimento.itens.length} parcela(s) prevista(s) para o próximo ciclo.
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-2 flex items-center gap-1">
                      <Info className="h-3 w-3" /> Clique para detalhes
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB: Carteira de Acordos */}
          <TabsContent value="carteira" className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-3xl font-sans font-bold mb-1 sm:mb-2 text-slate-800 dark:text-slate-100">
                Carteira de Acordos
              </h2>
              <p className="text-sm text-muted-foreground">
                Clique em um acordo para ver o cronograma detalhado.
              </p>
            </div>

            {/* Desktop Table */}
            <Card className="shadow-sm border border-slate-100 dark:border-slate-700 hidden md:block">
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          ID
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Data Início
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Valor Original
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Origem do Recurso
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Progresso
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Status
                        </th>
                        <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Contrato
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockAcordos.map((acordo) => (
                        <tr
                          key={acordo.id}
                          className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors duration-200"
                          onClick={() => handleAcordoClick(acordo)}
                        >
                          <td className="py-4 px-4 font-semibold text-primary">
                            {acordo.id}
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">
                            {acordo.dataInicio}
                          </td>
                          <td className="py-4 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">
                            R$ {acordo.valorOriginal.toLocaleString("pt-BR")}
                          </td>
                          <td className="py-4 px-4 text-sm">
                            <span className="text-slate-600 dark:text-slate-400">
                              {acordo.origemRecurso}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <Progress
                                value={(acordo.progresso / acordo.total) * 100}
                                className="h-2 w-24"
                              />
                              <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                {acordo.progresso}/{acordo.total}
                              </Badge>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge
                              variant="secondary"
                              className={
                                acordo.status === "Ativo"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              }
                            >
                              {acordo.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary hover:text-primary/80"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <FileText className="h-4 w-4" strokeWidth={1.5} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {mockAcordos.map((acordo) => (
                <Card
                  key={acordo.id}
                  className="shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all duration-200"
                  onClick={() => handleAcordoClick(acordo)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-primary text-lg">{acordo.id}</p>
                        <p className="text-xs text-muted-foreground">{acordo.origemRecurso}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          acordo.status === "Ativo"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }
                      >
                        {acordo.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono font-bold text-slate-900 dark:text-slate-100">
                          R$ {acordo.valorOriginal.toLocaleString("pt-BR")}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Início: {acordo.dataInicio}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={(acordo.progresso / acordo.total) * 100}
                          className="h-2 w-16"
                        />
                        <span className="text-xs text-muted-foreground">{acordo.progresso}/{acordo.total}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TAB: Histórico de Movimentações */}
          <TabsContent value="historico" className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-3xl font-sans font-bold mb-1 sm:mb-2 text-slate-800 dark:text-slate-100">
                Histórico de Movimentações
              </h2>
              <p className="text-sm text-muted-foreground">
                Log de eventos: Liquidações, Renovações e Saques.
              </p>
            </div>

            {/* Desktop Table */}
            <Card className="shadow-sm border border-slate-100 dark:border-slate-700 hidden md:block">
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Data
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Evento
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Detalhes
                        </th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Valor
                        </th>
                        <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Comprovante
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockMovimentacoes.map((mov, i) => {
                        const config = eventoConfig[mov.evento as keyof typeof eventoConfig];
                        const Icon = config.icon;
                        return (
                          <tr
                            key={i}
                            className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                          >
                            <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">
                              {mov.data}
                            </td>
                            <td className="py-4 px-4">
                              <Badge
                                variant="secondary"
                                className={`${config.className} gap-1`}
                              >
                                <Icon className="h-3 w-3" strokeWidth={1.5} />
                                {config.label}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-sm max-w-md text-slate-600 dark:text-slate-400">
                              {mov.detalhes}
                            </td>
                            <td className="py-4 px-4 text-right font-mono font-semibold text-slate-900 dark:text-slate-100">
                              R$ {mov.valor.toLocaleString("pt-BR")}
                            </td>
                            <td className="py-4 px-4 text-center">
                              {mov.temComprovante ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-primary hover:text-primary/80"
                                >
                                  <Paperclip className="h-4 w-4" strokeWidth={1.5} />
                                </Button>
                              ) : (
                                <span className="text-muted-foreground text-xs">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {mockMovimentacoes.map((mov, i) => {
                const config = eventoConfig[mov.evento as keyof typeof eventoConfig];
                const Icon = config.icon;
                return (
                  <Card
                    key={i}
                    className="shadow-sm border border-slate-100 dark:border-slate-700"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge
                          variant="secondary"
                          className={`${config.className} gap-1`}
                        >
                          <Icon className="h-3 w-3" strokeWidth={1.5} />
                          {config.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{mov.data}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {mov.detalhes}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="font-mono font-bold text-slate-900 dark:text-slate-100">
                          R$ {mov.valor.toLocaleString("pt-BR")}
                        </p>
                        {mov.temComprovante && (
                          <Button variant="ghost" size="sm" className="text-primary h-8 px-2">
                            <Paperclip className="h-4 w-4" strokeWidth={1.5} />
                            <span className="text-xs ml-1">Ver</span>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* TAB: Meu Perfil */}
          <TabsContent value="perfil" className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-3xl font-sans font-bold mb-1 sm:mb-2 text-slate-800 dark:text-slate-100">
                Meu Perfil
              </h2>
              <p className="text-sm text-muted-foreground">
                Seus dados cadastrais conforme contrato
              </p>
            </div>

            {/* Card Principal com Avatar */}
            <Card className="shadow-sm border border-slate-100 dark:border-slate-700">
              <CardContent className="pt-6">
                {/* Header com Avatar */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                  <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <User className="h-7 w-7 text-slate-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{perfilCliente.nome}</h3>
                    <p className="text-sm text-primary">Investidor</p>
                  </div>
                </div>

                {/* Dados Pessoais do Investidor */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                    Dados Pessoais do Investidor
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-slate-400 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs text-primary font-medium mb-0.5">Nome Completo</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{perfilCliente.nome}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CreditCard className="h-4 w-4 text-slate-400 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs text-primary font-medium mb-0.5">CPF</p>
                        <p className="text-sm font-mono text-slate-700 dark:text-slate-300">{perfilCliente.cpf}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="h-4 w-4 text-slate-400 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs text-primary font-medium mb-0.5">Nacionalidade</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{perfilCliente.nacionalidade}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Heart className="h-4 w-4 text-slate-400 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs text-primary font-medium mb-0.5">Estado Civil</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{perfilCliente.estadoCivil}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <BriefcaseIcon className="h-4 w-4 text-slate-400 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs text-primary font-medium mb-0.5">Profissão</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{perfilCliente.profissao}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contato */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                    Contato
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-slate-400 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs text-primary font-medium mb-0.5">E-mail</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 break-all">{perfilCliente.email}</p>
                      </div>
                    </div>
                    <a 
                      href={`https://wa.me/55${perfilCliente.telefone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 -mx-2 px-2 py-1 rounded-md transition-colors"
                    >
                      <Phone className="h-4 w-4 text-slate-400 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs text-primary font-medium mb-0.5">Telefone (WhatsApp)</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{perfilCliente.telefone}</p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Endereço Completo */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                    Endereço Completo
                  </h4>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs text-primary font-medium mb-0.5">Endereço</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {perfilCliente.endereco.rua}, {perfilCliente.endereco.numero}
                        {perfilCliente.endereco.complemento && ` - ${perfilCliente.endereco.complemento}`}
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {perfilCliente.endereco.bairro} - {perfilCliente.endereco.cidade}/{perfilCliente.endereco.estado}
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        CEP: {perfilCliente.endereco.cep}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dados Bancários */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                    Dados Bancários (para recebimento)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-4 w-4 text-slate-400 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs text-primary font-medium mb-0.5">Banco</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{perfilCliente.banco.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          Ag: {perfilCliente.banco.agencia} | Conta: {perfilCliente.banco.conta}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <QrCode className="h-4 w-4 text-slate-400 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs text-primary font-medium mb-0.5">Chave PIX</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 break-all">{perfilCliente.banco.chavePix}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nota de alteração */}
            <div className="flex items-start gap-3 p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium">Nota:</span> Para alterações cadastrais, entre em contato com seu gestor através do e-mail{" "}
                <a href="mailto:acordocapital@gmail.com" className="text-primary hover:underline">acordocapital@gmail.com</a>
                {" "}ou WhatsApp{" "}
                <a href="https://wa.me/5519999181307" className="text-primary hover:underline">(19) 99918-1307</a>.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 mt-8 sm:mt-12 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-editorial mx-auto px-4 sm:px-8 py-6 sm:py-8">
          <img src={logo} alt="Acordo Capital" className="h-5 mx-auto mb-4 opacity-50" />
          <p className="text-center text-xs sm:text-sm text-muted-foreground mb-2">
            Investindo em operações de crédito com segurança jurídica e rentabilidade
          </p>
          <p className="text-center text-[10px] sm:text-xs text-muted-foreground/60">
            Desenvolvido por{" "}
            <a 
              href="https://www.instagram.com/space.inteligencia/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Space Inteligência
            </a>
          </p>
        </div>
      </footer>

      {/* Modal de Detalhes do Acordo */}
      <AcordoClienteModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        acordo={acordoSelecionado}
      />

      {/* Modal de Detalhes do KPI */}
      <KpiDetalheModal
        open={kpiModalOpen}
        onOpenChange={setKpiModalOpen}
        tipo={kpiModalTipo}
        {...getKpiModalData()}
        onItemClick={handleAcordoClickById}
      />
    </div>
  );
};

export default ClientPortal;
