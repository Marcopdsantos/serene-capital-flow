import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Search, ChevronRight, ChevronLeft, X, FileText, CheckCircle } from "lucide-react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const acordoSchema = z.object({
  valor: z.string().min(1, "Valor é obrigatório"),
  numeroParcelas: z.string().min(1, "Número de parcelas é obrigatório"),
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
});

const aquisicaoSchema = z.object({
  // Dados do Cliente
  cpf: z.string().trim().min(11, "CPF inválido").max(14, "CPF inválido"),
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
  // Acordos
  acordos: z.array(acordoSchema).min(1, "Adicione pelo menos um acordo"),
  // Pagamento
  metodoPagamento: z.enum(["saldo", "pix", "saldo_pix"], {
    required_error: "Selecione um método de pagamento",
  }),
  observacoes: z.string().max(500, "Observações muito longas").optional(),
});

type AquisicaoFormData = z.infer<typeof aquisicaoSchema>;
type Acordo = z.infer<typeof acordoSchema>;

interface NovaAquisicaoDialogProps {
  onSuccess?: () => void;
}

type Step = "busca" | "dados" | "acordos" | "revisao";

export const NovaAquisicaoDialog = ({ onSuccess }: NovaAquisicaoDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("busca");
  const [searchTerm, setSearchTerm] = useState("");
  const [acordos, setAcordos] = useState<Acordo[]>([]);
  const [editingAcordo, setEditingAcordo] = useState<Acordo>({
    valor: "",
    numeroParcelas: "",
    dataInicio: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    trigger,
  } = useForm<AquisicaoFormData>({
    resolver: zodResolver(aquisicaoSchema),
    defaultValues: {
      metodoPagamento: "saldo",
      acordos: [],
    },
  });

  const metodoPagamento = watch("metodoPagamento");
  const formData = watch();

  const handleSearch = () => {
    // TODO: Integrar com backend para buscar cliente
    toast.info("Busca em desenvolvimento", {
      description: "Em breve você poderá buscar clientes existentes.",
    });
  };

  const handleNextStep = async () => {
    let isValid = false;
    
    switch (currentStep) {
      case "busca":
        setCurrentStep("dados");
        return;
      case "dados":
        isValid = await trigger(["cpf", "nomeCliente", "emailCliente", "telefoneCliente"]);
        if (isValid) setCurrentStep("acordos");
        break;
      case "acordos":
        if (acordos.length === 0) {
          toast.error("Adicione pelo menos um acordo");
          return;
        }
        setValue("acordos", acordos);
        setCurrentStep("revisao");
        break;
    }
  };

  const handlePrevStep = () => {
    const steps: Step[] = ["busca", "dados", "acordos", "revisao"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleAddAcordo = () => {
    if (!editingAcordo.valor || !editingAcordo.numeroParcelas || !editingAcordo.dataInicio) {
      toast.error("Preencha todos os campos do acordo");
      return;
    }
    
    setAcordos([...acordos, editingAcordo]);
    setEditingAcordo({ valor: "", numeroParcelas: "", dataInicio: "" });
    toast.success("Acordo adicionado");
  };

  const handleRemoveAcordo = (index: number) => {
    setAcordos(acordos.filter((_, i) => i !== index));
    toast.success("Acordo removido");
  };

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
      setAcordos([]);
      setCurrentStep("busca");
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

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const calculateTotal = () => {
    return acordos.reduce((sum, acordo) => {
      const valor = Number(acordo.valor.replace(/[^\d,]/g, "").replace(",", "."));
      return sum + valor;
    }, 0);
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: "busca", label: "Busca", icon: Search },
      { id: "dados", label: "Dados", icon: FileText },
      { id: "acordos", label: "Acordos", icon: Plus },
      { id: "revisao", label: "Revisão", icon: CheckCircle },
    ];

    const currentIndex = steps.findIndex((s) => s.id === currentStep);

    return (
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = index < currentIndex;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                      ? "bg-success text-success-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <StepIcon className="h-5 w-5" />
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-colors ${
                    isCompleted ? "bg-success" : "bg-muted"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderBuscaStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Busca Inteligente</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Localize clientes existentes por CPF, nome ou e-mail e preencha dados automaticamente.
        </p>
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Digite CPF, nome ou email do cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleSearch} variant="secondary">
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>

      <Separator />

      <div>
        <p className="text-sm text-muted-foreground">
          Cliente não encontrado? Continue para cadastrar um novo cliente.
        </p>
      </div>
    </div>
  );

  const renderDadosStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Dados do Cliente</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Preencha as informações pessoais do cliente.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            id="cpf"
            placeholder="000.000.000-00"
            {...register("cpf")}
            onChange={(e) => {
              const formatted = formatCPF(e.target.value);
              setValue("cpf", formatted);
            }}
            className={errors.cpf ? "border-error" : ""}
          />
          {errors.cpf && (
            <p className="text-sm text-error">{errors.cpf.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nomeCliente">Nome Completo *</Label>
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
            <Label htmlFor="emailCliente">Email *</Label>
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
            <Label htmlFor="telefoneCliente">Telefone *</Label>
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
    </div>
  );

  const renderAcordosStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Acordos</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Adicione um ou mais acordos para esta aquisição.
        </p>
      </div>

      {/* Lista de Acordos Adicionados */}
      {acordos.length > 0 && (
        <div className="space-y-3">
          {acordos.map((acordo, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold">
                      Acordo #{index + 1} - R$ {acordo.valor}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {acordo.numeroParcelas}x parcelas • Início: {new Date(acordo.dataInicio).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAcordo(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Separator />
        </div>
      )}

      {/* Formulário de Novo Acordo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Novo Acordo</CardTitle>
          <CardDescription>
            Preencha os detalhes do acordo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valorAcordo">Valor do Acordo</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  R$
                </span>
                <Input
                  id="valorAcordo"
                  placeholder="0,00"
                  value={editingAcordo.valor}
                  onChange={(e) => {
                    const formatted = formatCurrency(e.target.value);
                    setEditingAcordo({ ...editingAcordo, valor: formatted });
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroParcelas">Número de Parcelas</Label>
              <Input
                id="numeroParcelas"
                type="number"
                placeholder="12"
                value={editingAcordo.numeroParcelas}
                onChange={(e) =>
                  setEditingAcordo({ ...editingAcordo, numeroParcelas: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataInicio">Data de Início</Label>
            <Input
              id="dataInicio"
              type="date"
              value={editingAcordo.dataInicio}
              onChange={(e) =>
                setEditingAcordo({ ...editingAcordo, dataInicio: e.target.value })
              }
            />
          </div>

          <Button onClick={handleAddAcordo} variant="secondary" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Acordo
          </Button>
        </CardContent>
      </Card>

      {acordos.length > 0 && (
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-semibold">
            Total: R$ {calculateTotal().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {acordos.length} acordo(s) adicionado(s)
          </p>
        </div>
      )}
    </div>
  );

  const renderRevisaoStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Revisão Final</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Confira todas as informações antes de gerar a aquisição.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados do Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">CPF:</span>
            <span className="font-medium">{formData.cpf}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nome:</span>
            <span className="font-medium">{formData.nomeCliente}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium">{formData.emailCliente}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Telefone:</span>
            <span className="font-medium">{formData.telefoneCliente}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Acordos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {acordos.map((acordo, index) => (
            <div key={index} className="p-3 bg-muted rounded-lg">
              <p className="font-semibold text-sm">Acordo #{index + 1}</p>
              <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Valor:</span>
                  <p className="font-medium">R$ {acordo.valor}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Parcelas:</span>
                  <p className="font-medium">{acordo.numeroParcelas}x</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Início:</span>
                  <p className="font-medium">{new Date(acordo.dataInicio).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm font-semibold">Valor Total:</span>
            <span className="text-lg font-bold">
              R$ {calculateTotal().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Textarea
              id="observacoes"
              placeholder="Informações adicionais sobre a aquisição..."
              rows={3}
              {...register("observacoes")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nova Aquisição
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Nova Aquisição</DialogTitle>
          <DialogDescription>
            Sistema completo de geração de aquisição de acordos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {renderStepIndicator()}

          <div className="min-h-[400px]">
            {currentStep === "busca" && renderBuscaStep()}
            {currentStep === "dados" && renderDadosStep()}
            {currentStep === "acordos" && renderAcordosStep()}
            {currentStep === "revisao" && renderRevisaoStep()}
          </div>

          {/* Navegação */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === "busca" || isLoading}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            {currentStep !== "revisao" ? (
              <Button type="button" onClick={handleNextStep} disabled={isLoading}>
                Continuar
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Gerando..." : "Gerar Aquisição"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
