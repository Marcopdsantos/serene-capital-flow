import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, CheckCircle, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface Comissao {
  id: string;
  nomeAgente: string;
  clienteIndicado: string;
  valorComissao: number;
  dataVenda: string;
  status: "pendente" | "pago";
  dataBaixa?: string;
}

const mockComissoes: Comissao[] = [
  {
    id: "1",
    nomeAgente: "Carlos Vendedor",
    clienteIndicado: "Maria Costa",
    valorComissao: 2500,
    dataVenda: "15/11/2024",
    status: "pendente",
  },
  {
    id: "2",
    nomeAgente: "Juliana Corretora",
    clienteIndicado: "Pedro Santos",
    valorComissao: 5000,
    dataVenda: "10/11/2024",
    status: "pago",
    dataBaixa: "12/11/2024",
  },
  {
    id: "3",
    nomeAgente: "Roberto Agente",
    clienteIndicado: "Ana Silva",
    valorComissao: 5000,
    dataVenda: "05/11/2024",
    status: "pago",
    dataBaixa: "07/11/2024",
  },
  {
    id: "4",
    nomeAgente: "Carlos Vendedor",
    clienteIndicado: "João Oliveira",
    valorComissao: 3000,
    dataVenda: "20/11/2024",
    status: "pendente",
  },
];

const ComissoesAgentes = () => {
  const [comissoes, setComissoes] = useState<Comissao[]>(mockComissoes);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleConfirmarPagamento = (id: string) => {
    setComissoes(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              status: "pago" as const,
              dataBaixa: new Date().toLocaleDateString("pt-BR"),
            }
          : c
      )
    );
    toast.success("Pagamento confirmado", {
      description: "Comissão marcada como paga com sucesso.",
    });
  };

  const comissoesFiltradas = comissoes.filter(comissao => {
    const matchBusca =
      comissao.nomeAgente.toLowerCase().includes(busca.toLowerCase()) ||
      comissao.clienteIndicado.toLowerCase().includes(busca.toLowerCase());

    const matchStatus =
      filtroStatus === "todos" || comissao.status === filtroStatus;

    return matchBusca && matchStatus;
  });

  const totalPendente = comissoes
    .filter(c => c.status === "pendente")
    .reduce((sum, c) => sum + c.valorComissao, 0);

  const totalPago = comissoes
    .filter(c => c.status === "pago")
    .reduce((sum, c) => sum + c.valorComissao, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Comissões de Agentes
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Gestão simplificada de contas a pagar para agentes comissionados
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-l-4 border-slate-400 bg-background border-slate-100 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" strokeWidth={1.5} />
              Comissões Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-mono font-semibold text-slate-900 dark:text-slate-100">
              {formatCurrency(totalPendente)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              {comissoes.filter(c => c.status === "pendente").length} pagamentos aguardando
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-primary bg-background border-slate-100 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" strokeWidth={1.5} />
              Comissões Pagas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-mono font-semibold text-slate-900 dark:text-slate-100">
              {formatCurrency(totalPago)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              {comissoes.filter(c => c.status === "pago").length} pagamentos concluídos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por agente ou cliente..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela de Contas a Pagar */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-slate-600 dark:text-slate-400" strokeWidth={1.5} />
            Contas a Pagar
          </CardTitle>
          <CardDescription>
            Listagem de comissões devidas a agentes intermediadores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 dark:border-slate-800">
                <TableHead className="text-slate-700 dark:text-slate-300">
                  Nome do Agente
                </TableHead>
                <TableHead className="text-slate-700 dark:text-slate-300">
                  Cliente Indicado
                </TableHead>
                <TableHead className="text-slate-700 dark:text-slate-300">
                  Valor Comissão
                </TableHead>
                <TableHead className="text-slate-700 dark:text-slate-300">
                  Data Venda
                </TableHead>
                <TableHead className="text-slate-700 dark:text-slate-300">
                  Status
                </TableHead>
                <TableHead className="text-slate-700 dark:text-slate-300 text-right">
                  Ação
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comissoesFiltradas.map(comissao => (
                <TableRow
                  key={comissao.id}
                  className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                >
                  <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                    {comissao.nomeAgente}
                  </TableCell>
                  <TableCell className="text-slate-700 dark:text-slate-300">
                    {comissao.clienteIndicado}
                  </TableCell>
                  <TableCell className="font-mono font-semibold text-primary">
                    {formatCurrency(comissao.valorComissao)}
                  </TableCell>
                  <TableCell className="text-slate-700 dark:text-slate-300">
                    {comissao.dataVenda}
                  </TableCell>
                  <TableCell>
                    {comissao.status === "pago" ? (
                      <div className="space-y-1">
                        <Badge variant="default" className="bg-primary text-primary-foreground">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Pago
                        </Badge>
                        {comissao.dataBaixa && (
                          <p className="text-xs text-slate-500">
                            Baixa: {comissao.dataBaixa}
                          </p>
                        )}
                      </div>
                    ) : (
                      <Badge variant="outline" className="border-slate-400 text-slate-600">
                        <Clock className="h-3 w-3 mr-1" />
                        Pendente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {comissao.status === "pendente" ? (
                      <Button
                        size="sm"
                        onClick={() => handleConfirmarPagamento(comissao.id)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Confirmar Pagamento
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-500 dark:text-slate-500">
                        Concluído
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {comissoesFiltradas.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma comissão encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComissoesAgentes;
