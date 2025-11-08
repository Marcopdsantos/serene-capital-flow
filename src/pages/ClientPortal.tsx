import { useState } from "react";
import { TrendingUp, Clock, CheckCircle2, Home, Briefcase, Receipt, UserCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo.png";

const ClientPortal = () => {
  const [activeTab, setActiveTab] = useState("inicio");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-editorial mx-auto px-8 py-6 flex items-center justify-between">
          <img src={logo} alt="Acordo Capital" className="h-8" />
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => window.location.href = '/portal/perfil'}>
              Meu Perfil
            </Button>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Bem-vindo,</p>
              <p className="font-semibold">João Silva</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-editorial mx-auto px-8 py-12 space-y-8">
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="inicio" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Início
            </TabsTrigger>
            <TabsTrigger value="acordos" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Meus Acordos
            </TabsTrigger>
            <TabsTrigger value="extrato" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Meu Extrato
            </TabsTrigger>
            <TabsTrigger value="perfil" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              Meu Perfil
            </TabsTrigger>
          </TabsList>

          {/* TAB: Início (Dashboard) */}
          <TabsContent value="inicio" className="space-y-12">
            <div className="animate-fade-in">
              <h1 className="text-5xl font-sans font-bold mb-4 leading-tight">
                Bem-vindo de volta
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Seus investimentos seguem firmes. Transparência em cada detalhe.
              </p>
            </div>

            {/* Balance and Next Payment Cards */}
            <div className="grid md:grid-cols-2 gap-6 animate-slide-up">
          <Card className="shadow-editorial border-2">
            <CardHeader className="pb-8">
              <CardDescription className="text-base">Saldo Disponível</CardDescription>
              <CardTitle className="text-7xl font-sans mt-4" style={{ fontWeight: 500 }}>
                R$ 127.450,00
              </CardTitle>
              <p className="text-muted-foreground mt-4 text-lg">
                Seu saldo foi atualizado automaticamente às 05h00 de hoje.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-success">
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium numeric-value">+R$ 2.850,00 este mês</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-editorial border-2">
            <CardHeader className="pb-8">
              <CardDescription className="text-base">Próximo Recebimento</CardDescription>
              <CardTitle className="text-7xl font-sans mt-4" style={{ fontWeight: 500 }}>
                R$ 2.400,00
              </CardTitle>
              <p className="text-muted-foreground mt-4 text-lg">
                Crédito automático previsto para amanhã, 05h00.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <span className="font-medium">2 acordos em processamento</span>
              </div>
            </CardContent>
          </Card>
            </div>
          </TabsContent>

          {/* TAB: Meus Acordos */}
          <TabsContent value="acordos" className="space-y-6">
            <div>
              <h2 className="text-4xl font-sans font-bold mb-2">Meus Acordos</h2>
              <p className="text-muted-foreground text-lg">
                Visualize todos os seus investimentos ativos e o progresso de cada um.
              </p>
            </div>

            <Card className="shadow-editorial">
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium">ID do Acordo</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Data do Aporte</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Valor do Aporte</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Progresso</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Valor da Parcela</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: "#1001", data: "15/09/2024", aporte: 50000, progresso: 5, total: 10, parcela: 6500 },
                        { id: "#1002", data: "10/10/2024", aporte: 75000, progresso: 3, total: 10, parcela: 9750 },
                        { id: "#1003", data: "25/10/2024", aporte: 30000, progresso: 1, total: 10, parcela: 3900 },
                      ].map((acordo) => (
                        <tr key={acordo.id} className="border-b border-border hover:bg-muted/30">
                          <td className="py-4 px-4 font-medium">{acordo.id}</td>
                          <td className="py-4 px-4 text-sm">{acordo.data}</td>
                          <td className="py-4 px-4 font-semibold">
                            R$ {acordo.aporte.toLocaleString("pt-BR")}
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Progress value={(acordo.progresso / acordo.total) * 100} className="h-2 flex-1" />
                                <Badge variant="neutral" className="text-xs">
                                  {acordo.progresso}/{acordo.total}
                                </Badge>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-semibold">
                            R$ {acordo.parcela.toLocaleString("pt-BR")}
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant="default" className="bg-success text-success-foreground">
                              Ativo
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: Meu Extrato */}
          <TabsContent value="extrato" className="space-y-6">
            <div>
              <h2 className="text-4xl font-sans font-bold mb-2">Meu Extrato</h2>
              <p className="text-muted-foreground text-lg">
                Histórico completo de todas as movimentações da sua Conta Corrente.
              </p>
            </div>

            <Card className="shadow-editorial">
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium">Data</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Descrição</th>
                        <th className="text-right py-3 px-4 text-sm font-medium">Valor</th>
                        <th className="text-right py-3 px-4 text-sm font-medium">Saldo Resultante</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { tipo: "credito", desc: "Crédito da parcela 5/10 (Acordo #1001)", valor: 6500, data: "28/11/2024 - 05h00", saldoAnterior: 120950 },
                        { tipo: "credito", desc: "Crédito da parcela 3/10 (Acordo #1002)", valor: 9750, data: "28/11/2024 - 05h00", saldoAnterior: 111200 },
                        { tipo: "debito", desc: "Débito para aporte no Acordo #1004", valor: -30000, data: "25/11/2024 - 14h30", saldoAnterior: 141200 },
                        { tipo: "debito", desc: "Saque solicitado via PIX", valor: -10000, data: "20/11/2024 - 10h15", saldoAnterior: 151200 },
                        { tipo: "credito", desc: "Crédito da parcela 4/10 (Acordo #1001)", valor: 6500, data: "28/10/2024 - 05h00", saldoAnterior: 144700 },
                      ].map((tx, i) => {
                        const saldoResultante = tx.saldoAnterior + tx.valor;
                        return (
                          <tr key={i} className="border-b border-border hover:bg-muted/30">
                            <td className="py-4 px-4 text-sm">{tx.data}</td>
                            <td className="py-4 px-4">{tx.desc}</td>
                            <td className={`py-4 px-4 text-right font-semibold ${
                              tx.tipo === "credito" ? "text-green-600" : "text-red-600"
                            }`}>
                              {tx.tipo === "credito" ? "+" : "-"} R$ {Math.abs(tx.valor).toLocaleString("pt-BR")}
                            </td>
                            <td className="py-4 px-4 text-right font-semibold">
                              R$ {saldoResultante.toLocaleString("pt-BR")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: Meu Perfil */}
          <TabsContent value="perfil" className="space-y-6">
            <div>
              <h2 className="text-4xl font-sans font-bold mb-2">Meu Perfil</h2>
              <p className="text-muted-foreground text-lg">
                Visualize seus dados cadastrais.
              </p>
            </div>

            <Card className="shadow-editorial">
              <CardHeader>
                <CardTitle>Informações Cadastrais</CardTitle>
                <CardDescription>
                  Para atualizar seus dados, entre em contato com o gestor.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Nome Completo</p>
                    <p className="font-semibold">João Silva</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">CPF</p>
                    <p className="font-semibold">000.000.000-00</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">E-mail</p>
                    <p className="font-semibold">joao.silva@email.com</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Telefone</p>
                    <p className="font-semibold">(11) 99999-9999</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-editorial mx-auto px-8 py-8">
          <p className="text-center text-sm text-muted-foreground">
            Transparência é o nosso ativo mais valioso.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ClientPortal;
