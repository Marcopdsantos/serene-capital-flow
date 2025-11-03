import { TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";

const ClientPortal = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-editorial mx-auto px-8 py-6 flex items-center justify-between">
          <img src={logo} alt="Acordo Capital" className="h-8" />
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Bem-vindo,</p>
            <p className="font-semibold">João Silva</p>
          </div>
        </div>
      </header>

      <div className="max-w-editorial mx-auto px-8 py-12 space-y-12">
        {/* Welcome Message */}
        <div className="animate-fade-in">
          <h1 className="text-5xl font-sans font-bold mb-4 leading-tight">
            Bem-vindo de volta
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Seus investimentos seguem firmes. Transparência em cada detalhe.
          </p>
        </div>

        {/* Balance Card - Editorial Hero */}
        <Card className="shadow-editorial animate-slide-up border-2">
          <CardHeader className="pb-8">
            <CardDescription className="text-base">Saldo Total Disponível</CardDescription>
            <CardTitle className="text-7xl font-sans numeric-value mt-4">
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

        {/* Agreements Section */}
        <section className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div>
            <h2 className="text-4xl font-sans font-bold mb-2">Meus Acordos</h2>
            <p className="text-muted-foreground text-lg">
              Seus acordos estão em dia e rendendo conforme o cronograma.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-editorial hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardDescription>Acordo #1001</CardDescription>
                    <CardTitle className="text-3xl font-sans numeric-value mt-2">R$ 50.000,00</CardTitle>
                  </div>
                  <span className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-success/20 text-success-foreground font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    Ativo
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Taxa</p>
                    <p className="font-semibold">1.8% a.m.</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Parcelas</p>
                    <p className="font-semibold">12 de 24</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Próximo crédito</p>
                  <p className="font-medium numeric-value">Amanhã, 05h00 — R$ 900,00</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-editorial hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardDescription>Acordo #1002</CardDescription>
                    <CardTitle className="text-3xl font-sans numeric-value mt-2">R$ 75.000,00</CardTitle>
                  </div>
                  <span className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-success/20 text-success-foreground font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    Ativo
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Taxa</p>
                    <p className="font-semibold">2.0% a.m.</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Parcelas</p>
                    <p className="font-semibold">8 de 18</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Próximo crédito</p>
                  <p className="font-medium numeric-value">Amanhã, 05h00 — R$ 1.500,00</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Transaction History */}
        <section className="space-y-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div>
            <h2 className="text-4xl font-sans font-bold mb-2">Extrato</h2>
            <p className="text-muted-foreground text-lg">
              Histórico completo de movimentações
            </p>
          </div>

          <Card className="shadow-editorial">
            <CardContent className="pt-6">
              <div className="space-y-6">
                {[
                  { type: "credit", desc: "Crédito automático — Acordo #1001", value: "+R$ 900,00", time: "Hoje, 05h00" },
                  { type: "credit", desc: "Crédito automático — Acordo #1002", value: "+R$ 1.500,00", time: "Hoje, 05h00" },
                  { type: "debit", desc: "Saque solicitado", value: "-R$ 5.000,00", time: "Ontem, 14h30" },
                  { type: "credit", desc: "Crédito automático — Acordo #1001", value: "+R$ 900,00", time: "2 dias atrás" },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === "credit" ? "bg-success/10" : "bg-muted"
                      }`}>
                        {tx.type === "credit" ? (
                          <TrendingUp className="h-5 w-5 text-success" />
                        ) : (
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{tx.desc}</p>
                        <p className="text-sm text-muted-foreground">{tx.time}</p>
                      </div>
                    </div>
                    <p className={`font-semibold text-lg numeric-value ${
                      tx.type === "credit" ? "text-success" : "text-foreground"
                    }`}>
                      {tx.value}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
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
