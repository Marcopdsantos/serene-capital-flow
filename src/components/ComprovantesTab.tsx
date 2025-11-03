import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, FileText, Check, Clock, AlertCircle, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ComprovanteListItem {
  id: string;
  cliente: string;
  acordo: string;
  data: string;
  valor: string;
  status: "aprovado" | "pendente" | "rejeitado";
}

const comprovantesData: ComprovanteListItem[] = [
  {
    id: "1",
    cliente: "Cliente 1",
    acordo: "#1001",
    data: "2024-03-15 10:32",
    valor: "R$ 50.000",
    status: "pendente"
  },
  {
    id: "2",
    cliente: "Cliente 2",
    acordo: "#1002",
    data: "2024-03-14 14:20",
    valor: "R$ 100.000",
    status: "aprovado"
  },
  {
    id: "3",
    cliente: "Cliente 3",
    acordo: "#1003",
    data: "2024-03-14 09:15",
    valor: "R$ 150.000",
    status: "aprovado"
  },
  {
    id: "4",
    cliente: "Cliente 4",
    acordo: "#1004",
    data: "2024-03-13 16:45",
    valor: "R$ 75.000",
    status: "pendente"
  },
];

export const ComprovantesTab = () => {
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [busca, setBusca] = useState("");

  const comprovantesFiltered = comprovantesData.filter(comp => {
    const matchStatus = filtroStatus === "todos" || comp.status === filtroStatus;
    const matchBusca = comp.cliente.toLowerCase().includes(busca.toLowerCase()) ||
                       comp.acordo.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchBusca;
  });

  const getStatusBadge = (status: ComprovanteListItem["status"]) => {
    const configs = {
      aprovado: { icon: Check, label: "Conciliado", variant: "default" as const, className: "bg-success text-success-foreground" },
      pendente: { icon: Clock, label: "Aguardando", variant: "secondary" as const, className: "bg-pending text-pending-foreground" },
      rejeitado: { icon: AlertCircle, label: "Pendente", variant: "destructive" as const, className: "bg-destructive text-destructive-foreground" }
    };

    const config = configs[status];
    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif mb-2">Central de Comprovantes</h2>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Aqui estão todos os comprovantes recebidos recentemente — acompanhe e aprove com um clique.
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente ou acordo..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="pendente">Aguardando</SelectItem>
                <SelectItem value="aprovado">Conciliado</SelectItem>
                <SelectItem value="rejeitado">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Comprovantes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-serif">Comprovantes Recentes</CardTitle>
              <CardDescription>{comprovantesFiltered.length} comprovante(s) encontrado(s)</CardDescription>
            </div>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Cliente</TableHead>
                <TableHead className="font-semibold">Acordo</TableHead>
                <TableHead className="font-semibold">Data e Hora</TableHead>
                <TableHead className="font-semibold text-right">Valor</TableHead>
                <TableHead className="font-semibold text-center">Status</TableHead>
                <TableHead className="font-semibold text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comprovantesFiltered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum comprovante encontrado
                  </TableCell>
                </TableRow>
              ) : (
                comprovantesFiltered.map((comp) => (
                  <TableRow key={comp.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{comp.cliente}</TableCell>
                    <TableCell className="text-muted-foreground">{comp.acordo}</TableCell>
                    <TableCell className="text-sm">{comp.data}</TableCell>
                    <TableCell className="text-right font-semibold">{comp.valor}</TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(comp.status)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {comp.status === "pendente" && (
                          <Button size="sm" variant="default">
                            Conciliar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
