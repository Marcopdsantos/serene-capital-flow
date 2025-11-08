import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Parcela {
  numero: number;
  dataVencimento: string;
  valor: number;
  status: "paga" | "pendente";
}

interface AcordoDetalhesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  acordo: {
    id: string;
    numeroAcordo: string;
    cliente: string;
    valorTotal: number;
  } | null;
}

const mockParcelas: Parcela[] = [
  { numero: 1, dataVencimento: "28/10/2024", valor: 5000, status: "paga" },
  { numero: 2, dataVencimento: "28/11/2024", valor: 5000, status: "paga" },
  { numero: 3, dataVencimento: "28/12/2024", valor: 5000, status: "paga" },
  { numero: 4, dataVencimento: "28/01/2025", valor: 5000, status: "pendente" },
  { numero: 5, dataVencimento: "28/02/2025", valor: 5000, status: "pendente" },
  { numero: 6, dataVencimento: "28/03/2025", valor: 5000, status: "pendente" },
  { numero: 7, dataVencimento: "28/04/2025", valor: 5000, status: "pendente" },
  { numero: 8, dataVencimento: "28/05/2025", valor: 5000, status: "pendente" },
  { numero: 9, dataVencimento: "28/06/2025", valor: 5000, status: "pendente" },
  { numero: 10, dataVencimento: "28/07/2025", valor: 5000, status: "pendente" },
];

export const AcordoDetalhesModal = ({ open, onOpenChange, acordo }: AcordoDetalhesModalProps) => {
  if (!acordo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Cronograma Completo — {acordo.numeroAcordo}
          </DialogTitle>
          <DialogDescription>
            Cliente: {acordo.cliente} • Valor Total: R$ {acordo.valorTotal.toLocaleString("pt-BR")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-24">Parcela Nº</TableHead>
                <TableHead>Data de Vencimento</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockParcelas.map((parcela) => (
                <TableRow key={parcela.numero}>
                  <TableCell className="font-medium">
                    {parcela.numero}/10
                  </TableCell>
                  <TableCell>{parcela.dataVencimento}</TableCell>
                  <TableCell className="text-right font-semibold">
                    R$ {parcela.valor.toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={parcela.status === "paga" ? "default" : "neutral"}
                      className={parcela.status === "paga" ? "bg-success text-success-foreground" : ""}
                    >
                      {parcela.status === "paga" ? "✓ Paga" : "Pendente"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Nota:</strong> As parcelas são creditadas automaticamente na Conta Corrente do cliente no dia do vencimento, às 05h00.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
