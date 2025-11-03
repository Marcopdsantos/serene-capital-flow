import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const dadosFluxo = [
  { mes: "Jan", entradas: 450000, saidas: 380000, saldo: 70000, acordos: 18 },
  { mes: "Fev", entradas: 520000, saidas: 410000, saldo: 110000, acordos: 21 },
  { mes: "Mar", entradas: 680000, saidas: 550000, saldo: 130000, acordos: 28 },
  { mes: "Abr", entradas: 720000, saidas: 580000, saldo: 140000, acordos: 29 },
  { mes: "Mai", entradas: 850000, saidas: 690000, saldo: 160000, acordos: 35 },
  { mes: "Jun", entradas: 920000, saidas: 740000, saldo: 180000, acordos: 38 },
  { mes: "Jul", entradas: 780000, saidas: 620000, saldo: 160000, acordos: 32 },
  { mes: "Ago", entradas: 890000, saidas: 710000, saldo: 180000, acordos: 36 },
  { mes: "Set", entradas: 950000, saidas: 760000, saldo: 190000, acordos: 39 },
  { mes: "Out", entradas: 1020000, saidas: 820000, saldo: 200000, acordos: 42 },
  { mes: "Nov", entradas: 1150000, saidas: 920000, saldo: 230000, acordos: 47 },
  { mes: "Dez", entradas: 1280000, saidas: 1020000, saldo: 260000, acordos: 52 },
];

export const FluxoCaixaTab = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header com descrição e filtros */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-sans font-bold mb-2">Fluxo de Caixa</h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Projeção de fluxo de caixa consolidada — atualizada automaticamente com base nos acordos ativos e conciliados.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Select defaultValue="2024">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="todos">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Clientes</SelectItem>
              <SelectItem value="cliente1">Cliente 1</SelectItem>
              <SelectItem value="cliente2">Cliente 2</SelectItem>
              <SelectItem value="cliente3">Cliente 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Gráfico de Fluxo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-sans font-bold">Visão Temporal</CardTitle>
          <CardDescription>Entradas e saídas mensais projetadas</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={dadosFluxo}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="mes" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '13px'
                }}
                formatter={(value: number) => [
                  `R$ ${value.toLocaleString('pt-BR')}`,
                  ''
                ]}
              />
              <Legend 
                wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }}
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    entradas: 'Entradas Previstas',
                    saidas: 'Saídas',
                    saldo: 'Saldo Projetado'
                  };
                  return labels[value] || value;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="entradas" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2.5}
                dot={{ fill: 'hsl(var(--accent))' }}
              />
              <Line 
                type="monotone" 
                dataKey="saidas" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2.5}
                dot={{ fill: 'hsl(var(--destructive))' }}
              />
              <Line 
                type="monotone" 
                dataKey="saldo" 
                stroke="hsl(var(--success))" 
                strokeWidth={2.5}
                dot={{ fill: 'hsl(var(--success))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-sans font-bold">Detalhamento Mensal</CardTitle>
          <CardDescription>Consolidação completa por período</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Mês</TableHead>
                <TableHead className="font-semibold text-right">Entradas Previstas</TableHead>
                <TableHead className="font-semibold text-right">Saídas</TableHead>
                <TableHead className="font-semibold text-right">Saldo Projetado</TableHead>
                <TableHead className="font-semibold text-center">Nº de Acordos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dadosFluxo.map((linha) => (
                <TableRow key={linha.mes} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{linha.mes}</TableCell>
                  <TableCell className="text-right text-accent font-semibold numeric-value">
                    R$ {linha.entradas.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right text-destructive numeric-value">
                    R$ {linha.saidas.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right text-success font-semibold numeric-value">
                    R$ {linha.saldo.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-muted text-xs font-medium">
                      {linha.acordos}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
