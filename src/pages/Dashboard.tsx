import { useState } from "react";
import { Search, FileText, CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NovaAquisicaoDialog } from "@/components/NovaAquisicaoDialog";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-editorial mx-auto px-8 py-4">
          <h1 className="text-3xl font-bold mb-2">Sistema de Contratos</h1>
          <p className="text-muted-foreground">
            Gere contratos de investimento com precisão e eficiência.
          </p>
        </div>
      </header>

      <div className="max-w-editorial mx-auto px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Features Section */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover:shadow-md transition-shadow">
              <div className="p-3 rounded-lg bg-primary/10">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Busca inteligente</h3>
                <p className="text-muted-foreground text-sm">
                  Localize clientes existentes por CPF, nome ou e-mail e preencha dados automaticamente.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover:shadow-md transition-shadow">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Formulário guiado</h3>
                <p className="text-muted-foreground text-sm">
                  Processo dividido em etapas claras: dados pessoais, valores e assinatura.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border hover:shadow-md transition-shadow">
              <div className="p-3 rounded-lg bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Revisão completa</h3>
                <p className="text-muted-foreground text-sm">
                  Valide todas as informações antes de gerar e enviar o contrato para assinatura.
                </p>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-2xl">Novo Contrato</CardTitle>
              <CardDescription>
                Inicie o processo de formalização de um novo investimento.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full h-12 text-base" 
                size="lg"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="mr-2 h-5 w-5" />
                Iniciar Novo Contrato
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-12 text-base"
                size="lg"
                onClick={() => navigate("/contratos")}
              >
                Ver Contratos Existentes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <NovaAquisicaoDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

export default Dashboard;
