import { AcordosDetalhadosTab } from "@/components/AcordosDetalhadosTab";

const CarteiraAcordos = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Carteira de Acordos</h1>
        <p className="text-muted-foreground mt-1">
          Visualize todos os acordos ativos e finalizados
        </p>
      </div>
      <AcordosDetalhadosTab />
    </div>
  );
};

export default CarteiraAcordos;
