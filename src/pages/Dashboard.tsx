import { useState } from "react";
import { LayoutDashboard, FileText, TrendingUp, Clock, Wallet, Users, FileCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NovaAquisicaoDialog } from "@/components/NovaAquisicaoDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FluxoCaixaTab } from "@/components/FluxoCaixaTab";
import { ComprovantesTab } from "@/components/ComprovantesTab";
import { AcordosDetalhadosTab } from "@/components/AcordosDetalhadosTab";
import { ComprovanteModal } from "@/components/ComprovanteModal";
import { FilaAquisicoesTab } from "@/components/FilaAquisicoesTab";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [comprovanteModal, setComprovanteModal] = useState<{ open: boolean; acordo: any }>({
    open: false,
    acordo: null
  });
  const [mesSelecionado, setMesSelecionado] = useState("2024-10"); // Filtro mestre

  // Mock data - substituir por dados reais do backend
  const aquisicoesData = [
    {
      id: "1",
      mesRef: "2024-10",
      valorAporte: 38000,
      status: "pendente_conciliacao",
      tipoPagamento: "misto",
      pixCheque: 28000,
      saldoInterno: 10000,
    },
    {
      id: "2",
      mesRef: "2024-10",
      valorAporte: 50000,
      status: "aguardando_assinatura",
      tipoPagamento: "pix",
      pixCheque: 50000,
      saldoInterno: 0,
    },
    {
      id: "3",
      mesRef: "2024-10",
      valorAporte: 100000,
      status: "ativo",
      tipoPagamento: "saldo_interno",
      pixCheque: 0,
      saldoInterno: 100000,
    },
    {
      id: "4",
      mesRef: "2024-10",
      valorAporte: 75000,
      status: "aguardando_comprovante",
      tipoPagamento: "misto",
      pixCheque: 50000,
      saldoInterno: 25000,
    },
    {
      id: "5",
      mesRef: "2024-11",
      valorAporte: 120000,
      status: "ativo",
      tipoPagamento: "pix",
      pixCheque: 120000,
      saldoInterno: 0,
    },
  ];

  // Calcula KPIs baseados no mês selecionado
  const aquisicoesMes = aquisicoesData.filter(aq => aq.mesRef === mesSelecionado);
  
  const acordosDoMes = aquisicoesMes.reduce((acc, aq) => acc + aq.valorAporte, 0);
  
  const pagamentosPendentes = aquisicoesMes
    .filter(aq => aq.status !== "ativo")
    .reduce((acc, aq) => acc + aq.valorAporte, 0);
  
  const pagamentoLiquido = aquisicoesMes
    .filter(aq => aq.status === "ativo")
    .reduce((acc, aq) => acc + aq.pixCheque, 0);
  
  const compensacaoCreditos = aquisicoesMes
    .filter(aq => aq.status === "ativo")
    .reduce((acc, aq) => acc + aq.saldoInterno, 0);

  const getMesLabel = (mesRef: string) => {
    const [ano, mes] = mesRef.split("-");
    const meses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
    ];
    return `${meses[parseInt(mes) - 1]} ${ano}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-editorial mx-auto px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold font-sans">Acordo Capital — Painel do Gestor</h1>
          <NovaAquisicaoDialog />
        </div>
      </header>

      <div className="max-w-editorial mx-auto px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted grid grid-cols-4">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Painel Geral
            </TabsTrigger>
            <TabsTrigger value="acordos" className="gap-2">
              <Users className="h-4 w-4" />
              Acordos Detalhados
            </TabsTrigger>
            <TabsTrigger value="fluxo" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Fluxo de Caixa
            </TabsTrigger>
            <TabsTrigger value="comprovantes" className="gap-2">
              <FileCheck className="h-4 w-4" />
              Comprovantes
            </TabsTrigger>
          </TabsList>

          {/* Aba Overview */}
          <TabsContent value="overview" className="space-y-6">
            {/* Filtro Mestre de Mês */}
            <Card className="animate-fade-in">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-sans font-bold">📊 Relatório Mensal</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Selecione o mês para visualizar KPIs e fila de aquisições
                    </p>
                  </div>
                  <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-09">Setembro 2024</SelectItem>
                      <SelectItem value="2024-10">Outubro 2024</SelectItem>
                      <SelectItem value="2024-11">Novembro 2024</SelectItem>
                      <SelectItem value="2024-12">Dezembro 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Linha 1: KPIs Principais */}
            <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
              <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-muted/20 border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <CardDescription>Total em Caixa Atual</CardDescription>
                    <div className="h-px flex-1 mx-3 bg-border/30" />
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-sans numeric-value" style={{ fontWeight: 500 }}>
                    R$ 1.245.000
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Saldo disponível (Global)</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-muted/20 border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <CardDescription>Acordos do Mês</CardDescription>
                    <div className="h-px flex-1 mx-3 bg-border/30" />
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                  <CardTitle className="text-3xl font-sans numeric-value" style={{ fontWeight: 500 }}>
                    R$ {acordosDoMes.toLocaleString('pt-BR')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{getMesLabel(mesSelecionado)}</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-muted/20 border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <CardDescription>Pagamentos Pendentes</CardDescription>
                    <div className="h-px flex-1 mx-3 bg-border/30" />
                    <Clock className="h-5 w-5 text-pending" />
                  </div>
                  <CardTitle className="text-3xl font-sans numeric-value" style={{ fontWeight: 500 }}>
                    R$ {pagamentosPendentes.toLocaleString('pt-BR')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Não conciliados ainda</p>
                </CardContent>
              </Card>
            </div>

            {/* Linha 2: Origem dos Pagamentos */}
            <Card className="animate-fade-in hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <CardTitle className="text-lg font-sans">Origem dos Pagamentos ({getMesLabel(mesSelecionado)})</CardTitle>
                </div>
                <CardDescription>Detalhamento da origem dos recursos conciliados no mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Mini-card: Pagamento Líquido */}
                  <div className="bg-card/50 rounded-lg p-4 border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Pagamento Líquido</p>
                      <TrendingUp className="h-4 w-4 text-success" />
                    </div>
                    <p className="text-2xl font-sans numeric-value" style={{ fontWeight: 500 }}>
                      R$ {pagamentoLiquido.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PIX/Cheque conciliados</p>
                  </div>

                  {/* Mini-card: Compensação de Créditos */}
                  <div className="bg-card/50 rounded-lg p-4 border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Compensação de Créditos</p>
                      <Wallet className="h-4 w-4 text-accent" />
                    </div>
                    <p className="text-2xl font-sans numeric-value" style={{ fontWeight: 500 }}>
                      R$ {compensacaoCreditos.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Saldo Interno conciliado</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fila de Aquisições do Mês */}
            <FilaAquisicoesTab mesSelecionado={mesSelecionado} />
          </TabsContent>

          {/* Aba Acordos Detalhados */}
          <TabsContent value="acordos" className="animate-fade-in">
            <AcordosDetalhadosTab />
          </TabsContent>

          {/* Aba Fluxo de Caixa */}
          <TabsContent value="fluxo" className="animate-fade-in">
            <FluxoCaixaTab />
          </TabsContent>

          {/* Aba Comprovantes */}
          <TabsContent value="comprovantes" className="animate-fade-in">
            <ComprovantesTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Comprovantes */}
      <ComprovanteModal
        open={comprovanteModal.open}
        onOpenChange={(open) => setComprovanteModal({ open, acordo: null })}
        acordo={comprovanteModal.acordo || { id: "1", cliente: "Cliente 1", valor: "R$ 50.000", aquisicao: "AQ-2024-001" }}
      />
    </div>
  );
};

export default Dashboard;
