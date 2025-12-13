import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Dados mock de clientes (viriam de Clientes e Agentes)
const clientesMock = [
  { id: "CL001", nome: "Maria Silva", cpf: "123.456.789-00", email: "maria@email.com", telefone: "(11) 99999-1111", dataCadastro: "15/01/2024", agente: "Carlos Ferreira" },
  { id: "CL002", nome: "João Santos", cpf: "234.567.890-11", email: "joao@email.com", telefone: "(11) 99999-2222", dataCadastro: "20/01/2024", agente: "Ana Paula" },
  { id: "CL003", nome: "Ana Oliveira", cpf: "345.678.901-22", email: "ana@email.com", telefone: "(11) 99999-3333", dataCadastro: "05/02/2024", agente: "Carlos Ferreira" },
  { id: "CL004", nome: "Pedro Costa", cpf: "456.789.012-33", email: "pedro@email.com", telefone: "(11) 99999-4444", dataCadastro: "12/02/2024", agente: "Roberto Lima" },
  { id: "CL005", nome: "Carla Souza", cpf: "567.890.123-44", email: "carla@email.com", telefone: "(11) 99999-5555", dataCadastro: "28/02/2024", agente: "Ana Paula" },
];

interface ClientesDetalheModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mes?: string;
  tipo: "ano" | "mes";
}

export function ClientesDetalheModal({ open, onOpenChange, mes, tipo }: ClientesDetalheModalProps) {
  const titulo = tipo === "ano" ? "Novos Clientes do Ano" : `Novos Clientes de ${mes}`;
  const descricao = tipo === "ano" 
    ? "Lista completa de novos clientes cadastrados no ano" 
    : `Novos clientes cadastrados no mês de ${mes}`;

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
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Agente</TableHead>
                <TableHead>Data Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientesMock.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-mono text-xs">{cliente.id}</TableCell>
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell className="text-muted-foreground">{cliente.cpf}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.telefone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{cliente.agente}</Badge>
                  </TableCell>
                  <TableCell>{cliente.dataCadastro}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        
        <div className="flex justify-between items-center pt-4 border-t text-sm text-muted-foreground">
          <span>Total: {clientesMock.length} novos clientes</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
