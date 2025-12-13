import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import DashboardLayout from "./pages/DashboardLayout";
import PainelGeral from "./pages/PainelGeral";
import CarteiraAcordos from "./pages/CarteiraAcordos";
import CentralArquivos from "./pages/CentralArquivos";
import ClientesAgentes from "./pages/ClientesAgentes";
import FichaCadastral from "./pages/FichaCadastral";
import FluxoCaixaPage from "./pages/FluxoCaixaPage";
import AcertosManuais from "./pages/AcertosManuais";
import ComissoesAgentes from "./pages/ComissoesAgentes";
import MesaLiquidacao from "./pages/MesaLiquidacao";
import ClientPortal from "./pages/ClientPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<PainelGeral />} />
            <Route path="operacoes/carteira" element={<CarteiraAcordos />} />
            <Route path="operacoes/arquivos" element={<CentralArquivos />} />
            <Route path="cadastros/clientes" element={<ClientesAgentes />} />
            <Route path="cadastros/clientes/:id" element={<FichaCadastral />} />
            <Route path="financeiro/fluxo" element={<FluxoCaixaPage />} />
            <Route path="financeiro/acertos" element={<AcertosManuais />} />
            <Route path="financeiro/comissoes" element={<ComissoesAgentes />} />
            <Route path="operacoes/mesa-liquidacao" element={<MesaLiquidacao />} />
          </Route>
          <Route path="/portal" element={<ClientPortal />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
