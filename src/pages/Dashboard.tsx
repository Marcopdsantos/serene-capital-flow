import { useState } from "react";
import { LayoutDashboard, Users, FileText, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-editorial mx-auto px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold font-sans">Acordo Capital — Admin</h1>
          <Button size="sm" className="font-sans">
            <Plus className="mr-2 h-4 w-4" />
            Nova Aquisição
          </Button>
        </div>
      </header>

      <div className="max-w-editorial mx-auto px-8 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Investido</CardDescription>
              <CardTitle className="text-3xl font-serif">R$ 2.4M</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-success">+12.5% este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Acordos Ativos</CardDescription>
              <CardTitle className="text-3xl font-serif">48</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">6 pendentes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Investidores</CardDescription>
              <CardTitle className="text-3xl font-serif">127</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">+3 este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Taxa de Conciliação</CardDescription>
              <CardTitle className="text-3xl font-serif">99.8%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-success">Excelente</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Aquisições Recentes</CardTitle>
              <CardDescription>
                Últimas operações realizadas na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium">Cliente {i} — Acordo #{1000 + i}</p>
                      <p className="text-sm text-muted-foreground">Criado há 2 horas</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">R$ {(i * 50000).toLocaleString('pt-BR')}</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-pending/20 text-pending-foreground">
                        Aguardando Assinatura
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Operações frequentes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start font-sans">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Ver Dashboard Completo
              </Button>
              <Button variant="outline" className="w-full justify-start font-sans">
                <Users className="mr-2 h-4 w-4" />
                Gerenciar Investidores
              </Button>
              <Button variant="outline" className="w-full justify-start font-sans">
                <FileText className="mr-2 h-4 w-4" />
                Relatórios
              </Button>
              <Button variant="outline" className="w-full justify-start font-sans">
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
