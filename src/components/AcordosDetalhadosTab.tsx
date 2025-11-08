import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Building2 } from "lucide-react";

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
    observacoes: "Pix até dia 25"
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
    observacoes: "Desconto aplicado"
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
    observacoes: "Cheque em compensação"
  }
];

export const AcordosDetalhadosTab = () => {
  const [acordos] = useState<AcordoDetalhado[]>(mockAcordos);
  const [busca, setBusca] = useState("");

  const totalPixCheque = acordos
    .filter(a => a.origemPagamento === "PIX/Cheque")
    .reduce((sum, a) => sum + parseFloat(a.valorTotal.replace(/[^\d,]/g, "").replace(",", ".")), 0);

  const totalSaldoInterno = acordos
    .filter(a => a.origemPagamento === "Saldo Interno")
    .reduce((sum, a) => sum + parseFloat(a.valorTotal.replace(/[^\d,]/g, "").replace(",", ".")), 0);

  const acordosFiltrados = acordos.filter(acordo =>
    acordo.cliente.toLowerCase().includes(busca.toLowerCase()) ||
    acordo.acordo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Cards de Origem de Pagamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">💸 Origem: PIX/Cheque</p>
              <p className="text-3xl font-sans numeric-value">
                {totalPixCheque.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-success" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">🏦 Origem: Saldo Interno</p>
              <p className="text-3xl font-sans numeric-value">
                {totalSaldoInterno.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
            <Building2 className="h-8 w-8 text-accent" />
          </div>
        </Card>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por cliente ou acordo..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-10"
        />
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
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Origem</th>
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Parc. Rest.</th>
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Valor Pago</th>
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Próxima Parcela</th>
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Status</th>
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Observações</th>
              </tr>
            </thead>
            <tbody>
              {acordosFiltrados.map((acordo) => (
                <tr key={acordo.id} className="border-b border-border hover:bg-muted/30 transition-colors">
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
                    <Badge variant="neutral">
                      {acordo.origemPagamento}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm">{acordo.parcelasRestantes}x</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-success-foreground numeric-value">{acordo.valorPago}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm font-semibold numeric-value">{acordo.proximaParcela}</p>
                      <p className="text-xs text-muted-foreground">{acordo.dataProximaParcela}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="neutral">
                      {acordo.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {acordo.observacoes}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {acordosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum acordo encontrado</p>
          </div>
        )}
      </Card>
    </div>
  );
};
