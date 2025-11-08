import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import logo from "@/assets/logo.png";

const MeuPerfil = () => {
  const clienteData = {
    nome: "João Silva",
    cpf: "123.456.789-00",
    email: "joao.silva@email.com",
    telefone: "(11) 98765-4321",
    dataNascimento: "15/03/1985",
    endereco: "Rua das Flores, 123 - São Paulo, SP",
    cep: "01234-567",
    dataCadastro: "10/01/2024",
    tipo: "Investidor",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-editorial mx-auto px-8 py-6 flex items-center justify-between">
          <img src={logo} alt="Acordo Capital" className="h-8" />
          <Button variant="outline" onClick={() => window.location.href = '/portal'}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Portal
          </Button>
        </div>
      </header>

      <div className="max-w-editorial mx-auto px-8 py-12 space-y-8">
        {/* Page Title */}
        <div className="animate-fade-in">
          <h1 className="text-5xl font-sans font-bold mb-4 leading-tight">
            Meu Perfil
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Seus dados cadastrais e informações de conta
          </p>
        </div>

        {/* Profile Card */}
        <Card className="shadow-editorial animate-slide-up">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl font-sans" style={{ fontWeight: 500 }}>
                  {clienteData.nome}
                </CardTitle>
                <CardDescription className="text-lg mt-1">{clienteData.tipo}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Informações Pessoais</h3>
              <Separator className="mb-6" />
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">CPF</p>
                    <p className="font-medium text-lg">{clienteData.cpf}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                    <p className="font-medium text-lg">{clienteData.dataNascimento}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Contato</h3>
              <Separator className="mb-6" />
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">E-mail</p>
                    <p className="font-medium text-lg">{clienteData.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium text-lg">{clienteData.telefone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Endereço</h3>
              <Separator className="mb-6" />
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Endereço Completo</p>
                  <p className="font-medium text-lg">{clienteData.endereco}</p>
                  <p className="font-medium text-lg">CEP: {clienteData.cep}</p>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Informações da Conta</h3>
              <Separator className="mb-6" />
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Cliente desde</p>
                  <p className="font-medium text-lg">{clienteData.dataCadastro}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Note */}
        <Card className="bg-muted/50 border-muted animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong>Nota:</strong> Para atualizar seus dados cadastrais, entre em contato com nossa central 
              de atendimento através do e-mail contato@acordocapital.com.br ou telefone (11) 3456-7890.
            </p>
          </CardContent>
        </Card>
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

export default MeuPerfil;
