import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AcordoDetalhesModal } from "@/components/AcordoDetalhesModal";
import { exportToExcel, formatCurrencyForExcel } from "@/lib/excelExport";
import { 
  FileSpreadsheet, 
  Download, 
  ChevronDown, 
  ChevronRight, 
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Calendar
} from "lucide-react";

// Dados reais
const mockClientes = [
  { id: "1", nome: "Adnan Ayoub Fabiano", cpf: "363.870.188-38", parcelasDoMes: 100000, novosAcordos: 36000, aPagar: 64000, reinvestimentos: 36000, aReceber: 0 },
  { id: "2", nome: "Adriano Harari", cpf: "087.491.238-58", parcelasDoMes: 60000, novosAcordos: 16500, aPagar: 43500, reinvestimentos: 16500, aReceber: 0 },
  { id: "3", nome: "Adriano Pinto Menin", cpf: "216.402.368-48", parcelasDoMes: 20000, novosAcordos: 28000, aPagar: 0, reinvestimentos: 20000, aReceber: 8000 },
  { id: "4", nome: "Ahmad Kalil Ayoub", cpf: "123.777.878-60", parcelasDoMes: 100000, novosAcordos: 9100, aPagar: 90900, reinvestimentos: 9100, aReceber: 0 },
  { id: "5", nome: "Alison Bernardes Leal", cpf: "454.082.298-58", parcelasDoMes: 50000, novosAcordos: 0, aPagar: 50000, reinvestimentos: 0, aReceber: 0 },
  { id: "6", nome: "André Costa Battisti", cpf: "073.042.569-07", parcelasDoMes: 245000, novosAcordos: 151200, aPagar: 93800, reinvestimentos: 151200, aReceber: 0 },
  { id: "7", nome: "André Jordão", cpf: "419.317.758-00", parcelasDoMes: 50000, novosAcordos: 0, aPagar: 50000, reinvestimentos: 0, aReceber: 0 },
  { id: "8", nome: "Brian Peterson Júlio de Paula Moraes", cpf: "474.820.778-71", parcelasDoMes: 50000, novosAcordos: 11600, aPagar: 38400, reinvestimentos: 11600, aReceber: 0 },
  { id: "9", nome: "Bruno Alfredo Frantz", cpf: "077.419.949-05", parcelasDoMes: 77000, novosAcordos: 72100, aPagar: 4900, reinvestimentos: 72100, aReceber: 0 },
  { id: "10", nome: "Bruno Jorge dos Santos - Fernando", cpf: "229.310.778-79", parcelasDoMes: 50000, novosAcordos: 0, aPagar: 50000, reinvestimentos: 0, aReceber: 0 },
  { id: "11", nome: "Daniel Vieira", cpf: "192.536.547-67", parcelasDoMes: 50000, novosAcordos: 6100, aPagar: 43900, reinvestimentos: 6100, aReceber: 0 },
  { id: "12", nome: "Danilo Zafalon", cpf: "326.107.788-30", parcelasDoMes: 100000, novosAcordos: 51000, aPagar: 49000, reinvestimentos: 51000, aReceber: 0 },
  { id: "13", nome: "Diogo Germano Mendonça", cpf: "092.118.289-96", parcelasDoMes: 110000, novosAcordos: 110900, aPagar: 0, reinvestimentos: 110000, aReceber: 900 },
  { id: "14", nome: "Eduardo Henrique Ribeiro", cpf: "395.455.008-32", parcelasDoMes: 250000, novosAcordos: 483700, aPagar: 0, reinvestimentos: 250000, aReceber: 233700 },
  { id: "15", nome: "Elvis Roberto", cpf: "306.507.648-97", parcelasDoMes: 424000, novosAcordos: 0, aPagar: 424000, reinvestimentos: 0, aReceber: 0 },
  { id: "16", nome: "Fernando Rodrigue da Silva", cpf: "227.717.048-89", parcelasDoMes: 250000, novosAcordos: 273950, aPagar: 2300, reinvestimentos: 247700, aReceber: 26250 },
  { id: "17", nome: "Gabriel Franco da Silveira Neto", cpf: "094.637.218-78", parcelasDoMes: 100000, novosAcordos: 32000, aPagar: 68000, reinvestimentos: 32000, aReceber: 0 },
  { id: "18", nome: "Gisleine Garcia Jacinto - Adriano", cpf: "280.106.448-38", parcelasDoMes: 20000, novosAcordos: 36500, aPagar: 0, reinvestimentos: 20000, aReceber: 16500 },
  { id: "19", nome: "Guilherme Pitarello", cpf: "043.099.263-80", parcelasDoMes: 79000, novosAcordos: 24000, aPagar: 55000, reinvestimentos: 24000, aReceber: 0 },
  { id: "20", nome: "Jeffrey Christopher de Oliveira Jardim Coelho", cpf: "331.151.478-56", parcelasDoMes: 40000, novosAcordos: 85600, aPagar: 0, reinvestimentos: 40000, aReceber: 45600 },
  { id: "21", nome: "Jhonata Maiko Prevelato", cpf: "411.455.648-60", parcelasDoMes: 50000, novosAcordos: 20000, aPagar: 30000, reinvestimentos: 20000, aReceber: 0 },
  { id: "22", nome: "João Henrique Pasqual Machado", cpf: "013.558.910-00", parcelasDoMes: 80000, novosAcordos: 19100, aPagar: 60900, reinvestimentos: 19100, aReceber: 0 },
  { id: "23", nome: "João Paulo Perin - Martan", cpf: "066.361.179-23", parcelasDoMes: 250000, novosAcordos: 308300, aPagar: 0, reinvestimentos: 250000, aReceber: 58300 },
  { id: "24", nome: "Kaua Nascimento Vicente", cpf: "430.089.048-07", parcelasDoMes: 30000, novosAcordos: 18100, aPagar: 11900, reinvestimentos: 18100, aReceber: 0 },
  { id: "25", nome: "Lucas Borges Mendes - Luan", cpf: "092.348.269-57", parcelasDoMes: 50000, novosAcordos: 0, aPagar: 50000, reinvestimentos: 0, aReceber: 0 },
  { id: "26", nome: "Lucas Dituri", cpf: "354.823.658-83", parcelasDoMes: 50000, novosAcordos: 0, aPagar: 50000, reinvestimentos: 0, aReceber: 0 },
  { id: "27", nome: "Lucas Triques", cpf: "", parcelasDoMes: 140000, novosAcordos: 32100, aPagar: 107900, reinvestimentos: 32100, aReceber: 0 },
  { id: "28", nome: "Marcelo de Medeiros Ferreira - Felipe", cpf: "027.759.088-45", parcelasDoMes: 40000, novosAcordos: 58100, aPagar: 0, reinvestimentos: 40000, aReceber: 18100 },
  { id: "29", nome: "Marco Aurélio Salviato Maximino", cpf: "315.514.558-70", parcelasDoMes: 100000, novosAcordos: 18000, aPagar: 82000, reinvestimentos: 18000, aReceber: 0 },
  { id: "30", nome: "Marcos Anderson Ferreira Rego", cpf: "663.193.742-68", parcelasDoMes: 500000, novosAcordos: 328500, aPagar: 224000, reinvestimentos: 276000, aReceber: 0 },
  { id: "31", nome: "Maryse dos Santos Fila Pitarello", cpf: "168.044.768-83", parcelasDoMes: 100000, novosAcordos: 48600, aPagar: 51400, reinvestimentos: 48600, aReceber: 0 },
  { id: "32", nome: "Mauricio Rodrigues Furquim", cpf: "052.010.690-37", parcelasDoMes: 50000, novosAcordos: 55600, aPagar: 30600, reinvestimentos: 19400, aReceber: 36200 },
  { id: "33", nome: "Nádia Teresa Bertanha Luvizotti", cpf: "352.470.088-80", parcelasDoMes: 200000, novosAcordos: 43000, aPagar: 157000, reinvestimentos: 43000, aReceber: 0 },
  { id: "34", nome: "Nathan Fortes - Martan Clientes", cpf: "408.758.958-75", parcelasDoMes: 90000, novosAcordos: 0, aPagar: 100000, reinvestimentos: 0, aReceber: 0 },
  { id: "35", nome: "Neile Maria Bertanha Luvizotti", cpf: "191.940.908-40", parcelasDoMes: 40000, novosAcordos: 13500, aPagar: 26500, reinvestimentos: 13500, aReceber: 0 },
  { id: "36", nome: "Nicole", cpf: "", parcelasDoMes: 160000, novosAcordos: 0, aPagar: 160000, reinvestimentos: 0, aReceber: 0 },
  { id: "37", nome: "Paulo Leonel Weber Filho", cpf: "037.546.440-92", parcelasDoMes: 40000, novosAcordos: 53300, aPagar: 0, reinvestimentos: 40000, aReceber: 13300 },
  { id: "38", nome: "Pedro Greco", cpf: "363.309.428-89", parcelasDoMes: 50000, novosAcordos: 110250, aPagar: 0, reinvestimentos: 50000, aReceber: 60250 },
  { id: "39", nome: "Pedro Remolli", cpf: "100.015.166-20", parcelasDoMes: 40000, novosAcordos: 25000, aPagar: 15000, reinvestimentos: 25000, aReceber: 0 },
  { id: "40", nome: "Rhaylander Gusmão Cora Francisco", cpf: "412.157.748-50", parcelasDoMes: 35000, novosAcordos: 34500, aPagar: 500, reinvestimentos: 34500, aReceber: 0 },
  { id: "41", nome: "Rudson Cristiano San Martin Alves", cpf: "050.152.570-07", parcelasDoMes: 80000, novosAcordos: 11600, aPagar: 68400, reinvestimentos: 11600, aReceber: 0 },
  { id: "42", nome: "Sebastião Carlos de Lucca (Xerife)", cpf: "717.851.248-20", parcelasDoMes: 112000, novosAcordos: 99000, aPagar: 13000, reinvestimentos: 99000, aReceber: 0 },
  { id: "43", nome: "Sergio Pitarello", cpf: "", parcelasDoMes: 290000, novosAcordos: 0, aPagar: 290000, reinvestimentos: 0, aReceber: 0 },
  { id: "44", nome: "Thais Fernanda Clemonesi", cpf: "352.786.638-80", parcelasDoMes: 20000, novosAcordos: 6100, aPagar: 13900, reinvestimentos: 6100, aReceber: 0 },
  { id: "45", nome: "Victor Oliveira Goncalves - Eduardo", cpf: "388.802.588-50", parcelasDoMes: 100000, novosAcordos: 25000, aPagar: 75000, reinvestimentos: 25000, aReceber: 0 },
  { id: "46", nome: "Vinicius de Lucca", cpf: "386.596.538-58", parcelasDoMes: 28000, novosAcordos: 28100, aPagar: 0, reinvestimentos: 28000, aReceber: 100 },
  { id: "47", nome: "Willian Rodrigo Felipe - Primo Adnan", cpf: "357.203.868-58", parcelasDoMes: 20000, novosAcordos: 0, aPagar: 20000, reinvestimentos: 0, aReceber: 0 },
  { id: "48", nome: "Wish", cpf: "", parcelasDoMes: 50000, novosAcordos: 0, aPagar: 50000, reinvestimentos: 0, aReceber: 0 },
  { id: "49", nome: "André Luiz Mattar", cpf: "055.012.588-46", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 13500 },
  { id: "50", nome: "André Rompa", cpf: "", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 522800 },
  { id: "51", nome: "Beatriz Pantioni Alegre", cpf: "390.111.678-80", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 90700 },
  { id: "52", nome: "Bruna Silva de Souza", cpf: "094.388.356-36", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 6100 },
  { id: "53", nome: "Bruno Meurer", cpf: "093.671.249-02", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 8500 },
  { id: "54", nome: "Bruno Missiato", cpf: "408.874.848-40", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 37200 },
  { id: "55", nome: "Carlos Alberto Alencar Ferreira", cpf: "765.375.793-68", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 5500 },
  { id: "56", nome: "Cleyton Vinicius Sell", cpf: "092.416.319-45", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 55500 },
  { id: "57", nome: "Daniel Rudolf Spindler Aguiar Batalha", cpf: "119.631.757-78", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 45500 },
  { id: "58", nome: "Elton José Tendolini", cpf: "208.880.628-93", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 17000 },
  { id: "59", nome: "Fabio Henrique Lepre", cpf: "422.330.058-05", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 5500 },
  { id: "60", nome: "Fernanda Marques Saraiva", cpf: "007.045.483-30", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 7900 },
  { id: "61", nome: "Herbert Marcos Pereira", cpf: "337.282.138-61", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 53000 },
  { id: "62", nome: "Iesus Jefferson Tadeu de Assis Guião", cpf: "383.600.378-33", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 17900 },
  { id: "63", nome: "Julio Cesar da Silva Campos", cpf: "325.082.598-02", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 13500 },
  { id: "64", nome: "Júlia Maria Barreira", cpf: "443.040.638-39", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 11500 },
  { id: "65", nome: "Kleber Henrique Gomes Luz", cpf: "407.976.168-61", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 8500 },
  { id: "66", nome: "Marco Augusto Colussi", cpf: "340.345.848-23", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 6100 },
  { id: "67", nome: "Martan Berce Medeiros da Costa", cpf: "459.874.748-09", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 66500 },
  { id: "68", nome: "Matheus Daros Nessler", cpf: "094.807.469-80", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 5500 },
  { id: "69", nome: "Michelly Pacheco Piantonni", cpf: "261.827.498-90", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 20100 },
  { id: "70", nome: "Neide Guimaraes", cpf: "", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 8500 },
  { id: "71", nome: "Nicolas Marques Bressan", cpf: "072.161.289-07", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 19000 },
  { id: "72", nome: "Oswaldo Bortoletto Junior", cpf: "042.072.758-27", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 11500 },
  { id: "73", nome: "Rafael de Mello", cpf: "351.860.018-48", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 15100 },
  { id: "74", nome: "Rafael Luis Nunes Safra", cpf: "258.837.098-50", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 9500 },
  { id: "75", nome: "Ricardo Salvador Crupi", cpf: "298.725.638-88", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 25500 },
  { id: "76", nome: "Rubens Perez Calegari", cpf: "068.241.369-05", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 11600 },
  { id: "77", nome: "Thais Fernanda Vicente Silva", cpf: "472.830.208-37", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 8500 },
  { id: "78", nome: "Weskley Gomes de Souza", cpf: "356.434.228-16", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 8500 },
  { id: "79", nome: "Wilson Ferreira dos Santos Junior", cpf: "085.336.246-70", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 5500 },
  { id: "80", nome: "Laercio", cpf: "", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 25500 },
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

  // Totais
  const totais = mockClientes.reduce(
    (acc, cliente) => ({
      entradas: acc.entradas + cliente.parcelasDoMes,
      saidas: acc.saidas + cliente.aPagar,
      reinvestimentos: acc.reinvestimentos + cliente.reinvestimentos,
      aReceber: acc.aReceber + cliente.aReceber,
    }),
    { entradas: 0, saidas: 0, reinvestimentos: 0, aReceber: 0 }
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

  const handleExportExcel = () => {
    const mesNome = meses.find((m) => m.value === mesSelecionado)?.label || mesSelecionado;

    // Aba 1: Resumo por Cliente
    const resumoData = mockClientes.map((cliente) => ({
      "Nome": cliente.nome,
      "CPF": cliente.cpf || "Não informado",
      "Parcelas do Mês (R$)": formatCurrencyForExcel(cliente.parcelasDoMes),
      "Novos Acordos (R$)": formatCurrencyForExcel(cliente.novosAcordos),
      "A Pagar (R$)": formatCurrencyForExcel(cliente.aPagar),
      "Reinvestimentos (R$)": formatCurrencyForExcel(cliente.reinvestimentos),
      "A Receber (R$)": formatCurrencyForExcel(cliente.aReceber),
    }));

    // Adiciona linha de totais
    resumoData.push({
      "Nome": "TOTAL",
      "CPF": "",
      "Parcelas do Mês (R$)": formatCurrencyForExcel(totais.entradas),
      "Novos Acordos (R$)": "",
      "A Pagar (R$)": formatCurrencyForExcel(totais.saidas),
      "Reinvestimentos (R$)": formatCurrencyForExcel(totais.reinvestimentos),
      "A Receber (R$)": formatCurrencyForExcel(totais.aReceber),
    });

    exportToExcel(
      [{ name: "Relatório Financeiro", data: resumoData }],
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-xs">
              <TrendingUp className="h-4 w-4" />
              Total de Entradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totais.entradas)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Parcelas do mês
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-xs">
              <TrendingDown className="h-4 w-4" />
              Total de Saídas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totais.saidas)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Valores a pagar aos clientes
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-xs">
              <RefreshCw className="h-4 w-4" />
              Total de Reinvestimentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(totais.reinvestimentos)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Valores reinvestidos em novos acordos
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
            Clique em uma linha para ver o detalhamento
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <div className="min-w-[900px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-10"></TableHead>
                    <TableHead className="min-w-[200px]">Nome</TableHead>
                    <TableHead className="w-[140px]">CPF</TableHead>
                    <TableHead className="text-right w-[120px]">Parcelas Mês</TableHead>
                    <TableHead className="text-right w-[120px]">Novos Acordos</TableHead>
                    <TableHead className="text-right w-[120px]">A Pagar</TableHead>
                    <TableHead className="text-right w-[120px]">Reinvest.</TableHead>
                    <TableHead className="text-right w-[120px]">A Receber</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockClientes.map((cliente) => {
                    const isExpanded = expandedClientes.has(cliente.id);

                    return (
                      <Collapsible key={cliente.id} open={isExpanded} onOpenChange={() => toggleCliente(cliente.id)}>
                        <CollapsibleTrigger asChild>
                          <TableRow className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <TableCell className="py-3">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                            </TableCell>
                            <TableCell className="font-medium py-3">{cliente.nome}</TableCell>
                            <TableCell className="font-mono text-sm py-3">
                              {cliente.cpf || <span className="text-muted-foreground italic">-</span>}
                            </TableCell>
                            <TableCell className="text-right font-medium py-3">
                              {cliente.parcelasDoMes > 0 ? formatCurrency(cliente.parcelasDoMes) : "-"}
                            </TableCell>
                            <TableCell className="text-right py-3">
                              {cliente.novosAcordos > 0 ? formatCurrency(cliente.novosAcordos) : "-"}
                            </TableCell>
                            <TableCell className="text-right py-3">
                              {cliente.aPagar > 0 ? (
                                <span className="text-green-600 font-semibold">
                                  {formatCurrency(cliente.aPagar)}
                                </span>
                              ) : "-"}
                            </TableCell>
                            <TableCell className="text-right py-3">
                              {cliente.reinvestimentos > 0 ? (
                                <span className="text-purple-600 font-medium">
                                  {formatCurrency(cliente.reinvestimentos)}
                                </span>
                              ) : "-"}
                            </TableCell>
                            <TableCell className="text-right py-3">
                              {cliente.aReceber > 0 ? (
                                <span className="text-amber-600 font-semibold">
                                  {formatCurrency(cliente.aReceber)}
                                </span>
                              ) : "-"}
                            </TableCell>
                          </TableRow>
                        </CollapsibleTrigger>

                        <CollapsibleContent asChild>
                          <TableRow className="bg-muted/20 hover:bg-muted/30">
                            <TableCell colSpan={8} className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-background rounded-lg border p-4">
                                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-blue-500" />
                                    Resumo do Cliente
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Parcelas do Mês:</span>
                                      <span className="font-medium">{formatCurrency(cliente.parcelasDoMes)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Novos Acordos:</span>
                                      <span className="font-medium">{formatCurrency(cliente.novosAcordos)}</span>
                                    </div>
                                    <div className="border-t pt-2 mt-2">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">A Pagar:</span>
                                        <span className="font-semibold text-green-600">{formatCurrency(cliente.aPagar)}</span>
                                      </div>
                                      <div className="flex justify-between mt-1">
                                        <span className="text-muted-foreground">Reinvestimentos:</span>
                                        <span className="font-semibold text-purple-600">{formatCurrency(cliente.reinvestimentos)}</span>
                                      </div>
                                      <div className="flex justify-between mt-1">
                                        <span className="text-muted-foreground">A Receber:</span>
                                        <span className="font-semibold text-amber-600">{formatCurrency(cliente.aReceber)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-background rounded-lg border p-4">
                                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <RefreshCw className="h-4 w-4 text-purple-500" />
                                    Cálculo
                                  </h4>
                                  <div className="text-sm space-y-1 text-muted-foreground">
                                    <p>Parcelas do Mês = {formatCurrency(cliente.parcelasDoMes)}</p>
                                    <p>(-) Reinvestimentos = {formatCurrency(cliente.reinvestimentos)}</p>
                                    <p className="border-t pt-1 mt-1">
                                      <span className="font-medium text-foreground">
                                        {cliente.aPagar > 0 ? (
                                          <>= A Pagar: <span className="text-green-600">{formatCurrency(cliente.aPagar)}</span></>
                                        ) : cliente.aReceber > 0 ? (
                                          <>= A Receber: <span className="text-amber-600">{formatCurrency(cliente.aReceber)}</span></>
                                        ) : (
                                          "= Zerado"
                                        )}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}

                  {/* Linha de totais */}
                  <TableRow className="bg-muted/70 font-semibold border-t-2">
                    <TableCell></TableCell>
                    <TableCell colSpan={2}>TOTAIS</TableCell>
                    <TableCell className="text-right">{formatCurrency(totais.entradas)}</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right text-green-600">{formatCurrency(totais.saidas)}</TableCell>
                    <TableCell className="text-right text-purple-600">{formatCurrency(totais.reinvestimentos)}</TableCell>
                    <TableCell className="text-right text-amber-600">{formatCurrency(totais.aReceber)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
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
