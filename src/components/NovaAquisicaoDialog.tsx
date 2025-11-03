import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const acordoSchema = z.object({
  valor: z.string().min(1, "Valor é obrigatório"),
  numeroParcelas: z.string().min(1, "Número de parcelas é obrigatório"),
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
});

const aquisicaoSchema = z.object({
  nomeCliente: z
    .string()
    .trim()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome muito longo"),
  emailCliente: z
    .string()
    .trim()
    .email("Email inválido")
    .max(255, "Email muito longo"),
  telefoneCliente: z
    .string()
    .trim()
    .min(10, "Telefone inválido")
    .max(20, "Telefone muito longo"),
  valorTotal: z
    .string()
    .min(1, "Valor total é obrigatório")
    .refine((val) => !isNaN(Number(val.replace(/[^\d,]/g, "").replace(",", "."))), {
      message: "Valor inválido",
    }),
  metodoPagamento: z.enum(["saldo", "pix", "saldo_pix"], {
    required_error: "Selecione um método de pagamento",
  }),
  observacoes: z.string().max(500, "Observações muito longas").optional(),
});

type AquisicaoFormData = z.infer<typeof aquisicaoSchema>;

interface NovaAquisicaoDialogProps {
  onSuccess?: () => void;
}

export const NovaAquisicaoDialog = ({ onSuccess }: NovaAquisicaoDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<AquisicaoFormData>({
    resolver: zodResolver(aquisicaoSchema),
    defaultValues: {
      metodoPagamento: "saldo",
    },
  });

  const metodoPagamento = watch("metodoPagamento");

  const onSubmit = async (data: AquisicaoFormData) => {
    setIsLoading(true);
    
    try {
      // TODO: Integrar com backend/Supabase quando estiver configurado
      console.log("Nova aquisição:", data);
      
      // Simulação de API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("✔ Aquisição criada com sucesso", {
        description: "Aguardando assinatura do cliente.",
      });
      
      reset();
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Erro ao criar aquisição", {
        description: "Por favor, tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const formatted = (Number(numbers) / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    });
    return formatted;
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setValue("valorTotal", formatted);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="font-sans">
          <Plus className="mr-2 h-4 w-4" />
          Nova Aquisição
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Nova Aquisição</DialogTitle>
          <DialogDescription className="font-sans">
            Registre uma nova operação de investimento na plataforma.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* Dados do Cliente */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b pb-2">
              Dados do Cliente
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="nomeCliente">Nome Completo</Label>
              <Input
                id="nomeCliente"
                placeholder="João Silva"
                {...register("nomeCliente")}
                className={errors.nomeCliente ? "border-error" : ""}
              />
              {errors.nomeCliente && (
                <p className="text-sm text-error">{errors.nomeCliente.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emailCliente">Email</Label>
                <Input
                  id="emailCliente"
                  type="email"
                  placeholder="joao@email.com"
                  {...register("emailCliente")}
                  className={errors.emailCliente ? "border-error" : ""}
                />
                {errors.emailCliente && (
                  <p className="text-sm text-error">{errors.emailCliente.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefoneCliente">Telefone</Label>
                <Input
                  id="telefoneCliente"
                  placeholder="(11) 99999-9999"
                  {...register("telefoneCliente")}
                  className={errors.telefoneCliente ? "border-error" : ""}
                />
                {errors.telefoneCliente && (
                  <p className="text-sm text-error">{errors.telefoneCliente.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Dados da Aquisição */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b pb-2">
              Dados da Aquisição
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valorTotal">Valor Total</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    R$
                  </span>
                  <Input
                    id="valorTotal"
                    placeholder="0,00"
                    {...register("valorTotal")}
                    onChange={handleCurrencyChange}
                    className={`pl-10 ${errors.valorTotal ? "border-error" : ""}`}
                  />
                </div>
                {errors.valorTotal && (
                  <p className="text-sm text-error">{errors.valorTotal.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="metodoPagamento">Método de Pagamento</Label>
                <Select
                  value={metodoPagamento}
                  onValueChange={(value) =>
                    setValue("metodoPagamento", value as "saldo" | "pix" | "saldo_pix")
                  }
                >
                  <SelectTrigger id="metodoPagamento">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="saldo">Saldo</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="saldo_pix">Saldo + PIX</SelectItem>
                  </SelectContent>
                </Select>
                {errors.metodoPagamento && (
                  <p className="text-sm text-error">{errors.metodoPagamento.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações (opcional)</Label>
              <Textarea
                id="observacoes"
                placeholder="Informações adicionais sobre a aquisição..."
                rows={3}
                {...register("observacoes")}
                className={errors.observacoes ? "border-error" : ""}
              />
              {errors.observacoes && (
                <p className="text-sm text-error">{errors.observacoes.message}</p>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Criando..." : "Criar Aquisição"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
