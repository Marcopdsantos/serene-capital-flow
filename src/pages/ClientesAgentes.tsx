import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Search, User, Briefcase } from "lucide-react";

interface Cliente {
  id: string;
  nome: string;
  tipo: "investidor" | "agente";
  numAcordos: number;
  saldoConta: number;
  cpf?: string;
  cnpj?: string;
}

const clientesMock: Cliente[] = [
  { id: "1", nome: "João Silva", tipo: "investidor", numAcordos: 5, saldoConta: 15250, cpf: "123.456.789-00" },
  { id: "2", nome: "Maria Silva", tipo: "investidor", numAcordos: 2, saldoConta: 8500, cpf: "987.654.321-00" },
  { id: "3", nome: "Carlos Vendedor", tipo: "agente", numAcordos: 8, saldoConta: 12000, cnpj: "12.345.678/0001-90" },
];

export default function ClientesAgentes() {
  const navigate = useNavigate();
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "investidor" | "agente">("todos");
  const [busca, setBusca] = useState("");

  const clientesFiltrados = clientesMock.filter((c) => {
    const matchTipo = filtroTipo === "todos" || c.tipo === filtroTipo;
    const matchBusca = 
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.cpf?.replace(/\D/g, '').includes(busca.replace(/\D/g, '')) ||
      c.cnpj?.replace(/\D/g, '').includes(busca.replace(/\D/g, ''));
    return matchTipo && matchBusca;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Clientes e Agentes
          </h1>
          <p className="text-muted-foreground mt-2">Gerencie todos os cadastros</p>
        </div>
        <div className="flex gap-2">
          <Button><Plus className="mr-2 h-4 w-4" />Novo Cliente</Button>
          <Button variant="outline"><Plus className="mr-2 h-4 w-4" />Novo Agente</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listagem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome, CPF ou CNPJ..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-10" />
          </div>

          <Tabs value={filtroTipo} onValueChange={(v) => setFiltroTipo(v as any)}>
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="investidor">Investidores</TabsTrigger>
              <TabsTrigger value="agente">Agentes</TabsTrigger>
            </TabsList>
          </Tabs>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Acordos</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientesFiltrados.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.nome}</TableCell>
                  <TableCell><Badge variant="neutral">{c.tipo === "investidor" ? "Investidor" : "Agente"}</Badge></TableCell>
                  <TableCell>{c.numAcordos}</TableCell>
                  <TableCell className="font-semibold">R$ {c.saldoConta.toLocaleString("pt-BR")}</TableCell>
                  <TableCell><Button size="sm" onClick={() => navigate(`/dashboard/cadastros/clientes/${c.id}`)}>Ver Ficha</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
