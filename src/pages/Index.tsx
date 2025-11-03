import { Link } from "react-router-dom";
import { ArrowRight, Shield, TrendingUp, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-editorial mx-auto px-8 py-6 flex items-center justify-between">
          <img src={logo} alt="Acordo Capital" className="h-10" />
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="font-sans">Entrar</Button>
            </Link>
            <Link to="/login">
              <Button className="font-sans">Portal do Cliente</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-editorial mx-auto px-8 py-24 animate-fade-in">
        <div className="max-w-4xl">
          <h1 className="text-6xl font-bold text-foreground mb-8 leading-tight">
            Gestão de investimentos com a clareza que você merece
          </h1>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl">
            Uma plataforma que une a precisão operacional de um painel financeiro 
            à experiência editorial e humana de um private banking digital.
          </p>
          <div className="flex gap-4">
            <Link to="/login">
              <Button size="lg" className="text-lg font-sans h-14 px-8">
                Acessar Plataforma
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg font-sans h-14 px-8">
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-editorial mx-auto px-8 py-editorial">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold">Transparência Total</h3>
            <p className="text-muted-foreground leading-relaxed">
              Acompanhe seus investimentos com visibilidade completa. Cada número, 
              cada detalhe, cada movimentação — sempre à sua disposição.
            </p>
          </div>

          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
              <TrendingUp className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-2xl font-semibold">Gestão Inteligente</h3>
            <p className="text-muted-foreground leading-relaxed">
              Automatize conciliações, acompanhe múltiplos acordos e mantenha 
              o controle absoluto sobre seus investimentos em um só lugar.
            </p>
          </div>

          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center">
              <FileText className="h-7 w-7 text-success" />
            </div>
            <h3 className="text-2xl font-semibold">Experiência Editorial</h3>
            <p className="text-muted-foreground leading-relaxed">
              Uma interface pensada para clareza e confiança. Números que respiram, 
              informações que fazem sentido, decisões com tranquilidade.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary text-primary-foreground py-20 my-editorial">
        <div className="max-w-editorial mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-16 text-center">
            <div className="space-y-2">
              <div className="text-5xl font-bold font-serif">R$ 50M+</div>
              <div className="text-lg opacity-90">Em investimentos gerenciados</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold font-serif">500+</div>
              <div className="text-lg opacity-90">Investidores ativos</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold font-serif">99.9%</div>
              <div className="text-lg opacity-90">Precisão em conciliações</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-editorial mx-auto px-8 py-editorial text-center">
        <h2 className="text-5xl font-bold mb-6">
          Pronto para transformar sua gestão de investimentos?
        </h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Junte-se a centenas de investidores que escolheram clareza, confiança e controle.
        </p>
        <Link to="/login">
          <Button size="lg" className="text-lg font-sans h-14 px-12">
            Começar Agora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-editorial">
        <div className="max-w-editorial mx-auto px-8 py-12">
          <div className="flex items-center justify-between">
            <img src={logo} alt="Acordo Capital" className="h-8 opacity-60" />
            <p className="text-sm text-muted-foreground">
              © 2025 Acordo Capital. Transparência é o nosso ativo mais valioso.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
