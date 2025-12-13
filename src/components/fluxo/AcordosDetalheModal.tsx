import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Dados mock de acordos (viriam da Carteira de Acordos)
const acordosMock = [
  { id: "AC001", cliente: "Maria Silva", cpf: "123.456.789-00", valor: 45000, status: "Ativo", dataInicio: "15/01/2024" },
  { id: "AC002", cliente: "João Santos", cpf: "234.567.890-11", valor: 32000, status: "Ativo", dataInicio: "20/01/2024" },
  { id: "AC003", cliente: "Ana Oliveira", cpf: "345.678.901-22", valor: 58000, status: "Ativo", dataInicio: "05/02/2024" },
  { id: "AC004", cliente: "Pedro Costa", cpf: "456.789.012-33", valor: 27500, status: "Pendente", dataInicio: "12/02/2024" },
  { id: "AC005", cliente: "Carla Souza", cpf: "567.890.123-44", valor: 41000, status: "Ativo", dataInicio: "28/02/2024" },
  { id: "AC006", cliente: "Roberto Lima", cpf: "678.901.234-55", valor: 63000, status: "Ativo", dataInicio: "10/03/2024" },
  { id: "AC007", cliente: "Fernanda Dias", cpf: "789.012.345-66", valor: 35500, status: "Ativo", dataInicio: "18/03/2024" },
  { id: "AC008", cliente: "Lucas Martins", cpf: "890.123.456-77", valor: 48000, status: "Pendente", dataInicio: "25/03/2024" },
];

interface AcordosDetalheModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mes?: string;
  tipo: "ano" | "mes";
}

export function AcordosDetalheModal({ open, onOpenChange, mes, tipo }: AcordosDetalheModalProps) {
  const titulo = tipo === "ano" ? "Acordos do Ano" : `Acordos de ${mes}`;
  const descricao = tipo === "ano" 
    ? "Lista completa de acordos realizados no ano" 
    : `Acordos realizados no mês de ${mes}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription>{descricao}</DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Data Início</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {acordosMock.map((acordo) => (
                <TableRow key={acordo.id}>
                  <TableCell className="font-mono text-xs">{acordo.id}</TableCell>
                  <TableCell className="font-medium">{acordo.cliente}</TableCell>
                  <TableCell className="text-muted-foreground">{acordo.cpf}</TableCell>
                  <TableCell className="text-right font-semibold">
                    R$ {acordo.valor.toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={acordo.status === "Ativo" ? "default" : "secondary"}>
                      {acordo.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{acordo.dataInicio}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        
        <div className="flex justify-between items-center pt-4 border-t text-sm text-muted-foreground">
          <span>Total: {acordosMock.length} acordos</span>
          <span>Valor total: R$ {acordosMock.reduce((acc, a) => acc + a.valor, 0).toLocaleString("pt-BR")}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
