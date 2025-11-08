import { useState } from "react";
import { TrendingUp, Clock, Wallet, CalendarDays, DollarSign, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NovaAquisicaoDialog } from "@/components/NovaAquisicaoDialog";
import { FilaAquisicoesTab } from "@/components/FilaAquisicoesTab";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PainelGeral = () => {
  const [mesSelecionado, setMesSelecionado] = useState("2024-10");

  // Mock data
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
      status: "pendente_contrato",
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
  ];

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
    <div className="space-y-6">
      {/* Filtro Mestre de Mês */}
      <Card className="animate-fade-in">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-primary" strokeWidth={2} />
              <div>
                <h3 className="text-lg font-sans font-bold">Relatório Mensal</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Selecione o mês para visualizar KPIs e fila de aquisições
                </p>
              </div>
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

      {/* KPIs Principais */}
      <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="h-4 w-4" strokeWidth={2} />
              Total em Caixa Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.245.000</div>
            <p className="text-xs text-muted-foreground mt-1">Saldo global disponível</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" strokeWidth={2} />
              Acordos do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {acordosDoMes.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Aportes iniciados em {getMesLabel(mesSelecionado)}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" strokeWidth={2} />
              Pagamentos Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {pagamentosPendentes.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground mt-1">Não conciliados ainda</p>
          </CardContent>
        </Card>
      </div>

      {/* Origem dos Pagamentos */}
      <Card className="animate-fade-in hover:shadow-md transition-all">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4" strokeWidth={2} />
            Origem dos Pagamentos ({getMesLabel(mesSelecionado)})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-muted rounded-lg p-4 border">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-accent" strokeWidth={2} />
                <span className="text-xs font-medium text-muted-foreground">Pagamento Líquido</span>
              </div>
              <div className="text-xl font-bold">R$ {pagamentoLiquido.toLocaleString('pt-BR')}</div>
              <p className="text-xs text-muted-foreground mt-1">PIX, Cheque, Transferência</p>
            </div>

            <div className="bg-muted rounded-lg p-4 border">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-4 w-4 text-accent" strokeWidth={2} />
                <span className="text-xs font-medium text-muted-foreground">Compensação de Créditos</span>
              </div>
              <div className="text-xl font-bold">R$ {compensacaoCreditos.toLocaleString('pt-BR')}</div>
              <p className="text-xs text-muted-foreground mt-1">Saldo Interno utilizado</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fila de Aquisições */}
      <FilaAquisicoesTab mesSelecionado={mesSelecionado} />
    </div>
  );
};

export default PainelGeral;
