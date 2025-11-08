import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Comprovante {
  id: string;
  cliente: string;
  acordo: string;
  aquisicao: string;
  data: string;
  valorAnexo: string;
  valorEsperado: string;
  status: "pendente" | "aprovado" | "aguardando" | "rejeitado";
}

const mockComprovantes: Comprovante[] = [
  {
    id: "1",
    cliente: "Marcos Silva",
    acordo: "#1001",
    aquisicao: "AQ-2024-001",
    data: "15/03/2024",
    valorAnexo: "R$ 149.500,00",
    valorEsperado: "R$ 150.000,00",
    status: "pendente"
  },
  {
    id: "2",
    cliente: "Ana Costa",
    acordo: "#1002",
    aquisicao: "AQ-2024-002",
    data: "16/03/2024",
    valorAnexo: "R$ 200.000,00",
    valorEsperado: "R$ 200.000,00",
    status: "aprovado"
  },
  {
    id: "3",
    cliente: "Pedro Santos",
    acordo: "#1003",
    aquisicao: "AQ-2024-001",
    data: "17/03/2024",
    valorAnexo: "R$ 95.000,00",
    valorEsperado: "R$ 95.000,00",
    status: "aguardando"
  }
];

export const ComprovantesTab = () => {
  const [comprovantes, setComprovantes] = useState<Comprovante[]>(mockComprovantes);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [mostrarApenasPendentes, setMostrarApenasPendentes] = useState(false);

  const comprovantesFiltrados = comprovantes.filter(comp => {
    const matchBusca = comp.cliente.toLowerCase().includes(busca.toLowerCase()) ||
                      comp.acordo.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === "todos" || comp.status === filtroStatus;
    const matchPendentes = !mostrarApenasPendentes || comp.status === "pendente";
    return matchBusca && matchStatus && matchPendentes;
  });

  const conciliarTodos = () => {
    const pendentes = comprovantes.filter(c => c.status === "pendente");
    if (pendentes.length === 0) {
      toast({
        title: "Nenhum comprovante pendente",
        description: "Todos os comprovantes já foram conciliados.",
      });
      return;
    }

    setComprovantes(prev =>
      prev.map(c => c.status === "pendente" ? { ...c, status: "aprovado" as const } : c)
    );

    toast({
      title: "✓ Comprovantes conciliados",
      description: `${pendentes.length} comprovante(s) conciliado(s) com sucesso.`,
      className: "animate-fade-in"
    });
  };

  const conciliarItem = (id: string) => {
    setComprovantes(prev =>
      prev.map(c => c.id === id ? { ...c, status: "aprovado" as const } : c)
    );

    toast({
      title: "✓ Comprovante conciliado",
      description: "Pagamento confirmado — valores atualizados no fluxo.",
      className: "animate-fade-in"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Aqui estão todos os comprovantes recebidos recentemente — acompanhe e aprove com um clique.
            <br />
            <span className="text-xs">Cada comprovante é automaticamente vinculado ao acordo e à aquisição correspondente.</span>
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={conciliarTodos}
          className="hover:bg-success/10 hover:text-success-foreground hover:border-success/50 transition-all"
        >
          Conciliar todos pendentes
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente ou acordo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="pendente">🟡 Pendente</SelectItem>
            <SelectItem value="aprovado">🟢 Conciliado</SelectItem>
            <SelectItem value="aguardando">🔵 Anexado</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={mostrarApenasPendentes ? "default" : "outline"}
          size="sm"
          onClick={() => setMostrarApenasPendentes(!mostrarApenasPendentes)}
        >
          Mostrar apenas pendentes
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Cliente</th>
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Acordo</th>
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Aquisição</th>
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Data</th>
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Valor Anexo</th>
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Valor Esperado</th>
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Diferença</th>
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Status</th>
                <th className="text-left py-4 px-4 text-sm font-sans font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {comprovantesFiltrados.map((comp) => {
                const valorAnexo = parseFloat(comp.valorAnexo.replace(/[^\d,]/g, "").replace(",", "."));
                const valorEsperado = parseFloat(comp.valorEsperado.replace(/[^\d,]/g, "").replace(",", "."));
                const diferenca = ((valorAnexo - valorEsperado) / valorEsperado) * 100;
                const diferencaFormatada = diferenca.toFixed(2);

                return (
                  <tr key={comp.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-medium">{comp.cliente}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-muted-foreground">{comp.acordo}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-muted-foreground">{comp.aquisicao}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm">{comp.data}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold numeric-value">{comp.valorAnexo}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-muted-foreground numeric-value">{comp.valorEsperado}</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="neutral">
                        {diferenca > 0 ? '+' : ''}{diferencaFormatada}%
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="neutral">
                        {comp.status === "aprovado" && "🟢 Conciliado"}
                        {comp.status === "pendente" && "🟡 Pendente"}
                        {comp.status === "aguardando" && "🔵 Anexado"}
                        {comp.status === "rejeitado" && "🔴 Rejeitado"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        {comp.status !== "aprovado" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => conciliarItem(comp.id)}
                            className="bg-success/10 hover:bg-success/20 text-success-foreground border-success/30 hover:border-success/50 transition-all"
                          >
                            Conciliar
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          Ver
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {comprovantesFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum comprovante encontrado</p>
          </div>
        )}
      </Card>
    </div>
  );
};
