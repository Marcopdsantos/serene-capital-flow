import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, Search, ChevronRight, ChevronLeft, FileText, CheckCircle, CalendarIcon, User, Home, Briefcase } from "lucide-react";
import { currencyToWords } from "@/lib/numberToWords";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const aquisicaoSchema = z.object({
  // Dados Pessoais
  nomeCliente: z
    .string()
    .trim()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome muito longo"),
  cpf: z.string().trim().min(11, "CPF inválido").max(14, "CPF inválido"),
  rg: z.string().trim().min(5, "RG inválido").max(20, "RG inválido"),
  nacionalidade: z.string().trim().min(2, "Nacionalidade é obrigatória"),
  estadoCivil: z.string().min(1, "Estado civil é obrigatório"),
  profissao: z.string().trim().min(2, "Profissão é obrigatória"),
  
  // Contato
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
  
  // Endereço
  enderecoCompleto: z.string().trim().min(5, "Endereço é obrigatório"),
  cidade: z.string().trim().min(2, "Cidade é obrigatória"),
  estado: z.string().min(2, "Estado é obrigatório"),
  cep: z.string().trim().min(8, "CEP inválido").max(9, "CEP inválido"),
  
  // Dados Bancários
  banco: z.string().trim().min(2, "Banco é obrigatório"),
  tipoConta: z.string().min(1, "Tipo de conta é obrigatório"),
  agencia: z.string().trim().min(1, "Agência é obrigatória"),
  conta: z.string().trim().min(1, "Conta é obrigatória"),
  
  // Dados do Investimento
  valorAporte: z.string().min(1, "Valor do aporte é obrigatório"),
  valorParcela: z.string().min(1, "Valor da parcela é obrigatório"),
  valorTotalReceber: z.string().min(1, "Valor total é obrigatório"),
  valorAporteExtenso: z.string().optional(),
  valorParcelaExtenso: z.string().optional(),
  valorTotalExtenso: z.string().optional(),
  prazoMeses: z.string().min(1, "Prazo é obrigatório"),
  diaVencimento: z.string().min(1, "Dia de vencimento é obrigatório"),
  dataInicioContrato: z.date({ required_error: "Data de início é obrigatória" }),
  dataPrimeiroPagamento: z.date({ required_error: "Data do 1º pagamento é obrigatória" }),
  dataUltimoPagamento: z.date({ required_error: "Data do último pagamento é obrigatória" }),
  
  // Pagamento
  metodoPagamento: z.enum(["saldo", "pix", "saldo_pix"], {
    required_error: "Selecione um método de pagamento",
  }),
  observacoes: z.string().max(500, "Observações muito longas").optional(),
});

type AquisicaoFormData = z.infer<typeof aquisicaoSchema>;

interface NovaAquisicaoDialogProps {
  onSuccess?: () => void;
}

type Step = "busca" | "dados" | "investimento" | "revisao";

const ESTADOS_BRASIL = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export const NovaAquisicaoDialog = ({ onSuccess }: NovaAquisicaoDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("busca");
  const [searchTerm, setSearchTerm] = useState("");

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
      estadoCivil: "",
      estado: "",
      tipoConta: "",
      diaVencimento: "",
    },
  });

  const metodoPagamento = watch("metodoPagamento");
  const formData = watch();
  const valorAporte = watch("valorAporte");
  const valorParcela = watch("valorParcela");
  const valorTotalReceber = watch("valorTotalReceber");

  // Auto-preencher valores por extenso
  useEffect(() => {
    if (valorAporte) {
      const extenso = currencyToWords(valorAporte);
      setValue("valorAporteExtenso", extenso);
    }
  }, [valorAporte, setValue]);

  useEffect(() => {
    if (valorParcela) {
      const extenso = currencyToWords(valorParcela);
      setValue("valorParcelaExtenso", extenso);
    }
  }, [valorParcela, setValue]);

  useEffect(() => {
    if (valorTotalReceber) {
      const extenso = currencyToWords(valorTotalReceber);
      setValue("valorTotalExtenso", extenso);
    }
  }, [valorTotalReceber, setValue]);

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
        isValid = await trigger([
          "cpf", "rg", "nomeCliente", "nacionalidade", "estadoCivil", "profissao",
          "emailCliente", "telefoneCliente", "enderecoCompleto", "cidade", "estado", "cep",
          "banco", "tipoConta", "agencia", "conta"
        ]);
        if (isValid) setCurrentStep("investimento");
        break;
      case "investimento":
        isValid = await trigger([
          "valorAporte", "valorParcela", "valorTotalReceber", "prazoMeses", "diaVencimento",
          "dataInicioContrato", "dataPrimeiroPagamento", "dataUltimoPagamento"
        ]);
        if (isValid) setCurrentStep("revisao");
        break;
    }
  };

  const handlePrevStep = () => {
    const steps: Step[] = ["busca", "dados", "investimento", "revisao"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
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

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9);
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: "busca", label: "Busca", icon: Search },
      { id: "dados", label: "Dados Pessoais", icon: User },
      { id: "investimento", label: "Investimento", icon: Briefcase },
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
        <h3 className="text-lg font-semibold mb-2">Dados Pessoais</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Informações básicas e documentos do investidor
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <Label htmlFor="rg">RG *</Label>
              <Input
                id="rg"
                placeholder="00.000.000-0"
                {...register("rg")}
                className={errors.rg ? "border-error" : ""}
              />
              {errors.rg && (
                <p className="text-sm text-error">{errors.rg.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nacionalidade">Nacionalidade *</Label>
              <Input
                id="nacionalidade"
                placeholder="Brasileira"
                {...register("nacionalidade")}
                className={errors.nacionalidade ? "border-error" : ""}
              />
              {errors.nacionalidade && (
                <p className="text-sm text-error">{errors.nacionalidade.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estadoCivil">Estado Civil *</Label>
              <Select
                value={formData.estadoCivil}
                onValueChange={(value) => setValue("estadoCivil", value)}
              >
                <SelectTrigger id="estadoCivil" className={errors.estadoCivil ? "border-error" : ""}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                  <SelectItem value="casado">Casado(a)</SelectItem>
                  <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                  <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                  <SelectItem value="uniao_estavel">União Estável</SelectItem>
                </SelectContent>
              </Select>
              {errors.estadoCivil && (
                <p className="text-sm text-error">{errors.estadoCivil.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profissao">Profissão *</Label>
            <Input
              id="profissao"
              placeholder="Advogado"
              {...register("profissao")}
              className={errors.profissao ? "border-error" : ""}
            />
            {errors.profissao && (
              <p className="text-sm text-error">{errors.profissao.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emailCliente">E-mail *</Label>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Endereço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="enderecoCompleto">Endereço Completo *</Label>
            <Input
              id="enderecoCompleto"
              placeholder="Rua exemplo, 123, Bairro"
              {...register("enderecoCompleto")}
              className={errors.enderecoCompleto ? "border-error" : ""}
            />
            {errors.enderecoCompleto && (
              <p className="text-sm text-error">{errors.enderecoCompleto.message}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade *</Label>
              <Input
                id="cidade"
                placeholder="São Paulo"
                {...register("cidade")}
                className={errors.cidade ? "border-error" : ""}
              />
              {errors.cidade && (
                <p className="text-sm text-error">{errors.cidade.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado *</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => setValue("estado", value)}
              >
                <SelectTrigger id="estado" className={errors.estado ? "border-error" : ""}>
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS_BRASIL.map((uf) => (
                    <SelectItem key={uf} value={uf}>
                      {uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.estado && (
                <p className="text-sm text-error">{errors.estado.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cep">CEP *</Label>
              <Input
                id="cep"
                placeholder="00000-000"
                {...register("cep")}
                onChange={(e) => {
                  const formatted = formatCEP(e.target.value);
                  setValue("cep", formatted);
                }}
                className={errors.cep ? "border-error" : ""}
              />
              {errors.cep && (
                <p className="text-sm text-error">{errors.cep.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados Bancários</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="banco">Banco *</Label>
              <Input
                id="banco"
                placeholder="Inter"
                {...register("banco")}
                className={errors.banco ? "border-error" : ""}
              />
              {errors.banco && (
                <p className="text-sm text-error">{errors.banco.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoConta">Tipo de Conta *</Label>
              <Select
                value={formData.tipoConta}
                onValueChange={(value) => setValue("tipoConta", value)}
              >
                <SelectTrigger id="tipoConta" className={errors.tipoConta ? "border-error" : ""}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corrente">Conta Corrente</SelectItem>
                  <SelectItem value="poupanca">Conta Poupança</SelectItem>
                  <SelectItem value="pagamento">Conta Pagamento</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipoConta && (
                <p className="text-sm text-error">{errors.tipoConta.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agencia">Agência *</Label>
              <Input
                id="agencia"
                placeholder="0001"
                {...register("agencia")}
                className={errors.agencia ? "border-error" : ""}
              />
              {errors.agencia && (
                <p className="text-sm text-error">{errors.agencia.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="conta">Conta *</Label>
              <Input
                id="conta"
                placeholder="12345-6"
                {...register("conta")}
                className={errors.conta ? "border-error" : ""}
              />
              {errors.conta && (
                <p className="text-sm text-error">{errors.conta.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="button" onClick={handleNextStep} className="w-full">
        Próxima Etapa
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );

  const renderInvestimentoStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Dados do Investimento</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Valores, prazos e condições financeiras do contrato
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Valores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="valorAporte">Valor do Aporte *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                R$
              </span>
              <Input
                id="valorAporte"
                placeholder="0,00"
                {...register("valorAporte")}
                onChange={(e) => {
                  const formatted = formatCurrency(e.target.value);
                  setValue("valorAporte", formatted);
                }}
                className={`pl-10 ${errors.valorAporte ? "border-error" : ""}`}
              />
            </div>
            {errors.valorAporte && (
              <p className="text-sm text-error">{errors.valorAporte.message}</p>
            )}
          </div>

          {formData.valorAporteExtenso && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm text-muted-foreground capitalize">
                {formData.valorAporteExtenso}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valorParcela">Valor da Parcela (R$) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  R$
                </span>
                <Input
                  id="valorParcela"
                  placeholder="0,00"
                  {...register("valorParcela")}
                  onChange={(e) => {
                    const formatted = formatCurrency(e.target.value);
                    setValue("valorParcela", formatted);
                  }}
                  className={`pl-10 ${errors.valorParcela ? "border-error" : ""}`}
                />
              </div>
              {errors.valorParcela && (
                <p className="text-sm text-error">{errors.valorParcela.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorTotalReceber">Valor Total a Receber (R$) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  R$
                </span>
                <Input
                  id="valorTotalReceber"
                  placeholder="0,00"
                  {...register("valorTotalReceber")}
                  onChange={(e) => {
                    const formatted = formatCurrency(e.target.value);
                    setValue("valorTotalReceber", formatted);
                  }}
                  className={`pl-10 ${errors.valorTotalReceber ? "border-error" : ""}`}
                />
              </div>
              {errors.valorTotalReceber && (
                <p className="text-sm text-error">{errors.valorTotalReceber.message}</p>
              )}
            </div>
          </div>

          {formData.valorParcelaExtenso && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Valor da Parcela (por extenso)</p>
              <p className="text-sm text-muted-foreground capitalize">
                {formData.valorParcelaExtenso}
              </p>
            </div>
          )}

          {formData.valorTotalExtenso && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Valor Total a Receber (por extenso)</p>
              <p className="text-sm text-muted-foreground capitalize">
                {formData.valorTotalExtenso}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Prazo e Vencimento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prazoMeses">Prazo (meses) *</Label>
              <Input
                id="prazoMeses"
                type="number"
                placeholder="12"
                {...register("prazoMeses")}
                className={errors.prazoMeses ? "border-error" : ""}
              />
              {errors.prazoMeses && (
                <p className="text-sm text-error">{errors.prazoMeses.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="diaVencimento">Dia de Vencimento *</Label>
              <Select
                value={formData.diaVencimento}
                onValueChange={(value) => setValue("diaVencimento", value)}
              >
                <SelectTrigger id="diaVencimento" className={errors.diaVencimento ? "border-error" : ""}>
                  <SelectValue placeholder="Selecione o dia" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((dia) => (
                    <SelectItem key={dia} value={dia.toString()}>
                      Dia {dia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.diaVencimento && (
                <p className="text-sm text-error">{errors.diaVencimento.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Datas do Contrato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dataInicioContrato">Data de Início do Contrato *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dataInicioContrato && "text-muted-foreground",
                    errors.dataInicioContrato && "border-error"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dataInicioContrato ? (
                    format(formData.dataInicioContrato, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    <span>dd/mm/aaaa</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dataInicioContrato}
                  onSelect={(date) => date && setValue("dataInicioContrato", date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {errors.dataInicioContrato && (
              <p className="text-sm text-error">{errors.dataInicioContrato.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataPrimeiroPagamento">Data do 1º Pagamento *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dataPrimeiroPagamento && "text-muted-foreground",
                      errors.dataPrimeiroPagamento && "border-error"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dataPrimeiroPagamento ? (
                      format(formData.dataPrimeiroPagamento, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>dd/mm/aaaa</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dataPrimeiroPagamento}
                    onSelect={(date) => date && setValue("dataPrimeiroPagamento", date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.dataPrimeiroPagamento && (
                <p className="text-sm text-error">{errors.dataPrimeiroPagamento.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataUltimoPagamento">Data do Último Pagamento *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dataUltimoPagamento && "text-muted-foreground",
                      errors.dataUltimoPagamento && "border-error"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dataUltimoPagamento ? (
                      format(formData.dataUltimoPagamento, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>dd/mm/aaaa</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dataUltimoPagamento}
                    onSelect={(date) => date && setValue("dataUltimoPagamento", date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.dataUltimoPagamento && (
                <p className="text-sm text-error">{errors.dataUltimoPagamento.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Atenção:</strong> Na próxima etapa, você poderá revisar todos os dados inseridos 
            antes de gerar o contrato final e enviá-lo para assinatura digital.
          </p>
        </CardContent>
      </Card>
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
          <CardTitle className="text-base">Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nome:</span>
            <span className="font-medium">{formData.nomeCliente}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">CPF:</span>
            <span className="font-medium">{formData.cpf}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">RG:</span>
            <span className="font-medium">{formData.rg}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nacionalidade:</span>
            <span className="font-medium">{formData.nacionalidade}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estado Civil:</span>
            <span className="font-medium capitalize">{formData.estadoCivil}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Profissão:</span>
            <span className="font-medium">{formData.profissao}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium">{formData.emailCliente}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Telefone:</span>
            <span className="font-medium">{formData.telefoneCliente}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Endereço:</span>
            <span className="font-medium">{formData.enderecoCompleto}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cidade/UF:</span>
            <span className="font-medium">{formData.cidade}/{formData.estado}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">CEP:</span>
            <span className="font-medium">{formData.cep}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados Bancários</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Banco:</span>
            <span className="font-medium">{formData.banco}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tipo de Conta:</span>
            <span className="font-medium capitalize">{formData.tipoConta}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Agência:</span>
            <span className="font-medium">{formData.agencia}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Conta:</span>
            <span className="font-medium">{formData.conta}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados do Investimento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Valor do Aporte:</span>
            <span className="font-medium">R$ {formData.valorAporte}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Valor da Parcela:</span>
            <span className="font-medium">R$ {formData.valorParcela}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Valor Total a Receber:</span>
            <span className="font-medium">R$ {formData.valorTotalReceber}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Prazo:</span>
            <span className="font-medium">{formData.prazoMeses} meses</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Dia de Vencimento:</span>
            <span className="font-medium">Dia {formData.diaVencimento}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Data de Início:</span>
            <span className="font-medium">
              {formData.dataInicioContrato && format(formData.dataInicioContrato, "dd/MM/yyyy")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">1º Pagamento:</span>
            <span className="font-medium">
              {formData.dataPrimeiroPagamento && format(formData.dataPrimeiroPagamento, "dd/MM/yyyy")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Último Pagamento:</span>
            <span className="font-medium">
              {formData.dataUltimoPagamento && format(formData.dataUltimoPagamento, "dd/MM/yyyy")}
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
            {currentStep === "investimento" && renderInvestimentoStep()}
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
                Próxima Etapa
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
