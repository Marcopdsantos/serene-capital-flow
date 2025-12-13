import { useState } from "react";
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
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo.png";
import { AcordoClienteModal, ParcelaCliente } from "@/components/portal/AcordoClienteModal";

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
  email: "joao.silva@email.com",
  telefone: "(11) 99999-9999",
  profissao: "Empresário",
  endereco: {
    rua: "Av. Paulista",
    numero: "1000",
    complemento: "Sala 1501",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01310-100",
  },
  banco: {
    nome: "Itaú Unibanco",
    agencia: "1234",
    conta: "56789-0",
    chavePix: "joao.silva@email.com",
  },
};

const ClientPortal = () => {
  const [activeTab, setActiveTab] = useState("visao-geral");
  const [acordoSelecionado, setAcordoSelecionado] = useState<typeof mockAcordos[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Cálculos para KPIs
  const totalInvestido = mockAcordos
    .filter((a) => a.status === "Ativo")
    .reduce((sum, a) => sum + a.valorOriginal, 0);

  const aguardandoDestinacao = mockAcordos.reduce((sum, acordo) => {
    const parcelasAguardando = acordo.parcelas.filter(
      (p) => p.status === "pendente" && new Date(p.dataVencimento.split("/").reverse().join("-")) < new Date()
    );
    return sum + parcelasAguardando.reduce((s, p) => s + p.valor, 0);
  }, 0);

  const projecaoProximoDia28 = mockAcordos.reduce((sum, acordo) => {
    const parcelasProximas = acordo.parcelas.filter(
      (p) => (p.status === "pendente" || p.status === "reservada") && p.dataVencimento.includes("/01/2025")
    );
    return sum + parcelasProximas.reduce((s, p) => s + p.valor, 0);
  }, 0);

  const handleAcordoClick = (acordo: typeof mockAcordos[0]) => {
    setAcordoSelecionado(acordo);
    setModalOpen(true);
  };

  const eventoConfig = {
    saque: {
      label: "Saque",
      icon: ArrowUpRight,
      className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    },
    renovacao: {
      label: "Renovação",
      icon: RefreshCw,
      className: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    },
    credito: {
      label: "Crédito",
      icon: ArrowDownLeft,
      className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-editorial mx-auto px-8 py-6 flex items-center justify-between">
          <img src={logo} alt="Acordo Capital" className="h-8" />
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Bem-vindo,</p>
              <p className="font-semibold">{perfilCliente.nome.split(" ")[0]}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-editorial mx-auto px-8 py-12 space-y-8">
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-3xl mx-auto">
            <TabsTrigger value="visao-geral" className="flex items-center gap-2">
              <Home className="h-4 w-4" strokeWidth={1.5} />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="carteira" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" strokeWidth={1.5} />
              Carteira de Acordos
            </TabsTrigger>
            <TabsTrigger value="historico" className="flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4" strokeWidth={1.5} />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="perfil" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" strokeWidth={1.5} />
              Meu Perfil
            </TabsTrigger>
          </TabsList>

          {/* TAB: Visão Geral (Dashboard) */}
          <TabsContent value="visao-geral" className="space-y-12">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-sans font-bold mb-3 leading-tight text-slate-800 dark:text-slate-100">
                Visão Geral
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Acompanhe o ciclo de vida do seu capital: Aporte → Recebimento → Destinação.
              </p>
            </div>

            {/* KPIs Cards */}
            <div className="grid md:grid-cols-3 gap-6 animate-slide-up">
              {/* Total Investido (Ativo) */}
              <Card className="shadow-sm border-l-4 border-l-primary hover:-translate-y-0.5 hover:shadow-md transition-all">
                <CardHeader className="pb-4">
                  <CardDescription className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    Total Investido (Ativo)
                  </CardDescription>
                  <CardTitle className="text-3xl font-mono mt-2 text-primary">
                    R$ {totalInvestido.toLocaleString("pt-BR")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Capital trabalhando no momento em {mockAcordos.filter((a) => a.status === "Ativo").length} acordos ativos.
                  </p>
                </CardContent>
              </Card>

              {/* Disponível para Destinação */}
              <Card className={`shadow-sm border-l-4 hover:-translate-y-0.5 hover:shadow-md transition-all ${aguardandoDestinacao > 0 ? "border-l-amber-500" : "border-l-slate-300"}`}>
                <CardHeader className="pb-4">
                  <CardDescription className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" strokeWidth={1.5} />
                    Disponível para Destinação
                    {aguardandoDestinacao > 0 && (
                      <AlertCircle className="h-4 w-4 text-amber-500" strokeWidth={1.5} />
                    )}
                  </CardDescription>
                  <CardTitle className={`text-3xl font-mono mt-2 ${aguardandoDestinacao > 0 ? "text-amber-600" : "text-slate-600"}`}>
                    R$ {aguardandoDestinacao.toLocaleString("pt-BR")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {aguardandoDestinacao > 0
                      ? "Parcelas vencidas aguardando ação. Entre em contato com seu gestor."
                      : "Nenhuma parcela aguardando destinação."}
                  </p>
                </CardContent>
              </Card>

              {/* Projeção Próximo Dia 28 */}
              <Card className="shadow-sm border-l-4 border-l-slate-400 hover:-translate-y-0.5 hover:shadow-md transition-all">
                <CardHeader className="pb-4">
                  <CardDescription className="text-sm flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-slate-500" strokeWidth={1.5} />
                    Projeção (Próximo dia 28)
                  </CardDescription>
                  <CardTitle className="text-3xl font-mono mt-2 text-slate-700 dark:text-slate-300">
                    R$ {projecaoProximoDia28.toLocaleString("pt-BR")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Previsão de recebimento para o próximo ciclo de liquidação.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB: Carteira de Acordos */}
          <TabsContent value="carteira" className="space-y-6">
            <div>
              <h2 className="text-3xl font-sans font-bold mb-2 text-slate-800 dark:text-slate-100">
                Carteira de Acordos
              </h2>
              <p className="text-muted-foreground">
                Clique em um acordo para ver o cronograma detalhado de parcelas.
              </p>
            </div>

            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
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
                          className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                          onClick={() => handleAcordoClick(acordo)}
                        >
                          <td className="py-4 px-4 font-semibold text-primary">
                            {acordo.id}
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">
                            {acordo.dataInicio}
                          </td>
                          <td className="py-4 px-4 font-mono font-semibold">
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
                                // Simular download do PDF
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
          </TabsContent>

          {/* TAB: Histórico de Movimentações */}
          <TabsContent value="historico" className="space-y-6">
            <div>
              <h2 className="text-3xl font-sans font-bold mb-2 text-slate-800 dark:text-slate-100">
                Histórico de Movimentações
              </h2>
              <p className="text-muted-foreground">
                Log de eventos: Liquidações, Renovações e Saques com rastreabilidade completa.
              </p>
            </div>

            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Data
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Evento
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Detalhes (Rastreabilidade)
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
                            className="border-b border-border/50 hover:bg-muted/30"
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
                            <td className="py-4 px-4 text-sm max-w-md">
                              {mov.detalhes}
                            </td>
                            <td className="py-4 px-4 text-right font-mono font-semibold">
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
          </TabsContent>

          {/* TAB: Meu Perfil */}
          <TabsContent value="perfil" className="space-y-6">
            <div>
              <h2 className="text-3xl font-sans font-bold mb-2 text-slate-800 dark:text-slate-100">
                Meu Perfil
              </h2>
              <p className="text-muted-foreground">
                Dados cadastrais registrados para fins contratuais.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Dados Pessoais */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-700 dark:text-slate-300">
                    Dados Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Nome Completo
                      </p>
                      <p className="font-medium">{perfilCliente.nome}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        CPF
                      </p>
                      <p className="font-mono">{perfilCliente.cpf}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        E-mail
                      </p>
                      <p className="font-medium">{perfilCliente.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Telefone
                      </p>
                      <p className="font-medium">{perfilCliente.telefone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Profissão
                      </p>
                      <p className="font-medium">{perfilCliente.profissao}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Endereço */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-700 dark:text-slate-300">
                    Endereço
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Logradouro
                      </p>
                      <p className="font-medium">
                        {perfilCliente.endereco.rua}, {perfilCliente.endereco.numero}
                        {perfilCliente.endereco.complemento && ` - ${perfilCliente.endereco.complemento}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Bairro
                      </p>
                      <p className="font-medium">{perfilCliente.endereco.bairro}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        CEP
                      </p>
                      <p className="font-mono">{perfilCliente.endereco.cep}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Cidade
                      </p>
                      <p className="font-medium">{perfilCliente.endereco.cidade}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Estado
                      </p>
                      <p className="font-medium">{perfilCliente.endereco.estado}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dados Bancários */}
              <Card className="shadow-sm md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-700 dark:text-slate-300">
                    Dados Bancários
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Banco
                      </p>
                      <p className="font-medium">{perfilCliente.banco.nome}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Agência
                      </p>
                      <p className="font-mono">{perfilCliente.banco.agencia}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Conta
                      </p>
                      <p className="font-mono">{perfilCliente.banco.conta}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Chave PIX Padrão
                      </p>
                      <p className="font-medium">{perfilCliente.banco.chavePix}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Nota de alteração */}
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5" strokeWidth={1.5} />
              <p className="text-sm text-muted-foreground">
                Para alterações cadastrais, entre em contato com seu gestor.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-editorial mx-auto px-8 py-8">
          <p className="text-center text-sm text-muted-foreground">
            Transparência é o nosso ativo mais valioso.
          </p>
        </div>
      </footer>

      {/* Modal de Detalhes do Acordo */}
      <AcordoClienteModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        acordo={acordoSelecionado}
      />
    </div>
  );
};

export default ClientPortal;
