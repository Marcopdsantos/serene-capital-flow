import { useState } from "react";
import { TrendingUp, Wallet, CalendarDays, DollarSign } from "lucide-react";
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
  
  // KPIs de Performance Comercial
  const volumeTotalVendido = aquisicoesMes.reduce((acc, aq) => acc + aq.valorAporte, 0);
  const contratosFechados = aquisicoesMes.length;
  const clientesAtivos = new Set(aquisicoesMes.map(aq => aq.id)).size; // Usando id como proxy para cliente único

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

      {/* KPIs de Performance Comercial */}
      <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" strokeWidth={2} />
              Volume Total Vendido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {volumeTotalVendido.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Soma dos aportes em {getMesLabel(mesSelecionado)}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" strokeWidth={2} />
              Contratos Fechados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contratosFechados}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Novos acordos do mês
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="h-4 w-4" strokeWidth={2} />
              Clientes Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesAtivos}</div>
            <p className="text-xs text-muted-foreground mt-1">Clientes únicos no mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Fila de Aquisições */}
      <FilaAquisicoesTab mesSelecionado={mesSelecionado} />
    </div>
  );
};

export default PainelGeral;
