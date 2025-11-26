import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AcordoDetalhesModal } from "@/components/AcordoDetalhesModal";
import { 
  Calendar, 
  Clock, 
  AlertCircle, 
  Lock, 
  CheckCircle, 
  Zap,
  ChevronDown,
  ChevronRight,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock data
const mockData = {
  vencimentos: 125000,
  aguardandoDestinacao: 45000,
  atencaoNecessaria: 15000,
  comprometido: 60000,
  liquidado: 35000,
  clientes: [
    {
      id: "1",
      nome: "João Silva",
      cpf: "123.456.789-00",
      saldoVencido: 15000,
      aVencer: 25000,
      qtdAcordos: 3,
      parcelas: [
        { acordoId: "#102", referencia: "Mar/2024", valor: 5000, vencimento: "28/11/2024" },
        { acordoId: "#105", referencia: "Abr/2024", valor: 10000, vencimento: "28/11/2024" },
        { acordoId: "#108", referencia: "Mai/2024", valor: 10000, vencimento: "28/11/2024" }
      ]
    },
    {
      id: "2",
      nome: "Maria Santos",
      cpf: "987.654.321-00",
      saldoVencido: 8000,
      aVencer: 12000,
      qtdAcordos: 2,
      parcelas: [
        { acordoId: "#103", referencia: "Mar/2024", valor: 8000, vencimento: "28/11/2024" },
        { acordoId: "#106", referencia: "Abr/2024", valor: 12000, vencimento: "28/11/2024" }
      ]
    },
    {
      id: "3",
      nome: "Pedro Oliveira",
      cpf: "456.789.123-00",
      saldoVencido: 22000,
      aVencer: 18000,
      qtdAcordos: 4,
      parcelas: [
        { acordoId: "#101", referencia: "Fev/2024", valor: 5000, vencimento: "28/11/2024" },
        { acordoId: "#104", referencia: "Mar/2024", valor: 7000, vencimento: "28/11/2024" },
        { acordoId: "#107", referencia: "Abr/2024", valor: 10000, vencimento: "28/11/2024" },
        { acordoId: "#109", referencia: "Mai/2024", valor: 18000, vencimento: "28/11/2024" }
      ]
    }
  ]
};

const MesaLiquidacao = () => {
  const [mesSelecionado, setMesSelecionado] = useState("2024-11");
  const [expandedClientes, setExpandedClientes] = useState<string[]>([]);
  const [modalAcordo, setModalAcordo] = useState<{ id: string; numeroAcordo: string; cliente: string; valorTotal: number } | null>(null);
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const toggleCliente = (clienteId: string) => {
    setExpandedClientes(prev => 
      prev.includes(clienteId) 
        ? prev.filter(id => id !== clienteId)
        : [...prev, clienteId]
    );
  };

  const handleReinvestir = (clienteId: string, clienteNome: string) => {
    // Deep link: Redireciona para /dashboard com state
    navigate("/dashboard", {
      state: {
        openNovaAquisicao: true,
        preSelectedClient: {
          id: clienteId,
          nome: clienteNome
        }
      }
    });
  };

  const kpis = [
    {
      title: "Vencimentos",
      value: mockData.vencimentos,
      icon: Calendar,
      borderColor: "border-primary",
      iconColor: "text-primary"
    },
    {
      title: "Aguardando Destinação",
      value: mockData.aguardandoDestinacao,
      icon: Clock,
      borderColor: "border-slate-400",
      iconColor: "text-slate-500"
    },
    {
      title: "Atenção Necessária",
      value: mockData.atencaoNecessaria,
      icon: AlertCircle,
      borderColor: "border-slate-600",
      iconColor: "text-slate-600"
    },
    {
      title: "Comprometido",
      value: mockData.comprometido,
      icon: Lock,
      borderColor: "border-blue-900",
      iconColor: "text-blue-900"
    },
    {
      title: "Liquidado",
      value: mockData.liquidado,
      icon: CheckCircle,
      borderColor: "border-slate-300",
      iconColor: "text-slate-400"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Mesa de Liquidação & Renovações
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Gestão de vencimentos e reinvestimento de ativos
          </p>
        </div>
        <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
          <SelectTrigger className="w-[200px] bg-background border-slate-200 dark:border-slate-800">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024-10">Outubro 2024</SelectItem>
            <SelectItem value="2024-11">Novembro 2024</SelectItem>
            <SelectItem value="2024-12">Dezembro 2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card 
              key={index} 
              className={`border-l-4 ${kpi.borderColor} bg-background border-slate-100 dark:border-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${kpi.iconColor}`} strokeWidth={1.5} />
                  {kpi.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-mono font-semibold text-slate-900 dark:text-slate-100">
                  {formatCurrency(kpi.value)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabela Mestra */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" strokeWidth={1.5} />
            Projeção de Oportunidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 dark:border-slate-800">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="text-slate-700 dark:text-slate-300">Cliente</TableHead>
                <TableHead className="text-slate-700 dark:text-slate-300">Saldo Vencido</TableHead>
                <TableHead className="text-slate-700 dark:text-slate-300">A Vencer (Mês)</TableHead>
                <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Poder de Compra Total</TableHead>
                <TableHead className="text-slate-700 dark:text-slate-300 text-center">Qtd. Acordos</TableHead>
                <TableHead className="text-slate-700 dark:text-slate-300 text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.clientes.map((cliente) => {
                const isExpanded = expandedClientes.includes(cliente.id);
                const poderCompra = cliente.saldoVencido + cliente.aVencer;
                
                return (
                  <>
                    <TableRow 
                      key={cliente.id}
                      className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                    >
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleCliente(cliente.id)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {cliente.nome}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-500">
                            {cliente.cpf}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-slate-700 dark:text-slate-300">
                        {formatCurrency(cliente.saldoVencido)}
                      </TableCell>
                      <TableCell className="font-mono text-slate-700 dark:text-slate-300">
                        {formatCurrency(cliente.aVencer)}
                      </TableCell>
                      <TableCell className="font-mono text-lg font-semibold text-primary">
                        {formatCurrency(poderCompra)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="neutral" className="font-mono">
                          {cliente.qtdAcordos}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => handleReinvestir(cliente.id, cliente.nome)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <Zap className="h-4 w-4 mr-1" strokeWidth={1.5} />
                          Reinvestir
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    {/* Drill-down das parcelas */}
                    {isExpanded && (
                      <TableRow className="border-slate-200 dark:border-slate-800">
                        <TableCell colSpan={7} className="bg-slate-50 dark:bg-slate-900/30 p-0">
                          <div className="p-4 space-y-2">
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-3">
                              Detalhamento das Parcelas:
                            </p>
                            {cliente.parcelas.map((parcela, idx) => (
                              <div 
                                key={idx}
                                className="flex items-center justify-between p-3 bg-background rounded-md border border-slate-200 dark:border-slate-800"
                              >
                                <div className="flex items-center gap-4">
                                  <button 
                                    className="text-sm font-mono text-primary hover:underline"
                                    onClick={() => setModalAcordo({
                                      id: idx.toString(),
                                      numeroAcordo: parcela.acordoId,
                                      cliente: cliente.nome,
                                      valorTotal: parcela.valor
                                    })}
                                  >
                                    {parcela.acordoId}
                                  </button>
                                  <Badge variant="outline" className="text-xs">
                                    Ref: {parcela.referencia}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="text-xs text-slate-500 dark:text-slate-500">
                                    Vence: {parcela.vencimento}
                                  </span>
                                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                                    {formatCurrency(parcela.valor)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AcordoDetalhesModal
        open={!!modalAcordo}
        onOpenChange={(open) => !open && setModalAcordo(null)}
        acordo={modalAcordo}
      />
    </div>
  );
};

export default MesaLiquidacao;
