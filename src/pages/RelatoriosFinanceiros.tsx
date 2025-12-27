import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { exportToExcel, formatCurrencyForExcel } from "@/lib/excelExport";
import { toast } from "sonner";
import { 
  Download, 
  Copy,
  MessageCircle,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { FichaCadastralModal } from "@/components/FichaCadastralModal";

// Dados reais
const mockClientes = [
  { id: "1", nome: "Adnan Ayoub Fabiano", cpf: "363.870.188-38", parcelasDoMes: 100000, novosAcordos: 36000, aPagar: 64000, reinvestimentos: 36000, aReceber: 0, telefone: "11999887766" },
  { id: "2", nome: "Adriano Harari", cpf: "087.491.238-58", parcelasDoMes: 60000, novosAcordos: 16500, aPagar: 43500, reinvestimentos: 16500, aReceber: 0, telefone: "11988776655" },
  { id: "3", nome: "Adriano Pinto Menin", cpf: "216.402.368-48", parcelasDoMes: 20000, novosAcordos: 28000, aPagar: 0, reinvestimentos: 20000, aReceber: 8000, telefone: "11977665544" },
  { id: "4", nome: "Ahmad Kalil Ayoub", cpf: "123.777.878-60", parcelasDoMes: 100000, novosAcordos: 9100, aPagar: 90900, reinvestimentos: 9100, aReceber: 0, telefone: "11966554433" },
  { id: "5", nome: "Alison Bernardes Leal", cpf: "454.082.298-58", parcelasDoMes: 50000, novosAcordos: 0, aPagar: 50000, reinvestimentos: 0, aReceber: 0, telefone: "11955443322" },
  { id: "6", nome: "André Costa Battisti", cpf: "073.042.569-07", parcelasDoMes: 245000, novosAcordos: 151200, aPagar: 93800, reinvestimentos: 151200, aReceber: 0, telefone: "11944332211" },
  { id: "7", nome: "André Jordão", cpf: "419.317.758-00", parcelasDoMes: 50000, novosAcordos: 0, aPagar: 50000, reinvestimentos: 0, aReceber: 0, telefone: "" },
  { id: "8", nome: "Brian Peterson Júlio de Paula Moraes", cpf: "474.820.778-71", parcelasDoMes: 50000, novosAcordos: 11600, aPagar: 38400, reinvestimentos: 11600, aReceber: 0, telefone: "" },
  { id: "9", nome: "Bruno Alfredo Frantz", cpf: "077.419.949-05", parcelasDoMes: 77000, novosAcordos: 72100, aPagar: 4900, reinvestimentos: 72100, aReceber: 0, telefone: "" },
  { id: "10", nome: "Bruno Jorge dos Santos - Fernando", cpf: "229.310.778-79", parcelasDoMes: 50000, novosAcordos: 0, aPagar: 50000, reinvestimentos: 0, aReceber: 0, telefone: "" },
  { id: "11", nome: "Daniel Vieira", cpf: "192.536.547-67", parcelasDoMes: 50000, novosAcordos: 6100, aPagar: 43900, reinvestimentos: 6100, aReceber: 0, telefone: "" },
  { id: "12", nome: "Danilo Zafalon", cpf: "326.107.788-30", parcelasDoMes: 100000, novosAcordos: 51000, aPagar: 49000, reinvestimentos: 51000, aReceber: 0, telefone: "" },
  { id: "13", nome: "Diogo Germano Mendonça", cpf: "092.118.289-96", parcelasDoMes: 110000, novosAcordos: 110900, aPagar: 0, reinvestimentos: 110000, aReceber: 900, telefone: "" },
  { id: "14", nome: "Eduardo Henrique Ribeiro", cpf: "395.455.008-32", parcelasDoMes: 250000, novosAcordos: 483700, aPagar: 0, reinvestimentos: 250000, aReceber: 233700, telefone: "" },
  { id: "15", nome: "Elvis Roberto", cpf: "306.507.648-97", parcelasDoMes: 424000, novosAcordos: 0, aPagar: 424000, reinvestimentos: 0, aReceber: 0, telefone: "" },
  { id: "16", nome: "Fernando Rodrigue da Silva", cpf: "227.717.048-89", parcelasDoMes: 250000, novosAcordos: 273950, aPagar: 2300, reinvestimentos: 247700, aReceber: 26250, telefone: "" },
  { id: "17", nome: "Gabriel Franco da Silveira Neto", cpf: "094.637.218-78", parcelasDoMes: 100000, novosAcordos: 32000, aPagar: 68000, reinvestimentos: 32000, aReceber: 0, telefone: "" },
  { id: "18", nome: "Gisleine Garcia Jacinto - Adriano", cpf: "280.106.448-38", parcelasDoMes: 20000, novosAcordos: 36500, aPagar: 0, reinvestimentos: 20000, aReceber: 16500, telefone: "" },
  { id: "19", nome: "Guilherme Pitarello", cpf: "043.099.263-80", parcelasDoMes: 79000, novosAcordos: 24000, aPagar: 55000, reinvestimentos: 24000, aReceber: 0, telefone: "" },
  { id: "20", nome: "Jeffrey Christopher de Oliveira Jardim Coelho", cpf: "331.151.478-56", parcelasDoMes: 40000, novosAcordos: 85600, aPagar: 0, reinvestimentos: 40000, aReceber: 45600, telefone: "" },
  { id: "21", nome: "Jhonata Maiko Prevelato", cpf: "411.455.648-60", parcelasDoMes: 50000, novosAcordos: 20000, aPagar: 30000, reinvestimentos: 20000, aReceber: 0, telefone: "" },
  { id: "22", nome: "João Henrique Pasqual Machado", cpf: "013.558.910-00", parcelasDoMes: 80000, novosAcordos: 19100, aPagar: 60900, reinvestimentos: 19100, aReceber: 0, telefone: "" },
  { id: "23", nome: "João Paulo Perin - Martan", cpf: "066.361.179-23", parcelasDoMes: 250000, novosAcordos: 308300, aPagar: 0, reinvestimentos: 250000, aReceber: 58300, telefone: "" },
  { id: "24", nome: "Kaua Nascimento Vicente", cpf: "430.089.048-07", parcelasDoMes: 30000, novosAcordos: 18100, aPagar: 11900, reinvestimentos: 18100, aReceber: 0, telefone: "" },
  { id: "25", nome: "Lucas Borges Mendes - Luan", cpf: "092.348.269-57", parcelasDoMes: 50000, novosAcordos: 0, aPagar: 50000, reinvestimentos: 0, aReceber: 0, telefone: "" },
  { id: "26", nome: "Lucas Dituri", cpf: "354.823.658-83", parcelasDoMes: 50000, novosAcordos: 0, aPagar: 50000, reinvestimentos: 0, aReceber: 0, telefone: "" },
  { id: "27", nome: "Lucas Triques", cpf: "", parcelasDoMes: 140000, novosAcordos: 32100, aPagar: 107900, reinvestimentos: 32100, aReceber: 0, telefone: "" },
  { id: "28", nome: "Marcelo de Medeiros Ferreira - Felipe", cpf: "027.759.088-45", parcelasDoMes: 40000, novosAcordos: 58100, aPagar: 0, reinvestimentos: 40000, aReceber: 18100, telefone: "" },
  { id: "29", nome: "Marco Aurélio Salviato Maximino", cpf: "315.514.558-70", parcelasDoMes: 100000, novosAcordos: 18000, aPagar: 82000, reinvestimentos: 18000, aReceber: 0, telefone: "" },
  { id: "30", nome: "Marcos Anderson Ferreira Rego", cpf: "663.193.742-68", parcelasDoMes: 500000, novosAcordos: 328500, aPagar: 224000, reinvestimentos: 276000, aReceber: 0, telefone: "" },
  { id: "31", nome: "Maryse dos Santos Fila Pitarello", cpf: "168.044.768-83", parcelasDoMes: 100000, novosAcordos: 48600, aPagar: 51400, reinvestimentos: 48600, aReceber: 0, telefone: "" },
  { id: "32", nome: "Mauricio Rodrigues Furquim", cpf: "052.010.690-37", parcelasDoMes: 50000, novosAcordos: 55600, aPagar: 30600, reinvestimentos: 19400, aReceber: 36200, telefone: "" },
  { id: "33", nome: "Nádia Teresa Bertanha Luvizotti", cpf: "352.470.088-80", parcelasDoMes: 200000, novosAcordos: 43000, aPagar: 157000, reinvestimentos: 43000, aReceber: 0, telefone: "" },
  { id: "34", nome: "Nathan Fortes - Martan Clientes", cpf: "408.758.958-75", parcelasDoMes: 90000, novosAcordos: 0, aPagar: 100000, reinvestimentos: 0, aReceber: 0, telefone: "" },
  { id: "35", nome: "Neile Maria Bertanha Luvizotti", cpf: "191.940.908-40", parcelasDoMes: 40000, novosAcordos: 13500, aPagar: 26500, reinvestimentos: 13500, aReceber: 0, telefone: "" },
  { id: "36", nome: "Nicole", cpf: "", parcelasDoMes: 160000, novosAcordos: 0, aPagar: 160000, reinvestimentos: 0, aReceber: 0, telefone: "" },
  { id: "37", nome: "Paulo Leonel Weber Filho", cpf: "037.546.440-92", parcelasDoMes: 40000, novosAcordos: 53300, aPagar: 0, reinvestimentos: 40000, aReceber: 13300, telefone: "" },
  { id: "38", nome: "Pedro Greco", cpf: "363.309.428-89", parcelasDoMes: 50000, novosAcordos: 110250, aPagar: 0, reinvestimentos: 50000, aReceber: 60250, telefone: "" },
  { id: "39", nome: "Pedro Remolli", cpf: "100.015.166-20", parcelasDoMes: 40000, novosAcordos: 25000, aPagar: 15000, reinvestimentos: 25000, aReceber: 0, telefone: "" },
  { id: "40", nome: "Rhaylander Gusmão Cora Francisco", cpf: "412.157.748-50", parcelasDoMes: 35000, novosAcordos: 34500, aPagar: 500, reinvestimentos: 34500, aReceber: 0, telefone: "" },
  { id: "41", nome: "Rudson Cristiano San Martin Alves", cpf: "050.152.570-07", parcelasDoMes: 80000, novosAcordos: 11600, aPagar: 68400, reinvestimentos: 11600, aReceber: 0, telefone: "" },
  { id: "42", nome: "Sebastião Carlos de Lucca (Xerife)", cpf: "717.851.248-20", parcelasDoMes: 112000, novosAcordos: 99000, aPagar: 13000, reinvestimentos: 99000, aReceber: 0, telefone: "" },
  { id: "43", nome: "Sergio Pitarello", cpf: "", parcelasDoMes: 290000, novosAcordos: 0, aPagar: 290000, reinvestimentos: 0, aReceber: 0, telefone: "" },
  { id: "44", nome: "Thais Fernanda Clemonesi", cpf: "352.786.638-80", parcelasDoMes: 20000, novosAcordos: 6100, aPagar: 13900, reinvestimentos: 6100, aReceber: 0, telefone: "" },
  { id: "45", nome: "Victor Oliveira Goncalves - Eduardo", cpf: "388.802.588-50", parcelasDoMes: 100000, novosAcordos: 25000, aPagar: 75000, reinvestimentos: 25000, aReceber: 0, telefone: "" },
  { id: "46", nome: "Vinicius de Lucca", cpf: "386.596.538-58", parcelasDoMes: 28000, novosAcordos: 28100, aPagar: 0, reinvestimentos: 28000, aReceber: 100, telefone: "" },
  { id: "47", nome: "Willian Rodrigo Felipe - Primo Adnan", cpf: "357.203.868-58", parcelasDoMes: 20000, novosAcordos: 0, aPagar: 20000, reinvestimentos: 0, aReceber: 0, telefone: "" },
  { id: "48", nome: "Wish", cpf: "", parcelasDoMes: 50000, novosAcordos: 0, aPagar: 50000, reinvestimentos: 0, aReceber: 0, telefone: "" },
  { id: "49", nome: "André Luiz Mattar", cpf: "055.012.588-46", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 13500, telefone: "" },
  { id: "50", nome: "André Rompa", cpf: "", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 522800, telefone: "" },
  { id: "51", nome: "Beatriz Pantioni Alegre", cpf: "390.111.678-80", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 90700, telefone: "" },
  { id: "52", nome: "Bruna Silva de Souza", cpf: "094.388.356-36", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 6100, telefone: "" },
  { id: "53", nome: "Bruno Meurer", cpf: "093.671.249-02", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 8500, telefone: "" },
  { id: "54", nome: "Bruno Missiato", cpf: "408.874.848-40", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 37200, telefone: "" },
  { id: "55", nome: "Carlos Alberto Alencar Ferreira", cpf: "765.375.793-68", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 5500, telefone: "" },
  { id: "56", nome: "Cleyton Vinicius Sell", cpf: "092.416.319-45", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 55500, telefone: "" },
  { id: "57", nome: "Daniel Rudolf Spindler Aguiar Batalha", cpf: "119.631.757-78", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 45500, telefone: "" },
  { id: "58", nome: "Elton José Tendolini", cpf: "208.880.628-93", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 17000, telefone: "" },
  { id: "59", nome: "Fabio Henrique Lepre", cpf: "422.330.058-05", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 5500, telefone: "" },
  { id: "60", nome: "Fernanda Marques Saraiva", cpf: "007.045.483-30", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 7900, telefone: "" },
  { id: "61", nome: "Herbert Marcos Pereira", cpf: "337.282.138-61", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 53000, telefone: "" },
  { id: "62", nome: "Iesus Jefferson Tadeu de Assis Guião", cpf: "383.600.378-33", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 17900, telefone: "" },
  { id: "63", nome: "Julio Cesar da Silva Campos", cpf: "325.082.598-02", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 13500, telefone: "" },
  { id: "64", nome: "Júlia Maria Barreira", cpf: "443.040.638-39", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 11500, telefone: "" },
  { id: "65", nome: "Kleber Henrique Gomes Luz", cpf: "407.976.168-61", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 8500, telefone: "" },
  { id: "66", nome: "Marco Augusto Colussi", cpf: "340.345.848-23", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 6100, telefone: "" },
  { id: "67", nome: "Martan Berce Medeiros da Costa", cpf: "459.874.748-09", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 66500, telefone: "" },
  { id: "68", nome: "Matheus Daros Nessler", cpf: "094.807.469-80", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 5500, telefone: "" },
  { id: "69", nome: "Michelly Pacheco Piantonni", cpf: "261.827.498-90", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 20100, telefone: "" },
  { id: "70", nome: "Neide Guimaraes", cpf: "", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 8500, telefone: "" },
  { id: "71", nome: "Nicolas Marques Bressan", cpf: "072.161.289-07", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 19000, telefone: "" },
  { id: "72", nome: "Oswaldo Bortoletto Junior", cpf: "042.072.758-27", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 11500, telefone: "" },
  { id: "73", nome: "Rafael de Mello", cpf: "351.860.018-48", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 15100, telefone: "" },
  { id: "74", nome: "Rafael Luis Nunes Safra", cpf: "258.837.098-50", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 9500, telefone: "" },
  { id: "75", nome: "Ricardo Salvador Crupi", cpf: "298.725.638-88", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 25500, telefone: "" },
  { id: "76", nome: "Rubens Perez Calegari", cpf: "068.241.369-05", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 11600, telefone: "" },
  { id: "77", nome: "Thais Fernanda Vicente Silva", cpf: "472.830.208-37", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 8500, telefone: "" },
  { id: "78", nome: "Weskley Gomes de Souza", cpf: "356.434.228-16", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 8500, telefone: "" },
  { id: "79", nome: "Wilson Ferreira dos Santos Junior", cpf: "085.336.246-70", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 5500, telefone: "" },
  { id: "80", nome: "Laercio", cpf: "", parcelasDoMes: 0, novosAcordos: 0, aPagar: 0, reinvestimentos: 0, aReceber: 25500, telefone: "" },
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
  if (value === 0) return "-";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const formatCurrencyTotal = (value: number) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export default function RelatoriosFinanceiros() {
  const [mesSelecionado, setMesSelecionado] = useState("12");
  const [anoSelecionado, setAnoSelecionado] = useState("2024");
  const [clienteSelecionado, setClienteSelecionado] = useState<typeof mockClientes[0] | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [ordenacaoAsc, setOrdenacaoAsc] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "pagamentos" | "recebimentos">("todos");

  const handleOpenFicha = (cliente: typeof mockClientes[0]) => {
    setClienteSelecionado(cliente);
    setModalAberto(true);
  };

  // Filtrar e ordenar clientes
  const clientesFiltrados = mockClientes
    .filter((cliente) => {
      const termo = busca.toLowerCase();
      const matchBusca = cliente.nome.toLowerCase().includes(termo) ||
        cliente.cpf.toLowerCase().includes(termo);
      
      if (!matchBusca) return false;
      
      if (filtroStatus === "pagamentos") {
        return cliente.aPagar > 0;
      }
      if (filtroStatus === "recebimentos") {
        return cliente.aReceber > 0;
      }
      return true;
    })
    .sort((a, b) => {
      const comparison = a.nome.localeCompare(b.nome, "pt-BR");
      return ordenacaoAsc ? comparison : -comparison;
    });

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

  const handleCopyPix = (cpf: string, nome: string) => {
    if (!cpf) {
      toast.error("CPF não cadastrado");
      return;
    }
    navigator.clipboard.writeText(cpf.replace(/\D/g, ""));
    toast.success(`Chave PIX de ${nome.split(" ")[0]} copiada!`);
  };

  const handleWhatsApp = (cliente: typeof mockClientes[0]) => {
    if (!cliente.telefone) {
      toast.error("Telefone não cadastrado");
      return;
    }
    const numero = cliente.telefone.replace(/\D/g, "");
    const primeiroNome = cliente.nome.split(" ")[0];
    
    let mensagem = `Olá ${primeiroNome}! 👋\n\nSegue o resumo financeiro do mês:\n\n`;
    
    if (cliente.parcelasDoMes > 0) {
      mensagem += `📊 *Parcelas do Mês:* ${formatCurrency(cliente.parcelasDoMes)}\n`;
    }
    if (cliente.aPagar > 0) {
      mensagem += `✅ *A Pagar (você recebe):* ${formatCurrency(cliente.aPagar)}\n`;
    }
    if (cliente.aReceber > 0) {
      mensagem += `⚠️ *A Receber (pendente):* ${formatCurrency(cliente.aReceber)}\n`;
    }
    if (cliente.reinvestimentos > 0) {
      mensagem += `🔄 *Reinvestimentos:* ${formatCurrency(cliente.reinvestimentos)}\n`;
    }
    
    mensagem += `\nQualquer dúvida estamos à disposição!`;
    
    const mensagemEncoded = encodeURIComponent(mensagem);
    window.open(`https://wa.me/55${numero}?text=${mensagemEncoded}`, "_blank");
  };

  const handleExportExcel = () => {
    const mesNome = meses.find((m) => m.value === mesSelecionado)?.label || mesSelecionado;

    const resumoData = mockClientes.map((cliente) => ({
      "Nome": cliente.nome,
      "CPF": cliente.cpf || "-",
      "Parcelas do Mês (R$)": formatCurrencyForExcel(cliente.parcelasDoMes),
      "Novos Acordos (R$)": formatCurrencyForExcel(cliente.novosAcordos),
      "A Pagar (R$)": formatCurrencyForExcel(cliente.aPagar),
      "A Receber (R$)": formatCurrencyForExcel(cliente.aReceber),
      "Reinvestimentos (R$)": formatCurrencyForExcel(cliente.reinvestimentos),
    }));

    resumoData.push({
      "Nome": "TOTAL",
      "CPF": "",
      "Parcelas do Mês (R$)": formatCurrencyForExcel(totais.entradas),
      "Novos Acordos (R$)": "",
      "A Pagar (R$)": formatCurrencyForExcel(totais.saidas),
      "A Receber (R$)": formatCurrencyForExcel(totais.aReceber),
      "Reinvestimentos (R$)": formatCurrencyForExcel(totais.reinvestimentos),
    });

    exportToExcel(
      [{ name: "Relatório Financeiro", data: resumoData }],
      `relatorio_financeiro_${mesNome.toLowerCase()}_${anoSelecionado}.xlsx`
    );
  };

  const mesNome = meses.find((m) => m.value === mesSelecionado)?.label || mesSelecionado;

  return (
    <TooltipProvider>
      <div className="p-6 space-y-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Relatórios Financeiros
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Consolidado mensal • {mesNome} {anoSelecionado}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
              <SelectTrigger className="w-32 h-9 text-sm">
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
              <SelectTrigger className="w-20 h-9 text-sm">
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
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportExcel}
              className="h-9"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* KPI Cards - Big Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="border bg-card">
            <CardContent className="pt-6 pb-6">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Total de Entradas
              </p>
              <p className="text-2xl font-semibold font-mono text-emerald-600">
                {formatCurrencyTotal(totais.entradas)}
              </p>
            </CardContent>
          </Card>

          <Card className="border bg-card">
            <CardContent className="pt-6 pb-6">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Total de Saídas
              </p>
              <p className="text-2xl font-semibold font-mono text-red-500">
                {formatCurrencyTotal(totais.saidas)}
              </p>
            </CardContent>
          </Card>

          <Card className="border bg-card">
            <CardContent className="pt-6 pb-6">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Total de Reinvestimentos
              </p>
              <p className="text-2xl font-semibold font-mono text-foreground">
                {formatCurrencyTotal(totais.reinvestimentos)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Sort */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-muted-foreground">
            {clientesFiltrados.length} de {mockClientes.length} clientes
          </span>
          <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou CPF..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Select value={filtroStatus} onValueChange={(value: "todos" | "pagamentos" | "recebimentos") => setFiltroStatus(value)}>
            <SelectTrigger className="w-40 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pagamentos">Só Pagamentos</SelectItem>
              <SelectItem value="recebimentos">Só Recebimentos</SelectItem>
            </SelectContent>
            </Select>
          </div>
        </div>

        {/* Data Table */}
        <Card className="border bg-card">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow className="border-b hover:bg-transparent">
                  <TableHead className="text-slate-700 dark:text-slate-300 font-medium w-[220px]">
                    <button
                      onClick={() => setOrdenacaoAsc(!ordenacaoAsc)}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      Nome
                      <ArrowUpDown className="h-3.5 w-3.5" />
                      <span className="text-xs text-muted-foreground">({ordenacaoAsc ? "A-Z" : "Z-A"})</span>
                    </button>
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-medium w-[140px]">
                    CPF
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-medium text-right w-[120px]">
                    Parcelas Mês
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-medium text-right w-[120px]">
                    Novos Acordos
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-medium text-right w-[120px]">
                    A Pagar
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-medium text-right w-[120px]">
                    A Receber
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-medium text-right w-[120px]">
                    Reinvest.
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-medium text-center w-[50px]">
                    PIX
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-medium text-center w-[50px]">
                    Msg
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientesFiltrados.map((cliente) => (
                  <TableRow 
                    key={cliente.id} 
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium text-slate-900 dark:text-slate-100 py-4">
                      <button
                        onClick={() => handleOpenFicha(cliente)}
                        className="text-left hover:text-primary hover:underline underline-offset-2 transition-colors cursor-pointer"
                      >
                        {cliente.nome}
                      </button>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 dark:text-slate-400 font-mono py-4">
                      {cliente.cpf || "-"}
                    </TableCell>
                    <TableCell className="text-right font-mono py-4">
                      {formatCurrency(cliente.parcelasDoMes)}
                    </TableCell>
                    <TableCell className="text-right font-mono py-4">
                      {formatCurrency(cliente.novosAcordos)}
                    </TableCell>
                    <TableCell className={`text-right font-mono py-4 ${cliente.aPagar > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
                      {formatCurrency(cliente.aPagar)}
                    </TableCell>
                    <TableCell className={`text-right font-mono py-4 ${cliente.aReceber > 0 ? "text-red-500 dark:text-red-400" : "text-slate-500 dark:text-slate-400"}`}>
                      {formatCurrency(cliente.aReceber)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-slate-700 dark:text-slate-300 py-4">
                      {formatCurrency(cliente.reinvestimentos)}
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleCopyPix(cliente.cpf, cliente.nome)}
                            disabled={!cliente.cpf}
                          >
                            <Copy className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {cliente.cpf ? "Copiar PIX (CPF)" : "CPF não cadastrado"}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleWhatsApp(cliente)}
                            disabled={!cliente.telefone}
                          >
                            <MessageCircle className={`h-4 w-4 ${cliente.telefone ? "text-emerald-600" : "text-muted-foreground"}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {cliente.telefone ? "Abrir WhatsApp" : "Telefone não cadastrado"}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

                {/* Linha de Total */}
                <TableRow className="bg-muted/30 border-t-2 font-semibold hover:bg-muted/30">
                  <TableCell className="py-4 text-foreground">TOTAL</TableCell>
                  <TableCell className="py-4"></TableCell>
                  <TableCell className="text-right font-mono py-4">
                    {formatCurrencyTotal(totais.entradas)}
                  </TableCell>
                  <TableCell className="py-4"></TableCell>
                  <TableCell className="text-right font-mono py-4 text-emerald-600">
                    {formatCurrencyTotal(totais.saidas)}
                  </TableCell>
                  <TableCell className="text-right font-mono py-4 text-red-500">
                    {formatCurrencyTotal(totais.aReceber)}
                  </TableCell>
                  <TableCell className="text-right font-mono py-4">
                    {formatCurrencyTotal(totais.reinvestimentos)}
                  </TableCell>
                  <TableCell className="py-4"></TableCell>
                  <TableCell className="py-4"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>

        {/* Modal Ficha Cadastral */}
        <FichaCadastralModal
          open={modalAberto}
          onOpenChange={setModalAberto}
          cliente={clienteSelecionado ? {
            id: clienteSelecionado.id,
            nome: clienteSelecionado.nome,
            telefone: clienteSelecionado.telefone || undefined,
            totalInvestido: clienteSelecionado.parcelasDoMes,
            totalAcordos: clienteSelecionado.novosAcordos > 0 ? 1 : 0,
            saldoDisponivel: clienteSelecionado.aReceber,
            observacoesPendencias: clienteSelecionado.aPagar > 0 ? `Pendência de R$ ${clienteSelecionado.aPagar.toLocaleString('pt-BR')}` : ""
          } : null}
        />
      </div>
    </TooltipProvider>
  );
}
