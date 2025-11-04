import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, CheckCircle2, Clock, AlertTriangle, Eye, Upload, Pencil } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type StatusType = "aguardando_assinatura" | "aguardando_comprovante" | "pendente_conciliacao" | "ativo";
type TipoPagamento = "pix" | "saldo_interno" | "misto";

interface Aquisicao {
  id: string;
  comprador: string;
  aporte: string;
  detalhePagamento: string;
  tipoPagamento: TipoPagamento;
  status: StatusType;
  notas: string;
  mesReferencia: string;
  dataInicio: string;
}

const statusConfig = {
  aguardando_assinatura: {
    label: "Aguardando Assinatura",
    color: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30",
    icon: Clock,
    acao: "Enviar Contrato",
  },
  aguardando_comprovante: {
    label: "Aguardando Comprovante",
    color: "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
    icon: Upload,
    acao: "Anexar Comprovante",
  },
  pendente_conciliacao: {
    label: "Pendente Conciliação",
    color: "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30",
    icon: AlertTriangle,
    acao: "Conciliar Pagamento",
    acaoAlternativa: "Conciliar Saldo Interno",
  },
  ativo: {
    label: "Ativo",
    color: "bg-success/20 text-success-foreground border-success/30",
    icon: CheckCircle2,
    acao: "Ver Detalhes",
  },
};

// Dados mock - substituir por dados reais do backend
const aquisicoesData: Aquisicao[] = [
  {
    id: "1",
    comprador: "Antônio Braga",
    aporte: "R$ 38.000",
    detalhePagamento: "R$ 10k Saldo + R$ 28k PIX",
    tipoPagamento: "misto",
    status: "pendente_conciliacao",
    notas: "Pix pago, aguardando compensação",
    mesReferencia: "2024-10",
    dataInicio: "2024-10-15",
  },
  {
    id: "2",
    comprador: "Maria Silva",
    aporte: "R$ 50.000",
    detalhePagamento: "R$ 50k PIX",
    tipoPagamento: "pix",
    status: "aguardando_assinatura",
    notas: "Pix até dia 23",
    mesReferencia: "2024-10",
    dataInicio: "2024-10-18",
  },
  {
    id: "3",
    comprador: "João Santos",
    aporte: "R$ 100.000",
    detalhePagamento: "R$ 100k Saldo Interno",
    tipoPagamento: "saldo_interno",
    status: "ativo",
    notas: "Acordo ativo desde 01/10",
    mesReferencia: "2024-10",
    dataInicio: "2024-10-01",
  },
  {
    id: "4",
    comprador: "Pedro Oliveira",
    aporte: "R$ 75.000",
    detalhePagamento: "R$ 25k Saldo + R$ 50k PIX",
    tipoPagamento: "misto",
    status: "aguardando_comprovante",
    notas: "Saldo + Pix ainda não fez",
    mesReferencia: "2024-10",
    dataInicio: "2024-10-20",
  },
  {
    id: "5",
    comprador: "Ana Costa",
    aporte: "R$ 120.000",
    detalhePagamento: "R$ 120k PIX",
    tipoPagamento: "pix",
    status: "pendente_conciliacao",
    notas: "Já pagou, peguei cheques",
    mesReferencia: "2024-11",
    dataInicio: "2024-11-05",
  },
];

export const FilaAquisicoesTab = () => {
  const [mesSelecionado, setMesSelecionado] = useState("2024-10");
  const [filtroStatus, setFiltroStatus] = useState<StatusType | "todos">("todos");
  const [notas, setNotas] = useState<Record<string, string>>(
    aquisicoesData.reduce((acc, aq) => ({ ...acc, [aq.id]: aq.notas }), {})
  );
  const [editandoNota, setEditandoNota] = useState<string | null>(null);

  // Filtra aquisições por mês
  const aquisicoesPorMes = aquisicoesData.filter((aq) => aq.mesReferencia === mesSelecionado);

  // Filtra aquisições por status
  const aquisicoesFiltradas =
    filtroStatus === "todos" ? aquisicoesPorMes : aquisicoesPorMes.filter((aq) => aq.status === filtroStatus);

  const contadores = {
    todos: aquisicoesPorMes.length,
    aguardando_assinatura: aquisicoesPorMes.filter((aq) => aq.status === "aguardando_assinatura").length,
    aguardando_comprovante: aquisicoesPorMes.filter((aq) => aq.status === "aguardando_comprovante").length,
    pendente_conciliacao: aquisicoesPorMes.filter((aq) => aq.status === "pendente_conciliacao").length,
    ativo: aquisicoesPorMes.filter((aq) => aq.status === "ativo").length,
  };

  const salvarNota = (id: string, texto: string) => {
    setNotas((prev) => ({ ...prev, [id]: texto }));
    setEditandoNota(null);
  };

  const handleAcao = (aquisicao: Aquisicao) => {
    const config = statusConfig[aquisicao.status];
    const acaoLabel =
      aquisicao.status === "pendente_conciliacao" && aquisicao.tipoPagamento === "saldo_interno"
        ? statusConfig.pendente_conciliacao.acaoAlternativa
        : config.acao;

    toast({
      description: `Ação "${acaoLabel}" executada para ${aquisicao.comprador}`,
      duration: 3000,
    });

    // Aqui você implementaria a lógica real de cada ação
    console.log(`Ação: ${acaoLabel}`, aquisicao);
  };

  const getMesLabel = (mesRef: string) => {
    const [ano, mes] = mesRef.split("-");
    const meses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return `${meses[parseInt(mes) - 1]} ${ano}`;
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-sans font-bold">🗂️ Fila de Aquisições do Mês</CardTitle>
            <CardDescription>
              Gerencie todas as aquisições iniciadas no mês selecionado — substitui a planilha manual
            </CardDescription>
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
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tabs de Filtro de Status */}
        <Tabs value={filtroStatus} onValueChange={(v) => setFiltroStatus(v as StatusType | "todos")}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="todos" className="text-xs">
              Todos ({contadores.todos})
            </TabsTrigger>
            <TabsTrigger value="aguardando_assinatura" className="text-xs">
              🟡 Assinatura ({contadores.aguardando_assinatura})
            </TabsTrigger>
            <TabsTrigger value="aguardando_comprovante" className="text-xs">
              🔵 Comprovante ({contadores.aguardando_comprovante})
            </TabsTrigger>
            <TabsTrigger value="pendente_conciliacao" className="text-xs">
              🟠 Conciliação ({contadores.pendente_conciliacao})
            </TabsTrigger>
            <TabsTrigger value="ativo" className="text-xs">
              ✅ Ativos ({contadores.ativo})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Resumo do Mês Selecionado */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30">
          <p className="text-sm font-medium">
            📆 {getMesLabel(mesSelecionado)}: {aquisicoesFiltradas.length} aquisições{" "}
            {filtroStatus !== "todos" && `(filtro: ${statusConfig[filtroStatus as StatusType].label})`}
          </p>
        </div>

        {/* Tabela de Aquisições */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Comprador (Cliente)</TableHead>
                <TableHead className="font-semibold">Aporte (Acordo)</TableHead>
                <TableHead className="font-semibold">Detalhe do Pagamento</TableHead>
                <TableHead className="font-semibold text-center">Status</TableHead>
                <TableHead className="font-semibold">Notas</TableHead>
                <TableHead className="font-semibold text-center">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aquisicoesFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhuma aquisição encontrada para {getMesLabel(mesSelecionado)}
                    {filtroStatus !== "todos" && ` com status "${statusConfig[filtroStatus as StatusType].label}"`}
                  </TableCell>
                </TableRow>
              ) : (
                aquisicoesFiltradas.map((aquisicao) => {
                  const config = statusConfig[aquisicao.status];
                  const Icon = config.icon;
                  const acaoLabel =
                    aquisicao.status === "pendente_conciliacao" && aquisicao.tipoPagamento === "saldo_interno"
                      ? statusConfig.pendente_conciliacao.acaoAlternativa
                      : config.acao;

                  return (
                    <TableRow key={aquisicao.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div>
                          <p className="font-medium">{aquisicao.comprador}</p>
                          <p className="text-xs text-muted-foreground">Início: {aquisicao.dataInicio}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold" style={{ fontWeight: 500 }}>
                        {aquisicao.aporte}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{aquisicao.detalhePagamento}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${config.color} border font-normal px-2 py-1`}>
                          <Icon className="h-3.5 w-3.5 mr-1.5" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-[220px] max-w-[320px]">
                        {editandoNota === aquisicao.id ? (
                          <Input
                            defaultValue={notas[aquisicao.id] || ""}
                            autoFocus
                            onBlur={(e) => {
                              salvarNota(aquisicao.id, e.target.value);
                              toast({
                                description: `✓ Nota salva às ${new Date().toLocaleTimeString("pt-BR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}`,
                                duration: 2000,
                              });
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                salvarNota(aquisicao.id, e.currentTarget.value);
                                toast({
                                  description: `✓ Nota salva às ${new Date().toLocaleTimeString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}`,
                                  duration: 2000,
                                });
                              }
                            }}
                            placeholder="Ex: Pix até dia 25, desconto aplicado..."
                            className="h-8 text-xs"
                          />
                        ) : (
                          <div
                            className="flex items-center gap-2 cursor-pointer group"
                            onClick={() => setEditandoNota(aquisicao.id)}
                          >
                            <p className="text-sm text-muted-foreground flex-1">
                              {notas[aquisicao.id] || "Adicionar nota rápida..."}
                            </p>
                            <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant={aquisicao.status === "ativo" ? "outline" : "default"}
                          onClick={() => handleAcao(aquisicao)}
                          className="whitespace-nowrap"
                        >
                          {aquisicao.status === "ativo" ? (
                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                          ) : (
                            <Icon className="h-3.5 w-3.5 mr-1.5" />
                          )}
                          {acaoLabel}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
