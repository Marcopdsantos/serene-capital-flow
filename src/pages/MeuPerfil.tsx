import { ArrowLeft, User, Mail, Phone, MapPin, CreditCard, Globe, Heart, Briefcase, Building2, QrCode, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import logo from "@/assets/logo.png";

const MeuPerfil = () => {
  const clienteData = {
    // Dados Pessoais do Investidor
    nome: "João Silva Santos",
    cpf: "123.456.789-00",
    nacionalidade: "Brasileiro",
    estadoCivil: "Casado",
    profissao: "Empresário",
    telefone: "(11) 98765-4321",
    email: "joao.silva@email.com",
    
    // Endereço Completo
    endereco: {
      rua: "Rua das Flores",
      numero: "123",
      complemento: "Apto 45",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
    },
    
    // Dados Bancários (para recebimento)
    banco: {
      nome: "Itaú Unibanco",
      agencia: "1234",
      conta: "56789-0",
      chavePix: "joao.silva@email.com",
    },
    
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
            Seus dados cadastrais conforme contrato
          </p>
        </div>

        {/* Profile Card */}
        <Card className="shadow-editorial animate-slide-up">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-10 w-10 text-primary" strokeWidth={1.5} />
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
            {/* Dados Pessoais do Investidor */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-slate-700">Dados Pessoais do Investidor</h3>
              <Separator className="mb-6" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-1" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm text-muted-foreground">Nome Completo</p>
                    <p className="font-medium text-lg">{clienteData.nome}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground mt-1" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm text-muted-foreground">CPF</p>
                    <p className="font-medium text-lg font-mono">{clienteData.cpf}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground mt-1" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm text-muted-foreground">Nacionalidade</p>
                    <p className="font-medium text-lg">{clienteData.nacionalidade}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-muted-foreground mt-1" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm text-muted-foreground">Estado Civil</p>
                    <p className="font-medium text-lg">{clienteData.estadoCivil}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-1" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm text-muted-foreground">Profissão</p>
                    <p className="font-medium text-lg">{clienteData.profissao}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contato */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-slate-700">Contato</h3>
              <Separator className="mb-6" />
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-1" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm text-muted-foreground">E-mail</p>
                    <p className="font-medium text-lg">{clienteData.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-1" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium text-lg font-mono">{clienteData.telefone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Endereço Completo */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-slate-700">Endereço Completo</h3>
              <Separator className="mb-6" />
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-1" strokeWidth={1.5} />
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="font-medium text-lg">
                    {clienteData.endereco.rua}, {clienteData.endereco.numero}
                    {clienteData.endereco.complemento && ` - ${clienteData.endereco.complemento}`}
                  </p>
                  <p className="font-medium text-lg">
                    {clienteData.endereco.bairro} - {clienteData.endereco.cidade}/{clienteData.endereco.estado}
                  </p>
                  <p className="font-medium text-lg font-mono">CEP: {clienteData.endereco.cep}</p>
                </div>
              </div>
            </div>

            {/* Dados Bancários */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-slate-700">Dados Bancários (para recebimento)</h3>
              <Separator className="mb-6" />
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground mt-1" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm text-muted-foreground">Banco</p>
                    <p className="font-medium text-lg">{clienteData.banco.nome}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ag: <span className="font-mono">{clienteData.banco.agencia}</span> | 
                      Conta: <span className="font-mono">{clienteData.banco.conta}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <QrCode className="h-5 w-5 text-muted-foreground mt-1" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm text-muted-foreground">Chave PIX</p>
                    <p className="font-medium text-lg font-mono">{clienteData.banco.chavePix}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Note */}
        <Card className="bg-muted/50 border-muted animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <p className="text-sm text-muted-foreground">
                <strong>Nota:</strong> Para alterações cadastrais, entre em contato com seu gestor através do 
                e-mail <span className="font-medium text-foreground">acordocapital@gmail.com</span> ou 
                WhatsApp <span className="font-medium text-foreground font-mono">(19) 99918-1307</span>.
              </p>
            </div>
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
