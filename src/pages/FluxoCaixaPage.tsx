import { FluxoCaixaTab } from "@/components/FluxoCaixaTab";

const FluxoCaixaPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Fluxo de Caixa</h1>
        <p className="text-muted-foreground mt-1">
          Projeção financeira e análise de entradas e saídas
        </p>
      </div>
      <FluxoCaixaTab />
    </div>
  );
};

export default FluxoCaixaPage;
