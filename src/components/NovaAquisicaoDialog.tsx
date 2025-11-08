import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, Search, ChevronRight, ChevronLeft, FileText, CheckCircle, CalendarIcon, User, Home, Briefcase, X, Building2, UserCheck } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DefinirSignatarioModal } from "@/components/DefinirSignatarioModal";
import { currencyToWords } from "@/lib/numberToWords";
import { Badge } from "@/components/ui/badge";
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

const acordoSchema = z.object({
  valorAporte: z.string().min(1, "Valor do aporte é obrigatório"),
  valorViaSaldo: z.string().optional(),
  valorViaPix: z.string().optional(),
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
  metodoPagamento: z.enum(["saldo", "pix", "saldo_pix"], {
    required_error: "Selecione um método de pagamento",
  }),
  observacoes: z.string().max(500, "Observações muito longas").optional(),
});

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
  
  // Array de Acordos
  acordos: z.array(acordoSchema).min(1, "Adicione ao menos um acordo"),
});

type AquisicaoFormData = z.infer<typeof aquisicaoSchema>;

interface NovaAquisicaoDialogProps {
  onSuccess?: () => void;
}

type Step = "busca" | "dados" | "investimento" | "signatario" | "revisao";
type TipoVenda = "direta" | "via_agente";

// Mock de agentes para seleção
const agentesMock = [
  { id: "1", nome: "Carlos Vendedor" },
  { id: "2", nome: "Juliana Corretora" },
  { id: "3", nome: "Roberto Agente" },
];

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
  
  // Estados para tipo de venda
  const [tipoVenda, setTipoVenda] = useState<TipoVenda>("direta");
  const [agenteSelecionado, setAgenteSelecionado] = useState<string>("");
  const [valorBruto, setValorBruto] = useState<string>("");
  const [comissaoAgente, setComissaoAgente] = useState<string>("");
  const [valorLiquido, setValorLiquido] = useState<string>("");
  
  // Estado para modal de signatário
  const [modalSignatarioOpen, setModalSignatarioOpen] = useState(false);
  const [signatarioId, setSignatarioId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    trigger,
    control,
  } = useForm<AquisicaoFormData>({
    resolver: zodResolver(aquisicaoSchema),
    defaultValues: {
      estadoCivil: "",
      estado: "",
      tipoConta: "",
      acordos: [{
        valorAporte: "",
        valorViaSaldo: "",
        valorViaPix: "",
        valorParcela: "",
        valorTotalReceber: "",
        valorAporteExtenso: "",
        valorParcelaExtenso: "",
        valorTotalExtenso: "",
        prazoMeses: "",
        diaVencimento: "",
        metodoPagamento: "saldo",
        observacoes: "",
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "acordos",
  });

  const formData = watch();

  // Auto-preencher valores por extenso para cada acordo
  useEffect(() => {
    formData.acordos?.forEach((acordo, index) => {
      if (acordo.valorAporte) {
        const extenso = currencyToWords(acordo.valorAporte);
        setValue(`acordos.${index}.valorAporteExtenso`, extenso);
      }
      if (acordo.valorParcela) {
        const extenso = currencyToWords(acordo.valorParcela);
        setValue(`acordos.${index}.valorParcelaExtenso`, extenso);
      }
      if (acordo.valorTotalReceber) {
        const extenso = currencyToWords(acordo.valorTotalReceber);
        setValue(`acordos.${index}.valorTotalExtenso`, extenso);
      }
    });
  }, [formData.acordos, setValue]);

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
        isValid = await trigger("acordos");
        if (isValid) {
          // Validações adicionais para venda via agente
          if (tipoVenda === "via_agente") {
            if (!agenteSelecionado) {
              toast.error("Selecione um agente comissionado");
              return;
            }
            if (!valorBruto || !comissaoAgente) {
              toast.error("Preencha o valor bruto e a comissão");
              return;
            }
          }
          
          // Validar soma de pagamentos para todos os acordos
          const todasSomasValidas = formData.acordos?.every((_, index) => validarSomaPagamentos(index));
          if (!todasSomasValidas) {
            toast.error("Verifique a soma dos pagamentos", {
              description: "A soma de Saldo + PIX deve ser igual ao valor do aporte em todos os acordos",
            });
            return;
          }
          
          setModalSignatarioOpen(true);
        }
        break;
      case "signatario":
        setCurrentStep("revisao");
        break;
    }
  };

  const handlePrevStep = () => {
    const steps: Step[] = ["busca", "dados", "investimento", "signatario", "revisao"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleConfirmarSignatario = (idSignatario: string | null) => {
    setSignatarioId(idSignatario);
    setCurrentStep("revisao");
  };
  
  // Calcular valor líquido automaticamente
  const calcularValorLiquido = () => {
    if (tipoVenda === "via_agente" && valorBruto && comissaoAgente) {
      const bruto = parseFloat(valorBruto.replace(/\./g, "").replace(",", "."));
      const comissao = parseFloat(comissaoAgente.replace(/\./g, "").replace(",", "."));
      const liquido = bruto - comissao;
      return liquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
    }
    return "0,00";
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

  const parseFormattedCurrency = (value: string): number => {
    if (!value) return 0;
    const numbers = value.replace(/\./g, "").replace(",", ".");
    return parseFloat(numbers) || 0;
  };

  const validarSomaPagamentos = (index: number): boolean => {
    const acordo = formData.acordos?.[index];
    if (!acordo) return true;
    
    const aporte = parseFormattedCurrency(acordo.valorAporte);
    const saldo = parseFormattedCurrency(acordo.valorViaSaldo || "0");
    const pix = parseFormattedCurrency(acordo.valorViaPix || "0");
    
    if (aporte === 0) return true;
    
    return Math.abs((saldo + pix) - aporte) < 0.01;
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
      { id: "signatario", label: "Signatário", icon: FileText },
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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">Dados do Investimento</h3>
          <p className="text-sm text-muted-foreground">
            Configure um ou múltiplos acordos — todos farão parte do mesmo contrato
          </p>
        </div>
      </div>

      {/* Toggle Tipo de Venda */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Tipo de Venda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={tipoVenda}
            onValueChange={(value) => {
              setTipoVenda(value as TipoVenda);
              // Limpar campos ao trocar tipo
              if (value === "direta") {
                setAgenteSelecionado("");
                setValorBruto("");
                setComissaoAgente("");
                setValorLiquido("");
              }
            }}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="direta" id="venda-direta" />
              <Label htmlFor="venda-direta" className="cursor-pointer flex-1">
                <div className="font-medium">Venda Direta</div>
                <p className="text-sm text-muted-foreground">
                  Venda direta ao investidor, sem intermediação
                </p>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="via_agente" id="via-agente" />
              <Label htmlFor="via-agente" className="cursor-pointer flex-1">
                <div className="font-medium">Venda via Agente Comissionado</div>
                <p className="text-sm text-muted-foreground">
                  Venda intermediada por agente (com comissão)
                </p>
              </Label>
            </div>
          </RadioGroup>

          {/* Campos condicionais para Venda via Agente */}
          {tipoVenda === "via_agente" && (
            <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="agente-select">Agente Comissionado *</Label>
                <Select value={agenteSelecionado} onValueChange={setAgenteSelecionado}>
                  <SelectTrigger id="agente-select" className="bg-background">
                    <SelectValue placeholder="Selecione o agente" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {agentesMock.map((agente) => (
                      <SelectItem key={agente.id} value={agente.id}>
                        {agente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor-bruto">Valor Bruto (Cessão) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      R$
                    </span>
                    <Input
                      id="valor-bruto"
                      placeholder="0,00"
                      value={valorBruto}
                      onChange={(e) => {
                        const formatted = formatCurrency(e.target.value);
                        setValorBruto(formatted);
                      }}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Valor que consta no contrato
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comissao">Comissão do Agente *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      R$
                    </span>
                    <Input
                      id="comissao"
                      placeholder="0,00"
                      value={comissaoAgente}
                      onChange={(e) => {
                        const formatted = formatCurrency(e.target.value);
                        setComissaoAgente(formatted);
                      }}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Valor pago ao agente
                  </p>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Valor Líquido (Aporte do Investidor)
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Bruto - Comissão = Líquido
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    R$ {calcularValorLiquido()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {fields.map((field, index) => (
        <Card key={field.id} className="relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Acordo {index + 1} {fields.length > 1 && `de ${fields.length}`}
              </CardTitle>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`acordos.${index}.valorAporte`}>Valor do Aporte *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  R$
                </span>
                <Input
                  id={`acordos.${index}.valorAporte`}
                  placeholder="0,00"
                  {...register(`acordos.${index}.valorAporte`)}
                  onChange={(e) => {
                    const formatted = formatCurrency(e.target.value);
                    setValue(`acordos.${index}.valorAporte`, formatted);
                  }}
                  className={`pl-10 ${errors.acordos?.[index]?.valorAporte ? "border-error" : ""}`}
                />
              </div>
              {errors.acordos?.[index]?.valorAporte && (
                <p className="text-sm text-error">{errors.acordos[index]?.valorAporte?.message}</p>
              )}
            </div>

            {formData.acordos?.[index]?.valorAporteExtenso && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm text-muted-foreground capitalize">
                  {formData.acordos[index].valorAporteExtenso}
                </p>
              </div>
            )}

            <Separator />

            {/* Definição do Pagamento */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Definição do Pagamento</Label>
                {formData.acordos?.[index]?.valorAporte && !validarSomaPagamentos(index) && (
                  <Badge variant="destructive" className="text-xs">
                    Soma inválida
                  </Badge>
                )}
                {formData.acordos?.[index]?.valorAporte && validarSomaPagamentos(index) && (
                  <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    ✓ Soma válida
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Especifique como o aporte será pago. A soma dos valores deve ser igual ao valor do aporte.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`acordos.${index}.valorViaSaldo`}>Valor via Saldo em Conta</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      R$
                    </span>
                    <Input
                      id={`acordos.${index}.valorViaSaldo`}
                      placeholder="0,00"
                      {...register(`acordos.${index}.valorViaSaldo`)}
                      onChange={(e) => {
                        const formatted = formatCurrency(e.target.value);
                        setValue(`acordos.${index}.valorViaSaldo`, formatted);
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`acordos.${index}.valorViaPix`}>Valor via PIX/Cheque</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      R$
                    </span>
                    <Input
                      id={`acordos.${index}.valorViaPix`}
                      placeholder="0,00"
                      {...register(`acordos.${index}.valorViaPix`)}
                      onChange={(e) => {
                        const formatted = formatCurrency(e.target.value);
                        setValue(`acordos.${index}.valorViaPix`, formatted);
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {formData.acordos?.[index]?.valorAporte && (
                <div className={cn(
                  "p-3 rounded-md border transition-colors",
                  validarSomaPagamentos(index) 
                    ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" 
                    : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
                )}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      Soma: R$ {(
                        parseFormattedCurrency(formData.acordos[index].valorViaSaldo || "0") +
                        parseFormattedCurrency(formData.acordos[index].valorViaPix || "0")
                      ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm font-medium">
                      Aporte: R$ {parseFormattedCurrency(formData.acordos[index].valorAporte).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  {!validarSomaPagamentos(index) && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                      A soma dos valores (Saldo + PIX) deve ser igual ao valor do aporte
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`acordos.${index}.valorParcela`}>Valor da Parcela *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    R$
                  </span>
                  <Input
                    id={`acordos.${index}.valorParcela`}
                    placeholder="0,00"
                    {...register(`acordos.${index}.valorParcela`)}
                    onChange={(e) => {
                      const formatted = formatCurrency(e.target.value);
                      setValue(`acordos.${index}.valorParcela`, formatted);
                    }}
                    className={`pl-10 ${errors.acordos?.[index]?.valorParcela ? "border-error" : ""}`}
                  />
                </div>
                {errors.acordos?.[index]?.valorParcela && (
                  <p className="text-sm text-error">{errors.acordos[index]?.valorParcela?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`acordos.${index}.valorTotalReceber`}>Valor Total a Receber *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    R$
                  </span>
                  <Input
                    id={`acordos.${index}.valorTotalReceber`}
                    placeholder="0,00"
                    {...register(`acordos.${index}.valorTotalReceber`)}
                    onChange={(e) => {
                      const formatted = formatCurrency(e.target.value);
                      setValue(`acordos.${index}.valorTotalReceber`, formatted);
                    }}
                    className={`pl-10 ${errors.acordos?.[index]?.valorTotalReceber ? "border-error" : ""}`}
                  />
                </div>
                {errors.acordos?.[index]?.valorTotalReceber && (
                  <p className="text-sm text-error">{errors.acordos[index]?.valorTotalReceber?.message}</p>
                )}
              </div>
            </div>

            {formData.acordos?.[index]?.valorParcelaExtenso && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Valor da Parcela (por extenso)</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {formData.acordos[index].valorParcelaExtenso}
                </p>
              </div>
            )}

            {formData.acordos?.[index]?.valorTotalExtenso && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Valor Total a Receber (por extenso)</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {formData.acordos[index].valorTotalExtenso}
                </p>
              </div>
            )}

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`acordos.${index}.prazoMeses`}>Prazo (meses) *</Label>
                <Input
                  id={`acordos.${index}.prazoMeses`}
                  type="number"
                  placeholder="12"
                  {...register(`acordos.${index}.prazoMeses`)}
                  className={errors.acordos?.[index]?.prazoMeses ? "border-error" : ""}
                />
                {errors.acordos?.[index]?.prazoMeses && (
                  <p className="text-sm text-error">{errors.acordos[index]?.prazoMeses?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`acordos.${index}.diaVencimento`}>Dia de Vencimento *</Label>
                <Select
                  value={formData.acordos?.[index]?.diaVencimento}
                  onValueChange={(value) => setValue(`acordos.${index}.diaVencimento`, value)}
                >
                  <SelectTrigger id={`acordos.${index}.diaVencimento`} className={errors.acordos?.[index]?.diaVencimento ? "border-error" : ""}>
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
                {errors.acordos?.[index]?.diaVencimento && (
                  <p className="text-sm text-error">{errors.acordos[index]?.diaVencimento?.message}</p>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor={`acordos.${index}.dataInicioContrato`}>Data de Início do Contrato *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.acordos?.[index]?.dataInicioContrato && "text-muted-foreground",
                      errors.acordos?.[index]?.dataInicioContrato && "border-error"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.acordos?.[index]?.dataInicioContrato ? (
                      format(formData.acordos[index].dataInicioContrato, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>dd/mm/aaaa</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.acordos?.[index]?.dataInicioContrato}
                    onSelect={(date) => date && setValue(`acordos.${index}.dataInicioContrato`, date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.acordos?.[index]?.dataInicioContrato && (
                <p className="text-sm text-error">{errors.acordos[index]?.dataInicioContrato?.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`acordos.${index}.dataPrimeiroPagamento`}>Data do 1º Pagamento *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.acordos?.[index]?.dataPrimeiroPagamento && "text-muted-foreground",
                        errors.acordos?.[index]?.dataPrimeiroPagamento && "border-error"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.acordos?.[index]?.dataPrimeiroPagamento ? (
                        format(formData.acordos[index].dataPrimeiroPagamento, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>dd/mm/aaaa</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.acordos?.[index]?.dataPrimeiroPagamento}
                      onSelect={(date) => date && setValue(`acordos.${index}.dataPrimeiroPagamento`, date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.acordos?.[index]?.dataPrimeiroPagamento && (
                  <p className="text-sm text-error">{errors.acordos[index]?.dataPrimeiroPagamento?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`acordos.${index}.dataUltimoPagamento`}>Data do Último Pagamento *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.acordos?.[index]?.dataUltimoPagamento && "text-muted-foreground",
                        errors.acordos?.[index]?.dataUltimoPagamento && "border-error"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.acordos?.[index]?.dataUltimoPagamento ? (
                        format(formData.acordos[index].dataUltimoPagamento, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>dd/mm/aaaa</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.acordos?.[index]?.dataUltimoPagamento}
                      onSelect={(date) => date && setValue(`acordos.${index}.dataUltimoPagamento`, date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.acordos?.[index]?.dataUltimoPagamento && (
                  <p className="text-sm text-error">{errors.acordos[index]?.dataUltimoPagamento?.message}</p>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor={`acordos.${index}.metodoPagamento`}>Método de Pagamento *</Label>
              <Select
                value={formData.acordos?.[index]?.metodoPagamento}
                onValueChange={(value) => setValue(`acordos.${index}.metodoPagamento`, value as "saldo" | "pix" | "saldo_pix")}
              >
                <SelectTrigger id={`acordos.${index}.metodoPagamento`}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saldo">Saldo Interno</SelectItem>
                  <SelectItem value="pix">PIX/Transferência</SelectItem>
                  <SelectItem value="saldo_pix">Saldo + PIX</SelectItem>
                </SelectContent>
              </Select>
              {errors.acordos?.[index]?.metodoPagamento && (
                <p className="text-sm text-error">{errors.acordos[index]?.metodoPagamento?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`acordos.${index}.observacoes`}>Observações</Label>
              <Textarea
                id={`acordos.${index}.observacoes`}
                placeholder="Ex: Pix até dia 25, desconto 2k, saldo a compensar"
                {...register(`acordos.${index}.observacoes`)}
                className="resize-none"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({
          valorAporte: "",
          valorViaSaldo: "",
          valorViaPix: "",
          valorParcela: "",
          valorTotalReceber: "",
          valorAporteExtenso: "",
          valorParcelaExtenso: "",
          valorTotalExtenso: "",
          prazoMeses: "",
          diaVencimento: "",
          metodoPagamento: "saldo",
          observacoes: "",
        })}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Outro Acordo ao Contrato
      </Button>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Contrato unificado:</strong> Todos os acordos adicionados farão parte do mesmo contrato, 
            compartilhando os dados do cliente e gerando um único documento para assinatura digital.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderRevisaoStep = () => {
    const totalAportes = formData.acordos?.reduce((sum, acordo) => {
      const valor = parseFloat(acordo.valorAporte?.replace(/\./g, "").replace(",", ".") || "0");
      return sum + valor;
    }, 0) || 0;

    const totalReceber = formData.acordos?.reduce((sum, acordo) => {
      const valor = parseFloat(acordo.valorTotalReceber?.replace(/\./g, "").replace(",", ".") || "0");
      return sum + valor;
    }, 0) || 0;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Revisão Final</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Confira todas as informações antes de gerar a aquisição com {formData.acordos?.length || 0} acordo(s).
          </p>
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">Resumo Financeiro do Contrato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total de Acordos:</span>
              <span className="font-semibold">{formData.acordos?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Soma dos Aportes:</span>
              <span className="font-semibold">
                R$ {totalAportes.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Soma Total a Receber:</span>
              <span className="font-semibold text-primary">
                R$ {totalReceber.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </CardContent>
        </Card>

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

      {formData.acordos?.map((acordo, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-base">Acordo {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor do Aporte:</span>
              <span className="font-medium">R$ {acordo.valorAporte}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor da Parcela:</span>
              <span className="font-medium">R$ {acordo.valorParcela}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor Total a Receber:</span>
              <span className="font-medium">R$ {acordo.valorTotalReceber}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prazo:</span>
              <span className="font-medium">{acordo.prazoMeses} meses</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dia de Vencimento:</span>
              <span className="font-medium">Dia {acordo.diaVencimento}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data de Início:</span>
              <span className="font-medium">
                {acordo.dataInicioContrato && format(acordo.dataInicioContrato, "dd/MM/yyyy")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">1º Pagamento:</span>
              <span className="font-medium">
                {acordo.dataPrimeiroPagamento && format(acordo.dataPrimeiroPagamento, "dd/MM/yyyy")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Último Pagamento:</span>
              <span className="font-medium">
                {acordo.dataUltimoPagamento && format(acordo.dataUltimoPagamento, "dd/MM/yyyy")}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Método de Pagamento:</span>
              <span className="font-medium capitalize">
                {acordo.metodoPagamento === "saldo" ? "Saldo Interno" : 
                 acordo.metodoPagamento === "pix" ? "PIX/Transferência" : 
                 "Saldo + PIX"}
              </span>
            </div>
            {acordo.observacoes && (
              <>
                <Separator />
                <div className="space-y-1">
                  <span className="text-muted-foreground">Observações:</span>
                  <p className="font-medium text-xs">{acordo.observacoes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
      </div>
    );
  };

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
            {currentStep === "signatario" && (
              <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Aguardando definição do signatário...</p>
              </div>
            )}
            {currentStep === "revisao" && renderRevisaoStep()}
          </div>

          {/* Navegação */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === "busca" || currentStep === "signatario" || isLoading}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            {currentStep !== "revisao" && currentStep !== "signatario" ? (
              <Button type="button" onClick={handleNextStep} disabled={isLoading}>
                Próxima Etapa
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : currentStep === "revisao" ? (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Gerando..." : "Gerar Aquisição"}
              </Button>
            ) : null}
          </div>
        </form>
      </DialogContent>
      
      {/* Modal de Definir Signatário */}
      <DefinirSignatarioModal
        open={modalSignatarioOpen}
        onOpenChange={setModalSignatarioOpen}
        nomeBeneficiario={formData.nomeCliente || "Cliente"}
        onConfirmar={handleConfirmarSignatario}
      />
    </Dialog>
  );
};
