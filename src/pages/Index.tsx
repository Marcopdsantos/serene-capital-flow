import { Link } from "react-router-dom";
import { ArrowRight, Building2, ClipboardList, Handshake, MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const WHATSAPP_LINK = "https://wa.me/5519999181307?text=Ol%C3%A1!%20Vim%20pela%20LP%20da%20Acordo%20Capital%20e%20quero%20conhecer%20as%20opera%C3%A7%C3%B5es%20de%20cr%C3%A9dito.%20Pode%20me%20explicar%20como%20funciona%20e%20me%20enviar%20uma%20apresenta%C3%A7%C3%A3o%3F";

const Index = () => {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-white dark:bg-card">
        <div className="max-w-editorial mx-auto px-6 md:px-8 py-4 md:py-6 flex items-center justify-between">
          <img src={logo} alt="Acordo Capital" className="h-8 md:h-10" />
          <Link to="/login">
            <Button className="font-sans">Área do Cliente</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-editorial mx-auto px-6 md:px-8 py-16 md:py-24 animate-fade-in text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 md:mb-8 leading-tight">
            Operações de Crédito
            <br />
            com segurança e rentabilidade
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 leading-relaxed max-w-2xl mx-auto text-justify">
            A Acordo Capital estrutura e gerencia operações lastreadas em direitos creditórios, 
            com análise, formalização e acompanhamento ponta a ponta — para você investir com 
            transparência, governança e controle.
          </p>
          
          {/* CTA Buttons - Stacked on mobile */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
              <Button size="lg" className="text-base md:text-lg font-sans h-14 px-8 w-full sm:w-auto">
                <MessageCircle className="mr-2 h-5 w-5" />
                Falar com um gestor no WhatsApp
              </Button>
            </a>
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="text-base md:text-lg font-sans h-14 px-8 w-full sm:w-auto">
                Área do Cliente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Anchor link */}
          <button 
            onClick={scrollToFeatures}
            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm mx-auto"
          >
            Saiba Mais
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-editorial mx-auto px-6 md:px-8 py-16 md:py-editorial">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold">Quem somos</h3>
            <p className="text-muted-foreground leading-relaxed text-justify">
              A Acordo Capital é especializada na estruturação e gestão de operações de crédito 
              lastreadas em direitos creditórios, com foco em clareza e governança.
            </p>
          </div>

          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
              <ClipboardList className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold">Como atuamos</h3>
            <p className="text-muted-foreground leading-relaxed text-justify">
              Fazemos a análise, a formalização e o acompanhamento das operações do início ao fim, 
              com processo padronizado e documentação organizada.
            </p>
          </div>

          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center">
              <Handshake className="h-7 w-7 text-success" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold">Nosso compromisso</h3>
            <p className="text-muted-foreground leading-relaxed text-justify">
              Transparência na comunicação, seriedade na condução e suporte direto com gestor 
              quando você precisar — do primeiro contato ao acompanhamento.
            </p>
          </div>
        </div>
      </section>

      {/* Company Info Section */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16 my-16 md:my-editorial">
        <div className="max-w-editorial mx-auto px-6 md:px-8 text-center">
          <p className="text-lg md:text-xl font-semibold">
            ACORDO CAPITAL LTDA
          </p>
          <p className="text-base md:text-lg opacity-90 mt-2">
            CNPJ 60.300.968/0001-65
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-editorial mx-auto px-6 md:px-8 py-16 md:py-editorial text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
          Pronto para conhecer a Acordo Capital?
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed text-justify">
          Fale com um gestor e receba uma apresentação da plataforma e da estrutura das operações.
        </p>
        <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="inline-block w-full sm:w-auto">
          <Button size="lg" className="text-base md:text-lg font-sans h-14 px-8 md:px-12 w-full sm:w-auto">
            <MessageCircle className="mr-2 h-5 w-5" />
            Falar com um gestor no WhatsApp
          </Button>
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16 md:mt-editorial">
        <div className="max-w-editorial mx-auto px-6 md:px-8 py-10 md:py-12 text-center">
          {/* Logo */}
          <img src={logo} alt="Acordo Capital" className="h-6 mx-auto mb-4 opacity-60" />
          
          {/* Lema */}
          <p className="text-sm text-muted-foreground mb-6">
            Investindo em operações de crédito com segurança jurídica e rentabilidade
          </p>
          
          {/* Créditos dev */}
          <p className="text-xs text-muted-foreground/70">
            Desenvolvido por{" "}
            <a 
              href="https://www.instagram.com/space.inteligencia/" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-primary transition-colors"
            >
              Space Inteligência
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
