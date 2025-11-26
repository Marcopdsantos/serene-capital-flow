import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { NovaAquisicaoDialog } from "@/components/NovaAquisicaoDialog";

const DashboardLayout = () => {
  const [openNovaAquisicao, setOpenNovaAquisicao] = useState(false);
  const location = useLocation();

  // Deep linking: Abrir modal automaticamente quando vier da Mesa de Liquidação
  useEffect(() => {
    if (location.state?.openNovaAquisicao) {
      setOpenNovaAquisicao(true);
      // Limpar o state para evitar reabrir o modal ao navegar novamente
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>
            <NovaAquisicaoDialog 
              open={openNovaAquisicao} 
              onOpenChange={setOpenNovaAquisicao}
            />
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
