import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function FichaCadastral() {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Ficha Cadastral Completa</CardTitle>
              <CardDescription>
                Cliente ID: {id} (Implementação completa na Fase 4)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página será implementada na Fase 4 com a visão 360º do cliente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
