import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, TrendingUp, FileText, Wallet, DollarSign, CheckCircle, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Mock de dados do cliente
const clienteMock = {
  id: "1",
  nome: "João Silva",
  cpf: "000.000.000-00",
  email: "joao@email.com",
  telefone: "(11) 99999-9999",
  tipo: "investidor",
  totalInvestido: 150000,
  totalAcordos: 5,
  saldoDisponivel: 15250,
  observacoes: "Nos deve R$ 266.200,00 referente a acordos anteriores",
};

// Mock de acordos como beneficiário
const acordosBeneficiarioMock = [
  {
    id: "1",
    numeroAcordo: "#1001",
    dataAtivacao: new Date(2024, 8, 15),
    valorAporte: 50000,
    progresso: "5/10",
    valorParcela: 6500,
    status: "ativo",
  },
  {
    id: "2",
    numeroAcordo: "#1005",
    dataAtivacao: new Date(2024, 9, 1),
    valorAporte: 30000,
    progresso: "3/10",
    valorParcela: 3900,
    status: "ativo",
  },
  {
    id: "3",
    numeroAcordo: "#1012",
    dataAtivacao: new Date(2024, 9, 20),
    valorAporte: 70000,
    progresso: "2/10",
    valorParcela: 9100,
    status: "ativo",
  },
];

// Mock de acordos como signatário
const acordosSignatarioMock = [
  {
    id: "4",
    numeroAcordo: "#1008",
    beneficiario: "Maria Silva",
    dataAtivacao: new Date(2024, 9, 10),
    valorAporte: 25000,
    status: "ativo",
  },
];

export default function FichaCadastral() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tipoAcertoRapido, setTipoAcertoRapido] = useState<"credito" | "debito">("credito");

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  const onSubmitAcertoRapido = (data: any) => {
    toast({
      title: tipoAcertoRapido === "credito" ? "✓ Crédito lançado" : "✓ Débito lançado",
      description: `${tipoAcertoRapido === "credito" ? "Crédito" : "Débito"} de R$ ${data.valor} aplicado.`,
    });
    reset();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/cadastros/clientes")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Lista
        </Button>

        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{clienteMock.nome}</h1>
            <p className="text-muted-foreground">
              Ficha Cadastral Completa — Visão 360º do Cliente
            </p>
          </div>
        </div>
      </div>

      {/* KPIs Financeiros */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Total Investido (Ativo)</CardDescription>
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              R$ {clienteMock.totalInvestido.toLocaleString("pt-BR")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Total de Acordos</CardDescription>
              <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{clienteMock.totalAcordos}</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Saldo em Conta</CardDescription>
              <Wallet className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              R$ {clienteMock.saldoDisponivel.toLocaleString("pt-BR")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>CPF</CardDescription>
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{clienteMock.cpf}</p>
            <p className="text-sm text-muted-foreground mt-1">{clienteMock.email}</p>
          </CardContent>
        </Card>
      </div>

      {/* Observações */}
      {clienteMock.observacoes && (
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="text-base">Observações de Pagamentos/Dívidas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{clienteMock.observacoes}</p>
          </CardContent>
        </Card>
      )}

      {/* Módulo de Contabilidade Bilateral */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle>Módulo de Contabilidade Bilateral</CardTitle>
          <CardDescription>
            Registre e visualize observações sobre dívidas, pendências e acordos bilaterais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Observações Financeiras</Label>
            <Textarea
              placeholder="Ex: Cliente nos deve R$ 10.000 referente ao acordo #1005..."
              rows={4}
              defaultValue={clienteMock.observacoes}
            />
          </div>
          <Button>Salvar Observação</Button>
          
          <Separator className="my-4" />
          
          <div>
            <h4 className="font-semibold mb-2">Histórico de Observações</h4>
            <div className="space-y-2">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm">{clienteMock.observacoes}</p>
                <p className="text-xs text-muted-foreground mt-1">Registrado em: 15/11/2024 às 14h30</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Módulo de Acerto Rápido */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <CardTitle>Acerto Rápido</CardTitle>
          </div>
          <CardDescription>
            Lançar crédito ou débito para este cliente rapidamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmitAcertoRapido)} className="flex gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label>Tipo</Label>
              <RadioGroup
                value={tipoAcertoRapido}
                onValueChange={(v) => setTipoAcertoRapido(v as any)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credito" id="rapido-credito" />
                  <Label htmlFor="rapido-credito" className="cursor-pointer font-normal">
                    Crédito
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="debito" id="rapido-debito" />
                  <Label htmlFor="rapido-debito" className="cursor-pointer font-normal">
                    Débito
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2 flex-1">
              <Label>Valor</Label>
              <Input placeholder="R$ 0,00" {...register("valor")} />
            </div>

            <div className="space-y-2 flex-[2]">
              <Label>Justificativa</Label>
              <Input placeholder="Ex: Bônus, saque..." {...register("justificativa")} />
            </div>

            <Button type="submit">Lançar</Button>
          </form>
        </CardContent>
      </Card>

      {/* Abas de Vínculos */}
      <Card>
        <CardHeader>
          <CardTitle>Vínculos e Relacionamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="acordos-beneficiario">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="acordos-beneficiario">
                <FileText className="h-4 w-4 mr-2" />
                Acordos como Beneficiário
              </TabsTrigger>
              <TabsTrigger value="acordos-signatario">
                <User className="h-4 w-4 mr-2" />
                Acordos como Signatário
              </TabsTrigger>
              <TabsTrigger value="comissoes">
                <DollarSign className="h-4 w-4 mr-2" />
                Comissões (Agente)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="acordos-beneficiario" className="mt-6">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>ID Acordo</TableHead>
                      <TableHead>Data Ativação</TableHead>
                      <TableHead>Valor Aporte</TableHead>
                      <TableHead>Progresso</TableHead>
                      <TableHead>Valor Parcela</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {acordosBeneficiarioMock.map((acordo) => (
                      <TableRow key={acordo.id}>
                        <TableCell className="font-medium">{acordo.numeroAcordo}</TableCell>
                        <TableCell>{format(acordo.dataAtivacao, "dd/MM/yyyy")}</TableCell>
                        <TableCell className="font-semibold">
                          R$ {acordo.valorAporte.toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="neutral">{acordo.progresso}</Badge>
                        </TableCell>
                        <TableCell>
                          R$ {acordo.valorParcela.toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="neutral">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Ativo
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="acordos-signatario" className="mt-6">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>ID Acordo</TableHead>
                      <TableHead>Beneficiário</TableHead>
                      <TableHead>Data Ativação</TableHead>
                      <TableHead>Valor Aporte</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {acordosSignatarioMock.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Nenhum acordo como signatário
                        </TableCell>
                      </TableRow>
                    ) : (
                      acordosSignatarioMock.map((acordo) => (
                        <TableRow key={acordo.id}>
                          <TableCell className="font-medium">{acordo.numeroAcordo}</TableCell>
                          <TableCell className="font-medium">{acordo.beneficiario}</TableCell>
                          <TableCell>{format(acordo.dataAtivacao, "dd/MM/yyyy")}</TableCell>
                          <TableCell className="font-semibold">
                            R$ {acordo.valorAporte.toLocaleString("pt-BR")}
                          </TableCell>
                          <TableCell>
                            <Badge variant="neutral">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Ativo
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="comissoes" className="mt-6">
              {clienteMock.tipo === "agente" ? (
                <>
                  <Card className="mb-4 border-2">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardDescription>Total em Comissões Recebidas</CardDescription>
                        <DollarSign className="h-5 w-5 text-success" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-success">
                        R$ 12.500,00
                      </p>
                    </CardContent>
                  </Card>

                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Data</TableHead>
                          <TableHead>Cliente (Beneficiário)</TableHead>
                          <TableHead>ID Aquisição</TableHead>
                          <TableHead>Valor Comissão</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { data: "15/11/2024", cliente: "Maria Costa", aquisicaoId: "#ACQ-1050", comissao: 2500, status: "paga" },
                          { data: "10/11/2024", cliente: "Pedro Santos", aquisicaoId: "#ACQ-1048", comissao: 5000, status: "paga" },
                          { data: "05/11/2024", cliente: "Ana Silva", aquisicaoId: "#ACQ-1042", comissao: 5000, status: "paga" },
                        ].map((comissao, i) => (
                          <TableRow key={i}>
                            <TableCell>{comissao.data}</TableCell>
                            <TableCell className="font-medium">{comissao.cliente}</TableCell>
                            <TableCell>{comissao.aquisicaoId}</TableCell>
                            <TableCell className="font-semibold text-success">
                              R$ {comissao.comissao.toLocaleString("pt-BR")}
                            </TableCell>
                            <TableCell>
                              <Badge variant="default" className="bg-success text-success-foreground">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Paga
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Este cliente não é um Agente Comissionado.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
