import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { FileText, DollarSign, RefreshCw, UserPlus } from "lucide-react";

const dadosFluxo = [
  { mes: "Jan", acordos: 18, valorAportado: 450000, novosClientes: 5, renovacoes: 13 },
  { mes: "Fev", acordos: 21, valorAportado: 520000, novosClientes: 7, renovacoes: 14 },
  { mes: "Mar", acordos: 28, valorAportado: 680000, novosClientes: 9, renovacoes: 19 },
  { mes: "Abr", acordos: 29, valorAportado: 720000, novosClientes: 8, renovacoes: 21 },
  { mes: "Mai", acordos: 35, valorAportado: 850000, novosClientes: 12, renovacoes: 23 },
  { mes: "Jun", acordos: 38, valorAportado: 920000, novosClientes: 10, renovacoes: 28 },
  { mes: "Jul", acordos: 32, valorAportado: 780000, novosClientes: 8, renovacoes: 24 },
  { mes: "Ago", acordos: 36, valorAportado: 890000, novosClientes: 11, renovacoes: 25 },
  { mes: "Set", acordos: 39, valorAportado: 950000, novosClientes: 9, renovacoes: 30 },
  { mes: "Out", acordos: 42, valorAportado: 1020000, novosClientes: 13, renovacoes: 29 },
  { mes: "Nov", acordos: 47, valorAportado: 1150000, novosClientes: 15, renovacoes: 32 },
  { mes: "Dez", acordos: 52, valorAportado: 1280000, novosClientes: 14, renovacoes: 38 },
];

// Calcular totais e médias para KPIs
const totalAcordos = dadosFluxo.reduce((acc, item) => acc + item.acordos, 0);
const totalAportado = dadosFluxo.reduce((acc, item) => acc + item.valorAportado, 0);
const totalNovosClientes = dadosFluxo.reduce((acc, item) => acc + item.novosClientes, 0);
const totalRenovacoes = dadosFluxo.reduce((acc, item) => acc + item.renovacoes, 0);
const taxaRenovacao = Math.round((totalRenovacoes / totalAcordos) * 100);

export const FluxoCaixaTab = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header com descrição e filtros */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-sans font-bold mb-2">Fluxo de Caixa</h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Visão consolidada de acordos e valores aportados por período.
          </p>
        </div>
        
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
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Acordos no Ano</p>
                <p className="text-2xl font-bold">{totalAcordos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valores Aportados</p>
                <p className="text-2xl font-bold">R$ {(totalAportado / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <RefreshCw className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Renovação</p>
                <p className="text-2xl font-bold">{taxaRenovacao}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <UserPlus className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Novos Clientes</p>
                <p className="text-2xl font-bold">{totalNovosClientes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Barras */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-sans font-bold">Acordos e Aportes por Mês</CardTitle>
          <CardDescription>Quantidade de acordos e valores aportados mensalmente</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={dadosFluxo}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="mes" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                yAxisId="left"
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
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
                formatter={(value: number, name: string) => {
                  if (name === 'valorAportado') {
                    return [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor Aportado'];
                  }
                  return [value, 'Acordos'];
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }}
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    acordos: 'Acordos',
                    valorAportado: 'Valor Aportado'
                  };
                  return labels[value] || value;
                }}
              />
              <Bar 
                yAxisId="left"
                dataKey="acordos" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                yAxisId="right"
                dataKey="valorAportado" 
                fill="hsl(var(--accent))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela Simplificada */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-sans font-bold">Detalhamento Mensal</CardTitle>
          <CardDescription>Resumo por período</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Mês</TableHead>
                <TableHead className="font-semibold text-center">Acordos</TableHead>
                <TableHead className="font-semibold text-right">Valor Aportado</TableHead>
                <TableHead className="font-semibold text-center">Novos Clientes</TableHead>
                <TableHead className="font-semibold text-center">Renovações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dadosFluxo.map((linha) => (
                <TableRow key={linha.mes} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{linha.mes}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {linha.acordos}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-accent font-semibold numeric-value">
                    R$ {linha.valorAportado.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                      {linha.novosClientes}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                      {linha.renovacoes}
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
