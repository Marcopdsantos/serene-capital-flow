import { useState } from "react";
import { LayoutDashboard, FileText, TrendingUp, Clock, Check, AlertCircle, FileCheck, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NovaAquisicaoDialog } from "@/components/NovaAquisicaoDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FluxoCaixaTab } from "@/components/FluxoCaixaTab";
import { ComprovantesTab } from "@/components/ComprovantesTab";
import { ComprovanteModal } from "@/components/ComprovanteModal";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
          <TabsList className="bg-muted">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Painel Geral
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
              <Card className="hover:shadow-editorial transition-shadow">
                <CardHeader className="pb-3">
                  <CardDescription>Total em Caixa Atual</CardDescription>
                  <CardTitle className="text-3xl font-serif">R$ 2.4M</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-success">+12.5% este mês</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-editorial transition-shadow">
                <CardHeader className="pb-3">
                  <CardDescription>Entradas Previstas — Mês Atual</CardDescription>
                  <CardTitle className="text-3xl font-serif">R$ 1.1M</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">47 acordos ativos</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-editorial transition-shadow">
                <CardHeader className="pb-3">
                  <CardDescription>Pagamentos Pendentes</CardDescription>
                  <CardTitle className="text-3xl font-serif">R$ 340K</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-pending-foreground">6 pendentes de conciliação</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-editorial transition-shadow">
                <CardHeader className="pb-3">
                  <CardDescription>Acordos Ativos Totais</CardDescription>
                  <CardTitle className="text-3xl font-serif">48</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-success">Taxa de conciliação: 99.8%</p>
                </CardContent>
              </Card>
            </div>

            {/* Resumo Mensal */}
            <Card className="animate-fade-in">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-serif">Acordos por Mês</CardTitle>
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
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <TrendingUp className="h-5 w-5 text-accent-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {filtroMes === "2024-10" ? "Outubro" : filtroMes === "2024-11" ? "Novembro" : "Dezembro"} 2024
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {acordosFiltrados.length} acordos • R$ {totalMes.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Tabela de Acordos */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg font-serif">Acordos Recentes</CardTitle>
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
                        <TableCell className="text-right font-semibold">{acordo.valor}</TableCell>
                        <TableCell className="text-center">
                          {getComprovanteStatus(acordo.comprovante)}
                        </TableCell>
                        <TableCell className="min-w-[200px] max-w-[300px]">
                          {editandoObs === acordo.id ? (
                            <Input
                              defaultValue={observacoes[acordo.id] || ""}
                              autoFocus
                              onBlur={(e) => salvarObservacao(acordo.id, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  salvarObservacao(acordo.id, e.currentTarget.value);
                                }
                              }}
                              className="h-8 text-xs"
                            />
                          ) : (
                            <div 
                              className="flex items-center gap-2 cursor-pointer group"
                              onClick={() => setEditandoObs(acordo.id)}
                            >
                              <p className="text-sm text-muted-foreground flex-1">
                                {observacoes[acordo.id] || "Ex: Pix até dia 25, desconto 2k..."}
                              </p>
                              <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          )}
                          {observacoes[acordo.id] && editandoObs !== acordo.id && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Editado às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
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

          {/* Aba Fluxo de Caixa */}
          <TabsContent value="fluxo">
            <FluxoCaixaTab />
          </TabsContent>

          {/* Aba Comprovantes */}
          <TabsContent value="comprovantes">
            <ComprovantesTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Comprovantes */}
      <ComprovanteModal
        open={comprovanteModal.open}
        onOpenChange={(open) => setComprovanteModal({ open, acordo: null })}
        acordo={comprovanteModal.acordo || { id: "1", cliente: "Cliente 1", valor: "R$ 50.000" }}
      />
    </div>
  );
};

export default Dashboard;
