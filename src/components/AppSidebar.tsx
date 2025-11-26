import { LayoutDashboard, Briefcase, Users, DollarSign, FileText, Archive, TrendingUp } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function AppSidebar() {
  const location = useLocation();

  const menuItems = [
    {
      title: "Painel Geral",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Operações",
      icon: Briefcase,
      items: [
        { title: "Mesa de Liquidação", url: "/dashboard/operacoes/mesa-liquidacao" },
        { title: "Carteira de Acordos", url: "/dashboard/operacoes/carteira" },
        { title: "Central de Arquivos", url: "/dashboard/operacoes/arquivos" },
      ],
    },
    {
      title: "Cadastros",
      icon: Users,
      items: [
        { title: "Clientes e Agentes", url: "/dashboard/cadastros/clientes" },
      ],
    },
    {
      title: "Financeiro",
      icon: DollarSign,
      items: [
        { title: "Fluxo de Caixa", url: "/dashboard/financeiro/fluxo" },
        { title: "Acertos Manuais", url: "/dashboard/financeiro/acertos" },
      ],
    },
  ];

  const isActive = (url: string) => location.pathname === url;
  const isGroupActive = (items?: { url: string }[]) => {
    return items?.some((item) => location.pathname === item.url);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <FileText className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">
              Acordo Capital
            </span>
            <span className="text-xs text-sidebar-foreground/60">
              Painel do Gestor
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.items ? (
                  <Collapsible
                    defaultOpen={isGroupActive(item.items)}
                    className="group/collapsible"
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className="w-full"
                        tooltip={item.title}
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(subItem.url)}
                            >
                              <Link to={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url!)}
                    tooltip={item.title}
                  >
                    <Link to={item.url!}>
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
