import { useState } from "react";
import { LayoutDashboard, FileText, TrendingUp, Clock, Check, AlertCircle, FileCheck, Pencil, Wallet, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NovaAquisicaoDialog } from "@/components/NovaAquisicaoDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FluxoCaixaTab } from "@/components/FluxoCaixaTab";
import { ComprovantesTab } from "@/components/ComprovantesTab";
import { AcordosDetalhadosTab } from "@/components/AcordosDetalhadosTab";
import { ComprovanteModal } from "@/components/ComprovanteModal";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [comprovanteModal, setComprovanteModal] = useState<{ open: boolean; acordo: any }>({
    open: false,
    acordo: null
  });
  const [observacoes, setObservacoes] = useState<Record<string, string>>({
    "1": "Pix até dia 25, desconto 2k aplicado",
    "2": "Aguardando compensação bancária"
  });
  const [editandoObs, setEditandoObs] = useState<string | null>(null);
  const [filtroMes, setFiltroMes] = useState("todos");

  const acordosData = [
    {
      id: "1",
      cliente: "Cliente 1",
      numero: "#1001",
      valor: "R$ 50.000",
      mes: "Outubro 2024",
      mesRef: "2024-10",
      status: "aguardando" as const,
      comprovante: "aguardando" as const,
      criado: "há 2 horas"
    },
    {
      id: "2",
      cliente: "Cliente 2",
      numero: "#1002",
      valor: "R$ 100.000",
      mes: "Outubro 2024",
      mesRef: "2024-10",
      status: "ativo" as const,
      comprovante: "anexado" as const,
      criado: "há 5 horas"
    },
    {
      id: "3",
      cliente: "Cliente 3",
      numero: "#1003",
      valor: "R$ 150.000",
      mes: "Novembro 2024",
      mesRef: "2024-11",
      status: "ativo" as const,
      comprovante: "conciliado" as const,
      criado: "há 1 dia"
    }
  ];

  const acordosFiltrados = filtroMes === "todos" 
    ? acordosData 
    : acordosData.filter(a => a.mesRef === filtroMes);

  const totalMes = acordosFiltrados.reduce((acc, acordo) => {
    const valor = parseInt(acordo.valor.replace(/\D/g, ''));
    return acc + valor;
  }, 0);

  const getComprovanteStatus = (status: string) => {
    const configs = {
      aguardando: { icon: Clock, label: "Aguardando", className: "bg-pending text-pending-foreground" },
      anexado: { icon: FileText, label: "Anexado", className: "bg-accent text-accent-foreground" },
      conciliado: { icon: Check, label: "Conciliado", className: "bg-success text-success-foreground" },
      pendente: { icon: AlertCircle, label: "Pendente", className: "bg-destructive text-destructive-foreground" }
    };
    const config = configs[status as keyof typeof configs];
    const Icon = config.icon;
    return (
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 px-3 ${config.className}`}
        onClick={() => setComprovanteModal({ open: true, acordo: acordosData[0] })}
      >
        <Icon className="h-3.5 w-3.5 mr-1.5" />
        {config.label}
      </Button>
    );
  };

  const salvarObservacao = (id: string, texto: string) => {
    setObservacoes(prev => ({ ...prev, [id]: texto }));
    setEditandoObs(null);
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
            {/* Stats Grid - Resumo Financeiro */}
            <div className="grid md:grid-cols-4 gap-6 animate-fade-in">
              <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-muted/20 border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <CardDescription>Total em Caixa Atual</CardDescription>
                    <div className="h-px flex-1 mx-3 bg-border/30" />
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-sans font-bold numeric-value">R$ 1.245.000</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Saldo disponível dos clientes</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-muted/20 border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <CardDescription>Entradas Previstas no Mês</CardDescription>
                    <div className="h-px flex-1 mx-3 bg-border/30" />
                    <TrendingUp className="h-5 w-5 text-success" />
                  </div>
                  <CardTitle className="text-3xl font-sans font-bold numeric-value">R$ 845.000</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Outubro 2024</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-muted/20 border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <CardDescription>Pagamentos Pendentes</CardDescription>
                    <div className="h-px flex-1 mx-3 bg-border/30" />
                    <Clock className="h-5 w-5 text-pending" />
                  </div>
                  <CardTitle className="text-3xl font-sans font-bold numeric-value">R$ 125.000</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Aguardando conciliação</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-muted/20 border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <CardDescription>Acordos Ativos Totais</CardDescription>
                    <div className="h-px flex-1 mx-3 bg-border/30" />
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                  <CardTitle className="text-3xl font-sans font-bold numeric-value">23</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Contratos em andamento</p>
                </CardContent>
              </Card>
            </div>

            {/* Cards Segmentados por Origem */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-300">
                <p className="text-sm text-muted-foreground mb-2">💸 Origem: PIX/Cheque</p>
                <p className="text-3xl font-sans font-bold numeric-value">R$ 445.000</p>
                <p className="text-xs text-muted-foreground mt-1">15 acordos ativos</p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover:shadow-lg transition-all duration-300">
                <p className="text-sm text-muted-foreground mb-2">🏦 Origem: Saldo Interno</p>
                <p className="text-3xl font-sans font-bold numeric-value">R$ 400.000</p>
                <p className="text-xs text-muted-foreground mt-1">8 acordos ativos</p>
              </Card>
            </div>

            {/* Resumo Mensal */}
            <Card className="animate-fade-in">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-sans font-bold">Acordos por Mês</CardTitle>
                    <CardDescription>Visualize acordos agrupados por mês para melhor controle do fluxo</CardDescription>
                  </div>
                  <Select value={filtroMes} onValueChange={setFiltroMes}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Mês de Referência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Meses</SelectItem>
                      <SelectItem value="2024-10">Outubro 2024</SelectItem>
                      <SelectItem value="2024-11">Novembro 2024</SelectItem>
                      <SelectItem value="2024-12">Dezembro 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              {filtroMes !== "todos" && (
                <CardContent className="pt-0 pb-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 animate-fade-in">
                    <TrendingUp className="h-5 w-5 text-accent-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        📆 {filtroMes === "2024-10" ? "Outubro" : filtroMes === "2024-11" ? "Novembro" : "Dezembro"} 2024: {acordosFiltrados.length} acordos — R$ {totalMes.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Visualize acordos agrupados por mês para melhor controle do fluxo
                      </p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Tabela de Acordos */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg font-sans font-bold">Acordos Recentes</CardTitle>
                <CardDescription>Últimas operações realizadas na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Cliente & Acordo</TableHead>
                      <TableHead className="font-semibold">📆 Mês de Referência</TableHead>
                      <TableHead className="font-semibold text-right">Valor</TableHead>
                      <TableHead className="font-semibold text-center">📎 Comprovante</TableHead>
                      <TableHead className="font-semibold">🗒️ Observações</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {acordosFiltrados.map((acordo) => (
                      <TableRow key={acordo.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <div>
                            <p className="font-medium">{acordo.cliente}</p>
                            <p className="text-sm text-muted-foreground">{acordo.numero} • {acordo.criado}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {acordo.mes}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold numeric-value">{acordo.valor}</TableCell>
                        <TableCell className="text-center">
                          {getComprovanteStatus(acordo.comprovante)}
                        </TableCell>
                        <TableCell className="min-w-[200px] max-w-[300px]">
                          {editandoObs === acordo.id ? (
                            <Input
                              defaultValue={observacoes[acordo.id] || ""}
                              autoFocus
                              onBlur={(e) => {
                                salvarObservacao(acordo.id, e.target.value);
                                setTimeout(() => {
                                  toast({
                                    description: `✓ Salvo às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} — automático`,
                                    duration: 2000,
                                    className: "animate-fade-in"
                                  });
                                }, 300);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  salvarObservacao(acordo.id, e.currentTarget.value);
                                  setTimeout(() => {
                                    toast({
                                      description: `✓ Salvo às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} — automático`,
                                      duration: 2000,
                                      className: "animate-fade-in"
                                    });
                                  }, 300);
                                }
                              }}
                              placeholder="Ex: Pix até dia 25, desconto 2k, saldo a compensar."
                              className="h-8 text-xs"
                            />
                          ) : (
                            <div 
                              className="flex items-center gap-2 cursor-pointer group"
                              onClick={() => setEditandoObs(acordo.id)}
                            >
                              <p className="text-sm text-muted-foreground flex-1">
                                {observacoes[acordo.id] || "Use notas rápidas para lembrar ajustes e pendências"}
                              </p>
                              <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          )}
                          {observacoes[acordo.id] && editandoObs !== acordo.id && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Editado às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} — automático
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              acordo.status === "ativo"
                                ? "bg-success text-success-foreground"
                                : "bg-pending text-pending-foreground"
                            }
                          >
                            {acordo.status === "ativo" ? "Ativo" : "Aguardando Assinatura"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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
