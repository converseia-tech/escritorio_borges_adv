import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import TeamManagement from "@/components/admin/TeamManagement";
import HeroManagement from "@/components/admin/HeroManagement";
import PracticeAreasManagement from "@/components/admin/PracticeAreasManagement";
import AboutManagement from "@/components/admin/AboutManagement";
import BlogsManagement from "@/components/admin/BlogsManagement";
import SiteSettingsManagement from "@/components/admin/SiteSettingsManagement";

export default function Admin() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();

  // Se o OAuth não estiver configurado, simula um usuário admin local
  const isOAuthConfigured = import.meta.env.VITE_OAUTH_PORTAL_URL && import.meta.env.VITE_APP_ID;
  
  // Mock user para desenvolvimento local sem OAuth
  const mockUser = !isOAuthConfigured ? { 
    name: "Admin Local", 
    role: "admin",
    id: "mock-admin"
  } : null;
  
  const effectiveUser = user || mockUser;

  // Redirecionar se não autenticado (usando useEffect para evitar setState durante render)
  useEffect(() => {
    if (isOAuthConfigured && !loading && !user) {
      setLocation("/");
    }
  }, [loading, user, setLocation, isOAuthConfigured]);

  // Verificar se o usuário está autenticado e é admin
  if (isOAuthConfigured && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isOAuthConfigured && !user) {
    return null;
  }

  // Verificar se é admin (role)
  if (effectiveUser && effectiveUser.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar o painel administrativo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = "/"}>
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-sm text-gray-600">Borges Advogados Associados</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Olá, <span className="font-medium">{effectiveUser?.name}</span>
              {!isOAuthConfigured && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Modo Local</span>}
            </span>
            {isOAuthConfigured && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-white p-1">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="areas">Áreas de Atuação</TabsTrigger>
            <TabsTrigger value="equipe">Equipe</TabsTrigger>
            <TabsTrigger value="sobre">Sobre Nós</TabsTrigger>
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bem-vindo!</CardTitle>
                  <CardDescription>
                    Gerencie o conteúdo do site Borges Advogados Associados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Use as abas acima para navegar entre as diferentes seções do painel administrativo.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas</CardTitle>
                  <CardDescription>Visão geral do site</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Áreas de Atuação:</span>
                      <span className="text-sm font-medium">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Membros da Equipe:</span>
                      <span className="text-sm font-medium">10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Blogs Publicados:</span>
                      <span className="text-sm font-medium">0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                  <CardDescription>Acesso rápido às principais funções</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" variant="outline">
                    Adicionar Novo Blog
                  </Button>
                  <Button className="w-full" variant="outline">
                    Gerenciar Equipe
                  </Button>
                  <Button className="w-full" variant="outline">
                    Ver Site
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Hero Section Tab */}
          <TabsContent value="hero">
            <HeroManagement />
          </TabsContent>

          {/* Áreas de Atuação Tab */}
          <TabsContent value="areas">
            <PracticeAreasManagement />
          </TabsContent>

          {/* Equipe Tab */}
          <TabsContent value="equipe">
            <TeamManagement />
          </TabsContent>

          {/* Sobre Nós Tab */}
          <TabsContent value="sobre">
            <AboutManagement />
          </TabsContent>

          {/* Blogs Tab */}
          <TabsContent value="blogs">
            <BlogsManagement />
          </TabsContent>

          {/* Configurações Tab */}
          <TabsContent value="configuracoes">
            <SiteSettingsManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
