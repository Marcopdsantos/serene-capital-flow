import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AcordoDetalhesModal } from "@/components/AcordoDetalhesModal";
import { exportToExcel, formatCurrencyForExcel, formatCPF } from "@/lib/excelExport";
import { 
  FileSpreadsheet, 
  Download, 
  ChevronDown, 
  ChevronRight, 
  Wallet, 
  ArrowDownCircle, 
  RefreshCw,
  FileText,
  Calendar
} from "lucide-react";

// Mock data - será substituído por dados reais do Supabase
const mockClientes = [
  {
    id: "1",
    cpf: "12345678900",
    nome: "João Silva",
    parcelas: [
      { acordoId: "102", acordoNumero: "AC-102", parcelaNum: 5, totalParcelas: 10, vencimento: "15/12/2024", valor: 5000 },
      { acordoId: "105", acordoNumero: "AC-105", parcelaNum: 3, totalParcelas: 10, vencimento: "20/12/2024", valor: 6250 },
      { acordoId: "108", acordoNumero: "AC-108", parcelaNum: 7, totalParcelas: 10, vencimento: "28/12/2024", valor: 5000 },
    ],
    novosAcordos: [
      { acordoId: "150", acordoNumero: "AC-150", dataInicio: "10/12/2024", origem: "Reinvestimento", valor: 13000 },
    ],
  },
  {
    id: "2",
    cpf: "98765432100",
    nome: "Maria Costa",
    parcelas: [
      { acordoId: "110", acordoNumero: "AC-110", parcelaNum: 2, totalParcelas: 10, vencimento: "10/12/2024", valor: 4875 },
      { acordoId: "112", acordoNumero: "AC-112", parcelaNum: 6, totalParcelas: 10, vencimento: "22/12/2024", valor: 4875 },
    ],
    novosAcordos: [],
  },
  {
    id: "3",
    cpf: "45678912300",
    nome: "Pedro Oliveira",
    parcelas: [
      { acordoId: "115", acordoNumero: "AC-115", parcelaNum: 4, totalParcelas: 10, vencimento: "18/12/2024", valor: 19000 },
      { acordoId: "118", acordoNumero: "AC-118", parcelaNum: 8, totalParcelas: 10, vencimento: "25/12/2024", valor: 19000 },
    ],
    novosAcordos: [
      { acordoId: "155", acordoNumero: "AC-155", dataInicio: "05/12/2024", origem: "Novo Aporte", valor: 50000 },
    ],
  },
  {
    id: "4",
    cpf: "11122233344",
    nome: "Ana Ferreira",
    parcelas: [
      { acordoId: "120", acordoNumero: "AC-120", parcelaNum: 1, totalParcelas: 10, vencimento: "12/12/2024", valor: 3250 },
    ],
    novosAcordos: [],
  },
];

const meses = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

const anos = ["2024", "2025", "2026"];

const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export default function RelatoriosFinanceiros() {
  const [mesSelecionado, setMesSelecionado] = useState("12");
  const [anoSelecionado, setAnoSelecionado] = useState("2024");
  const [expandedClientes, setExpandedClientes] = useState<Set<string>>(new Set());
  const [acordoModalData, setAcordoModalData] = useState<{
    id: string;
    numeroAcordo: string;
    cliente: string;
    valorTotal: number;
  } | null>(null);

  // Calcula dados consolidados por cliente
  const dadosConsolidados = mockClientes.map((cliente) => {
    const totalParcelas = cliente.parcelas.reduce((sum, p) => sum + p.valor, 0);
    const totalNovosAcordos = cliente.novosAcordos.reduce((sum, a) => sum + a.valor, 0);
    const saldo = totalParcelas - totalNovosAcordos;

    return {
      ...cliente,
      totalParcelas,
      totalNovosAcordos,
      saldoAPagar: saldo > 0 ? saldo : 0,
      saldoAReceber: saldo < 0 ? Math.abs(saldo) : 0,
    };
  });

  // Totais
  const totais = dadosConsolidados.reduce(
    (acc, cliente) => ({
      parcelas: acc.parcelas + cliente.totalParcelas,
      novosAcordos: acc.novosAcordos + cliente.totalNovosAcordos,
      aPagar: acc.aPagar + cliente.saldoAPagar,
      aReceber: acc.aReceber + cliente.saldoAReceber,
    }),
    { parcelas: 0, novosAcordos: 0, aPagar: 0, aReceber: 0 }
  );

  const toggleCliente = (clienteId: string) => {
    setExpandedClientes((prev) => {
      const next = new Set(prev);
      if (next.has(clienteId)) {
        next.delete(clienteId);
      } else {
        next.add(clienteId);
      }
      return next;
    });
  };

  const handleAcordoClick = (acordoId: string, acordoNumero: string, clienteNome: string, valor: number) => {
    setAcordoModalData({
      id: acordoId,
      numeroAcordo: acordoNumero,
      cliente: clienteNome,
      valorTotal: valor,
    });
  };

  const handleExportExcel = () => {
    const mesNome = meses.find((m) => m.value === mesSelecionado)?.label || mesSelecionado;

    // Aba 1: Resumo por Cliente
    const resumoData = dadosConsolidados.map((cliente) => ({
      "CPF": formatCPF(cliente.cpf),
      "Nome": cliente.nome,
      "Parcelas do Mês (R$)": formatCurrencyForExcel(cliente.totalParcelas),
      "Novos Acordos (R$)": formatCurrencyForExcel(cliente.totalNovosAcordos),
      "Saldo a Pagar (R$)": formatCurrencyForExcel(cliente.saldoAPagar),
      "Saldo a Receber (R$)": formatCurrencyForExcel(cliente.saldoAReceber),
    }));

    // Adiciona linha de totais
    resumoData.push({
      "CPF": "TOTAL",
      "Nome": "",
      "Parcelas do Mês (R$)": formatCurrencyForExcel(totais.parcelas),
      "Novos Acordos (R$)": formatCurrencyForExcel(totais.novosAcordos),
      "Saldo a Pagar (R$)": formatCurrencyForExcel(totais.aPagar),
      "Saldo a Receber (R$)": formatCurrencyForExcel(totais.aReceber),
    });

    // Aba 2: Detalhamento
    const detalhamentoData: Record<string, unknown>[] = [];
    
    dadosConsolidados.forEach((cliente) => {
      // Adiciona parcelas
      cliente.parcelas.forEach((parcela) => {
        detalhamentoData.push({
          "CPF": formatCPF(cliente.cpf),
          "Nome": cliente.nome,
          "Tipo": "Parcela",
          "Acordo ID": parcela.acordoNumero,
          "Parcela": `${parcela.parcelaNum}/${parcela.totalParcelas}`,
          "Data": parcela.vencimento,
          "Valor (R$)": formatCurrencyForExcel(parcela.valor),
        });
      });

      // Adiciona novos acordos
      cliente.novosAcordos.forEach((acordo) => {
        detalhamentoData.push({
          "CPF": formatCPF(cliente.cpf),
          "Nome": cliente.nome,
          "Tipo": acordo.origem,
          "Acordo ID": acordo.acordoNumero,
          "Parcela": "-",
          "Data": acordo.dataInicio,
          "Valor (R$)": formatCurrencyForExcel(acordo.valor),
        });
      });
    });

    exportToExcel(
      [
        { name: "Resumo", data: resumoData },
        { name: "Detalhamento", data: detalhamentoData },
      ],
      `relatorio_financeiro_${mesNome.toLowerCase()}_${anoSelecionado}.xlsx`
    );
  };

  const mesNome = meses.find((m) => m.value === mesSelecionado)?.label || mesSelecionado;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-primary" />
            Relatórios Financeiros
          </h1>
          <p className="text-muted-foreground mt-1">
            Consolidado mensal para contabilidade
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {meses.map((mes) => (
                  <SelectItem key={mes.value} value={mes.value}>
                    {mes.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={anoSelecionado} onValueChange={setAnoSelecionado}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {anos.map((ano) => (
                  <SelectItem key={ano} value={ano}>
                    {ano}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-xs">
              <FileText className="h-4 w-4" />
              Parcelas do Mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totais.parcelas)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {dadosConsolidados.reduce((sum, c) => sum + c.parcelas.length, 0)} parcelas
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-xs">
              <RefreshCw className="h-4 w-4" />
              Novos Acordos / Reinvest.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totais.novosAcordos)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {dadosConsolidados.reduce((sum, c) => sum + c.novosAcordos.length, 0)} acordos
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-xs">
              <Wallet className="h-4 w-4" />
              Total a Pagar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totais.aPagar)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Empresa → Clientes
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-xs">
              <ArrowDownCircle className="h-4 w-4" />
              Total a Receber
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{formatCurrency(totais.aReceber)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Clientes → Empresa
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button onClick={handleExportExcel} className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Excel
        </Button>
      </div>

      {/* Tabela Consolidada */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Relatório de {mesNome} {anoSelecionado}
          </CardTitle>
          <CardDescription>
            Clique em uma linha para ver o detalhamento das parcelas e acordos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-10"></TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-right">Parcelas do Mês</TableHead>
                  <TableHead className="text-right">Novos Acordos</TableHead>
                  <TableHead className="text-right">A Pagar</TableHead>
                  <TableHead className="text-right">A Receber</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dadosConsolidados.map((cliente) => {
                  const isExpanded = expandedClientes.has(cliente.id);

                  return (
                    <Collapsible key={cliente.id} open={isExpanded} onOpenChange={() => toggleCliente(cliente.id)}>
                      <CollapsibleTrigger asChild>
                        <TableRow className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <TableCell>
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {formatCPF(cliente.cpf)}
                          </TableCell>
                          <TableCell className="font-medium">{cliente.nome}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(cliente.totalParcelas)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(cliente.totalNovosAcordos)}
                          </TableCell>
                          <TableCell className="text-right">
                            {cliente.saldoAPagar > 0 ? (
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                {formatCurrency(cliente.saldoAPagar)}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {cliente.saldoAReceber > 0 ? (
                              <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                {formatCurrency(cliente.saldoAReceber)}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      </CollapsibleTrigger>

                      <CollapsibleContent asChild>
                        <TableRow className="bg-muted/20 hover:bg-muted/30">
                          <TableCell colSpan={7} className="p-0">
                            <div className="p-4 space-y-4">
                              {/* Parcelas do Mês */}
                              {cliente.parcelas.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <Wallet className="h-4 w-4 text-blue-500" />
                                    Parcelas do Mês ({cliente.parcelas.length})
                                  </h4>
                                  <div className="bg-background rounded-lg border">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Acordo</TableHead>
                                          <TableHead>Parcela</TableHead>
                                          <TableHead>Vencimento</TableHead>
                                          <TableHead className="text-right">Valor</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {cliente.parcelas.map((parcela, idx) => (
                                          <TableRow key={idx}>
                                            <TableCell>
                                              <Button
                                                variant="link"
                                                className="p-0 h-auto text-primary font-medium"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleAcordoClick(
                                                    parcela.acordoId,
                                                    parcela.acordoNumero,
                                                    cliente.nome,
                                                    parcela.valor * parcela.totalParcelas
                                                  );
                                                }}
                                              >
                                                {parcela.acordoNumero}
                                              </Button>
                                            </TableCell>
                                            <TableCell>
                                              {parcela.parcelaNum}/{parcela.totalParcelas}
                                            </TableCell>
                                            <TableCell>{parcela.vencimento}</TableCell>
                                            <TableCell className="text-right font-medium">
                                              {formatCurrency(parcela.valor)}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              )}

                              {/* Novos Acordos / Reinvestimentos */}
                              {cliente.novosAcordos.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <RefreshCw className="h-4 w-4 text-purple-500" />
                                    Novos Acordos / Reinvestimentos ({cliente.novosAcordos.length})
                                  </h4>
                                  <div className="bg-background rounded-lg border">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Acordo</TableHead>
                                          <TableHead>Origem</TableHead>
                                          <TableHead>Data Início</TableHead>
                                          <TableHead className="text-right">Valor</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {cliente.novosAcordos.map((acordo, idx) => (
                                          <TableRow key={idx}>
                                            <TableCell>
                                              <Button
                                                variant="link"
                                                className="p-0 h-auto text-primary font-medium"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleAcordoClick(
                                                    acordo.acordoId,
                                                    acordo.acordoNumero,
                                                    cliente.nome,
                                                    acordo.valor
                                                  );
                                                }}
                                              >
                                                {acordo.acordoNumero}
                                              </Button>
                                            </TableCell>
                                            <TableCell>
                                              <Badge variant="outline">{acordo.origem}</Badge>
                                            </TableCell>
                                            <TableCell>{acordo.dataInicio}</TableCell>
                                            <TableCell className="text-right font-medium">
                                              {formatCurrency(acordo.valor)}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              )}

                              {/* Resumo da conta */}
                              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                                <span className="font-medium">Resumo: </span>
                                <span>{formatCurrency(cliente.totalParcelas)}</span>
                                <span className="text-muted-foreground"> (parcelas) </span>
                                <span>- {formatCurrency(cliente.totalNovosAcordos)}</span>
                                <span className="text-muted-foreground"> (reinvest.) = </span>
                                {cliente.saldoAPagar > 0 && (
                                  <span className="text-green-600 font-semibold">
                                    A Pagar: {formatCurrency(cliente.saldoAPagar)}
                                  </span>
                                )}
                                {cliente.saldoAReceber > 0 && (
                                  <span className="text-amber-600 font-semibold">
                                    A Receber: {formatCurrency(cliente.saldoAReceber)}
                                  </span>
                                )}
                                {cliente.saldoAPagar === 0 && cliente.saldoAReceber === 0 && (
                                  <span className="text-muted-foreground font-semibold">Zerado</span>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}

                {/* Linha de totais */}
                <TableRow className="bg-muted/70 font-semibold">
                  <TableCell></TableCell>
                  <TableCell colSpan={2}>TOTAIS</TableCell>
                  <TableCell className="text-right">{formatCurrency(totais.parcelas)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(totais.novosAcordos)}</TableCell>
                  <TableCell className="text-right text-green-600">{formatCurrency(totais.aPagar)}</TableCell>
                  <TableCell className="text-right text-amber-600">{formatCurrency(totais.aReceber)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Modal de Detalhes do Acordo */}
      <AcordoDetalhesModal
        open={!!acordoModalData}
        onOpenChange={(open) => !open && setAcordoModalData(null)}
        acordo={acordoModalData}
      />
    </div>
  );
}
