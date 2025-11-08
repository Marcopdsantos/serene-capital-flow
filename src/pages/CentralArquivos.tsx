import { Archive } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CentralArquivos = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Central de Arquivos</h1>
        <p className="text-muted-foreground mt-1">
          Repositório de documentos e comprovantes
        </p>
      </div>
      
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Archive className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Em desenvolvimento</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CentralArquivos;
