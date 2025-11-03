import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, FileText, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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

const contratoSchema = z.object({
  // Busca
  buscaCpf: z.string().optional(),
  
  // Dados Pessoais
  nomeCompleto: z
    .string()
    .trim()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome muito longo"),
  cpf: z
    .string()
    .trim()
    .min(11, "CPF inválido")
    .max(14, "CPF inválido"),
  email: z
    .string()
    .trim()
    .email("Email inválido")
    .max(255, "Email muito longo"),
  telefone: z
    .string()
    .trim()
    .min(10, "Telefone inválido")
    .max(20, "Telefone muito longo"),
  
  // Valores
  valorTotal: z
    .string()
    .min(1, "Valor total é obrigatório"),
  numeroParcelas: z
    .string()
    .min(1, "Número de parcelas é obrigatório"),
  dataInicio: z
    .string()
    .min(1, "Data de início é obrigatória"),
  metodoPagamento: z.enum(["saldo", "pix", "saldo_pix"], {
    required_error: "Selecione um método de pagamento",
  }),
  observacoes: z.string().max(500, "Observações muito longas").optional(),
});

type ContratoFormData = z.infer<typeof contratoSchema>;

interface NovaAquisicaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "busca" | "dados" | "valores" | "revisao";

export const NovaAquisicaoDialog = ({ open, onOpenChange }: NovaAquisicaoDialogProps) => {
  const [currentStep, setCurrentStep] = useState<Step>("busca");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ContratoFormData>({
    resolver: zodResolver(contratoSchema),
    defaultValues: {
      metodoPagamento: "saldo",
    },
  });

  const formData = watch();

  const handleSearchClient = async () => {
    const cpfBusca = formData.buscaCpf;
    
    if (!cpfBusca || cpfBusca.length < 11) {
      toast.error("Digite um CPF válido para buscar");
      return;
    }

    setIsSearching(true);
    
    try {
      // TODO: Integrar com backend para buscar cliente
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulação de dados encontrados
      const clienteExiste = Math.random() > 0.5;
      
      if (clienteExiste) {
        setValue("cpf", cpfBusca);
        setValue("nomeCompleto", "João Silva");
        setValue("email", "joao@email.com");
        setValue("telefone", "(11) 99999-9999");
        
        toast.success("✔ Cliente encontrado", {
          description: "Dados preenchidos automaticamente.",
        });
        
        setCurrentStep("valores");
      } else {
        setValue("cpf", cpfBusca);
        toast.info("Cliente não encontrado", {
          description: "Preencha os dados para criar novo cadastro.",
        });
        setCurrentStep("dados");
      }
    } catch (error) {
      toast.error("Erro ao buscar cliente");
    } finally {
      setIsSearching(false);
    }
  };

  const handleNext = () => {
    if (currentStep === "busca") {
      setCurrentStep("dados");
    } else if (currentStep === "dados") {
      setCurrentStep("valores");
    } else if (currentStep === "valores") {
      setCurrentStep("revisao");
    }
  };

  const handleBack = () => {
    if (currentStep === "revisao") {
      setCurrentStep("valores");
    } else if (currentStep === "valores") {
      setCurrentStep("dados");
    } else if (currentStep === "dados") {
      setCurrentStep("busca");
    }
  };

  const onSubmit = async (data: ContratoFormData) => {
    setIsLoading(true);
    
    try {
      // TODO: Integrar com backend/Supabase
      console.log("Novo contrato:", data);
      
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("✔ Contrato gerado com sucesso", {
        description: "Enviado para assinatura do cliente.",
      });
      
      reset();
      setCurrentStep("busca");
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao gerar contrato", {
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

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>, field: "cpf" | "buscaCpf") => {
    const formatted = formatCPF(e.target.value);
    setValue(field, formatted);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "busca":
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
              <Search className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Busca inteligente</h3>
                <p className="text-sm text-muted-foreground">
                  Localize clientes existentes por CPF, nome ou e-mail e preencha dados automaticamente.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="buscaCpf">Buscar por CPF</Label>
                <div className="flex gap-2">
                  <Input
                    id="buscaCpf"
                    placeholder="000.000.000-00"
                    maxLength={14}
                    {...register("buscaCpf")}
                    onChange={(e) => handleCPFChange(e, "buscaCpf")}
                  />
                  <Button
                    type="button"
                    onClick={handleSearchClient}
                    disabled={isSearching}
                  >
                    {isSearching ? "Buscando..." : "Buscar"}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center py-4">
                <span className="text-sm text-muted-foreground">ou</span>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setCurrentStep("dados")}
              >
                Criar novo cliente
              </Button>
            </div>
          </div>
        );

      case "dados":
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
              <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Dados pessoais</h3>
                <p className="text-sm text-muted-foreground">
                  Preencha as informações do cliente.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nomeCompleto">Nome Completo</Label>
                <Input
                  id="nomeCompleto"
                  placeholder="João Silva"
                  {...register("nomeCompleto")}
                  className={errors.nomeCompleto ? "border-destructive" : ""}
                />
                {errors.nomeCompleto && (
                  <p className="text-sm text-destructive">{errors.nomeCompleto.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  {...register("cpf")}
                  onChange={(e) => handleCPFChange(e, "cpf")}
                  className={errors.cpf ? "border-destructive" : ""}
                />
                {errors.cpf && (
                  <p className="text-sm text-destructive">{errors.cpf.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="joao@email.com"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(11) 99999-9999"
                  {...register("telefone")}
                  className={errors.telefone ? "border-destructive" : ""}
                />
                {errors.telefone && (
                  <p className="text-sm text-destructive">{errors.telefone.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case "valores":
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
              <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Valores e condições</h3>
                <p className="text-sm text-muted-foreground">
                  Defina os termos do investimento.
                </p>
              </div>
            </div>

            <div className="space-y-4">
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
                    className={`pl-10 ${errors.valorTotal ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.valorTotal && (
                  <p className="text-sm text-destructive">{errors.valorTotal.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numeroParcelas">Número de Parcelas</Label>
                  <Input
                    id="numeroParcelas"
                    type="number"
                    placeholder="12"
                    {...register("numeroParcelas")}
                    className={errors.numeroParcelas ? "border-destructive" : ""}
                  />
                  {errors.numeroParcelas && (
                    <p className="text-sm text-destructive">{errors.numeroParcelas.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataInicio">Data de Início</Label>
                  <Input
                    id="dataInicio"
                    type="date"
                    {...register("dataInicio")}
                    className={errors.dataInicio ? "border-destructive" : ""}
                  />
                  {errors.dataInicio && (
                    <p className="text-sm text-destructive">{errors.dataInicio.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metodoPagamento">Método de Pagamento</Label>
                <Select
                  value={formData.metodoPagamento}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações (opcional)</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Informações adicionais sobre o contrato..."
                  rows={3}
                  {...register("observacoes")}
                />
              </div>
            </div>
          </div>
        );

      case "revisao":
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-success mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Revisão completa</h3>
                <p className="text-sm text-muted-foreground">
                  Valide todas as informações antes de gerar o contrato.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <h4 className="font-semibold text-sm text-foreground">Dados do Cliente</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nome:</span>
                    <p className="font-medium">{formData.nomeCompleto}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CPF:</span>
                    <p className="font-medium">{formData.cpf}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Telefone:</span>
                    <p className="font-medium">{formData.telefone}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-3">
                <h4 className="font-semibold text-sm text-foreground">Valores e Condições</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Valor Total:</span>
                    <p className="font-medium text-lg">R$ {formData.valorTotal}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Parcelas:</span>
                    <p className="font-medium">{formData.numeroParcelas}x</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Data de Início:</span>
                    <p className="font-medium">{formData.dataInicio}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pagamento:</span>
                    <p className="font-medium">
                      {formData.metodoPagamento === "saldo" && "Saldo"}
                      {formData.metodoPagamento === "pix" && "PIX"}
                      {formData.metodoPagamento === "saldo_pix" && "Saldo + PIX"}
                    </p>
                  </div>
                </div>
                {formData.observacoes && (
                  <div className="pt-2 border-t">
                    <span className="text-muted-foreground text-sm">Observações:</span>
                    <p className="text-sm mt-1">{formData.observacoes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "busca":
        return "Buscar Cliente";
      case "dados":
        return "Dados Pessoais";
      case "valores":
        return "Valores e Condições";
      case "revisao":
        return "Revisão Final";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {getStepTitle()}
          </DialogTitle>
          <DialogDescription>
            Etapa {currentStep === "busca" ? "1" : currentStep === "dados" ? "2" : currentStep === "valores" ? "3" : "4"} de 4
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {renderStepContent()}

          <div className="flex justify-between gap-3 pt-4 border-t">
            <div>
              {currentStep !== "busca" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              {currentStep !== "revisao" ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                >
                  Avançar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Gerando Contrato..." : "Gerar Contrato"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
