import { useState } from "react";
import { FileText, Search, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data
const contratos = [
  {
    id: "1001",
    cliente: "João Silva",
    cpf: "123.456.789-00",
    valor: "R$ 50.000,00",
    parcelas: 12,
    dataInicio: "01/12/2024",
    status: "assinado",
  },
  {
    id: "1002",
    cliente: "Maria Santos",
    cpf: "987.654.321-00",
    valor: "R$ 100.000,00",
    parcelas: 24,
    dataInicio: "15/11/2024",
    status: "pendente",
  },
  {
    id: "1003",
    cliente: "Pedro Costa",
    cpf: "456.789.123-00",
    valor: "R$ 75.000,00",
    parcelas: 18,
    dataInicio: "20/10/2024",
    status: "assinado",
  },
];

const Contratos = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContratos = contratos.filter(
    (contrato) =>
      contrato.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrato.cpf.includes(searchTerm) ||
      contrato.id.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assinado":
        return "bg-success/20 text-success-foreground";
      case "pendente":
        return "bg-pending/20 text-pending-foreground";
      case "cancelado":
        return "bg-destructive/20 text-destructive-foreground";
      default:
        return "bg-muted";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "assinado":
        return "Assinado";
      case "pendente":
        return "Pendente";
      case "cancelado":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-editorial mx-auto px-8 py-4">
          <h1 className="text-xl font-semibold">Contratos Existentes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visualize e gerencie todos os contratos cadastrados
          </p>
        </div>
      </header>

      <div className="max-w-editorial mx-auto px-8 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Contratos</CardDescription>
              <CardTitle className="text-3xl">{contratos.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Todos os contratos registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Contratos Assinados</CardDescription>
              <CardTitle className="text-3xl text-success">
                {contratos.filter((c) => c.status === "assinado").length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-success">Ativos e funcionando</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Aguardando Assinatura</CardDescription>
              <CardTitle className="text-3xl text-pending">
                {contratos.filter((c) => c.status === "pendente").length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Pendentes de conclusão
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Buscar Contratos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, CPF ou número do contrato..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contratos Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Contratos</CardTitle>
            <CardDescription>
              {filteredContratos.length} contrato(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Contrato</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Parcelas</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContratos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <FileText className="h-8 w-8" />
                        <p>Nenhum contrato encontrado</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContratos.map((contrato) => (
                    <TableRow key={contrato.id}>
                      <TableCell className="font-medium">#{contrato.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {contrato.cliente}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {contrato.cpf}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {contrato.valor}
                      </TableCell>
                      <TableCell>{contrato.parcelas}x</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {contrato.dataInicio}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(contrato.status)}>
                          {getStatusLabel(contrato.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contratos;
