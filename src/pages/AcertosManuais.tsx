import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DollarSign, Upload, TrendingUp, TrendingDown, Paperclip, FileCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const acertoSchema = z.object({
  idCliente: z.string().min(1, "Selecione um cliente"),
  tipo: z.enum(["credito", "debito"], { required_error: "Selecione o tipo" }),
  valor: z.string().min(1, "Digite o valor"),
  justificativa: z.string().min(5, "Digite uma justificativa").max(500, "Justificativa muito longa"),
});

type AcertoFormData = z.infer<typeof acertoSchema>;

interface AcertoManual {
  id: string;
  dataLancamento: Date;
  cliente: string;
  tipo: "credito" | "debito";
  valor: number;
  justificativa: string;
  status: "pendente" | "conciliado";
  comprovanteUrl?: string;
}

const acertosMock: AcertoManual[] = [
  {
    id: "1",
    dataLancamento: new Date(2024, 10, 5, 14, 30),
    cliente: "João Silva",
    tipo: "debito",
    valor: 10000,
    justificativa: "Saque via PIX para chave CPF 000.000.000-00",
    status: "pendente",
  },
  {
    id: "2",
    dataLancamento: new Date(2024, 10, 3, 10, 15),
    cliente: "Maria Silva",
    tipo: "credito",
    valor: 500,
    justificativa: "Bônus por indicação de novo cliente",
    status: "conciliado",
  },
];

const clientesMock = [
  { id: "1", nome: "João Silva" },
  { id: "2", nome: "Maria Silva" },
  { id: "3", nome: "Pedro Oliveira" },
  { id: "4", nome: "Ana Costa" },
];

export default function AcertosManuais() {
  const [acertos] = useState<AcertoManual[]>(acertosMock);
  const [modalComprovanteOpen, setModalComprovanteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AcertoFormData>({
    resolver: zodResolver(acertoSchema),
    defaultValues: { tipo: "debito" },
  });

  const formData = watch();

  const onSubmit = (data: AcertoFormData) => {
    toast({
      title: data.tipo === "credito" ? "✓ Crédito lançado" : "✓ Débito lançado",
      description: data.tipo === "credito" ? "Crédito aplicado." : "Saque registrado.",
    });
    reset();
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return (Number(numbers) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-primary" />
          Acertos Manuais
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie créditos e débitos manuais na conta corrente
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lançar Novo Acerto</CardTitle>
          <CardDescription>Registre um crédito ou débito no saldo do cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <Select value={formData.idCliente} onValueChange={(value) => setValue("idCliente", value)}>
                  <SelectTrigger id="cliente">
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {clientesMock.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.idCliente && <p className="text-sm text-destructive">{errors.idCliente.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Tipo *</Label>
                <RadioGroup value={formData.tipo} onValueChange={(v) => setValue("tipo", v as any)} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credito" id="credito" />
                    <Label htmlFor="credito">Crédito</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="debito" id="debito" />
                    <Label htmlFor="debito">Débito</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor *</Label>
                <Input placeholder="0,00" {...register("valor")} onChange={(e) => setValue("valor", formatCurrency(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Justificativa *</Label>
                <Textarea placeholder="Ex: Saque via PIX..." {...register("justificativa")} rows={1} />
              </div>
            </div>

            <Button type="submit" className="w-full">Lançar Acerto</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Extrato de Acertos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Justificativa</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {acertos.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{format(a.dataLancamento, "dd/MM/yyyy HH:mm")}</TableCell>
                  <TableCell>{a.cliente}</TableCell>
                  <TableCell><Badge variant="neutral">{a.tipo === "credito" ? "Crédito" : "Débito"}</Badge></TableCell>
                  <TableCell className={a.tipo === "credito" ? "text-green-600" : "text-red-600"}>
                    {a.tipo === "credito" ? "+" : "-"}R$ {a.valor.toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell className="truncate max-w-xs">{a.justificativa}</TableCell>
                  <TableCell><Badge variant="neutral">{a.status === "conciliado" ? "Conciliado" : "Pendente"}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
