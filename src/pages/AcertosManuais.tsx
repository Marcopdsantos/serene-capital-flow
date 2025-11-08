import { ComprovantesTab } from "@/components/ComprovantesTab";

const AcertosManuais = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Acertos Manuais</h1>
        <p className="text-muted-foreground mt-1">
          Lançamento de créditos, débitos e gerenciamento de comprovantes
        </p>
      </div>
      <ComprovantesTab />
    </div>
  );
};

export default AcertosManuais;
