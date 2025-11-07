import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Upload, Check, X, Database } from "lucide-react";

export default function SiteSettingsManagement() {
  const { data: settings, isLoading, refetch } = trpc.site.getSiteSettings.useQuery();
  const updateMutation = trpc.admin.updateSiteSettings.useMutation();

  const [formData, setFormData] = useState({
    logoUrl: "",
    faviconUrl: "",
    socialMedia: {
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      whatsapp: "",
    },
  });

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  // Supabase connection test state
  const [testingConnection, setTestingConnection] = useState(false);
  const [savingCredentials, setSavingCredentials] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");
  const [supabaseCredentials, setSupabaseCredentials] = useState({
    url: "https://qzcdkfaaivwpfdpxchpl.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6Y2RrZmFhaXZ3cGZkcHhjaHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwOTkxMjEsImV4cCI6MjA3NzY3NTEyMX0.5vnVzkJjMz4z8-zQFBNPdSHqcUP1DGAYacXZLhGrltA",
    serviceRole: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6Y2RrZmFhaXZ3cGZkcHhjaHBsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjA5OTEyMSwiZXhwIjoyMDc3Njc1MTIxfQ.Z6txcid7SzcuwigCPtLO9Ie-VBT2GRnNTcsXYwD78Vo",
    databaseUrl: "postgresql://postgres.qzcdkfaaivwpfdpxchpl:ConverseIA2025%21@aws-1-us-east-2.pooler.supabase.com:6543/postgres",
  });

  // Initialize form data when settings load
  useEffect(() => {
    if (settings) {
      // JSONB do PostgreSQL já retorna objetos, não precisa fazer JSON.parse()
      const socialMedia = settings.socialMedia as { 
        facebook?: string; 
        instagram?: string; 
        linkedin?: string;
        twitter?: string;
        whatsapp?: string;
      } | null || {};

      setFormData({
        logoUrl: settings.logoUrl || "",
        faviconUrl: settings.faviconUrl || "",
        socialMedia: {
          facebook: socialMedia.facebook || "",
          instagram: socialMedia.instagram || "",
          linkedin: socialMedia.linkedin || "",
          twitter: socialMedia.twitter || "",
          whatsapp: socialMedia.whatsapp || "",
        },
      });
    }
  }, [settings]);

  const handleImageUpload = async (file: File, type: "logo" | "favicon") => {
    if (type === "logo") setUploadingLogo(true);
    else setUploadingFavicon(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();

      setFormData((prev) => ({
        ...prev,
        [type === "logo" ? "logoUrl" : "faviconUrl"]: data.url,
      }));

      toast.success(`${type === "logo" ? "Logo" : "Favicon"} uploaded successfully!`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Failed to upload ${type === "logo" ? "logo" : "favicon"}`);
    } finally {
      if (type === "logo") setUploadingLogo(false);
      else setUploadingFavicon(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateMutation.mutateAsync({
        logoUrl: formData.logoUrl || undefined,
        faviconUrl: formData.faviconUrl || undefined,
        socialMedia: JSON.stringify(formData.socialMedia),
      });

      toast.success("Settings updated successfully!");
      refetch();
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    }
  };

  const testSupabaseConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus("idle");

    try {
      const response = await fetch("/api/test-supabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ databaseUrl: supabaseCredentials.databaseUrl }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setConnectionStatus("success");
        toast.success("✅ Supabase connection successful!");
      } else {
        setConnectionStatus("error");
        toast.error(`❌ ${data.message || "Connection failed"}`);
      }
    } catch (error) {
      setConnectionStatus("error");
      toast.error("❌ Connection error: " + (error as Error).message);
    } finally {
      setTestingConnection(false);
    }
  };

  const saveSupabaseCredentials = async () => {
    setSavingCredentials(true);

    try {
      const response = await fetch("/api/save-supabase-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supabaseCredentials),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("✅ Credenciais salvas com sucesso! Reinicie o servidor para aplicar.");
      } else {
        toast.error(`❌ ${data.message || "Failed to save credentials"}`);
      }
    } catch (error) {
      toast.error("❌ Error: " + (error as Error).message);
    } finally {
      setSavingCredentials(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Site</CardTitle>
          <CardDescription>
            Gerencie o logo, favicon e redes sociais do site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="branding" className="space-y-6">
            <TabsList>
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="social">Redes Sociais</TabsTrigger>
              <TabsTrigger value="database">Supabase</TabsTrigger>
            </TabsList>

            {/* Branding Tab */}
            <TabsContent value="branding">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo do Site</Label>
                  <div className="flex items-center gap-4">
                    {formData.logoUrl && (
                      <img
                        src={formData.logoUrl}
                        alt="Logo preview"
                        className="h-20 w-20 object-contain border rounded"
                      />
                    )}
                    <div className="flex-1">
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, "logo");
                        }}
                        disabled={uploadingLogo}
                      />
                      {uploadingLogo && (
                        <p className="text-sm text-gray-500 mt-1">Uploading...</p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Recomendado: PNG ou SVG com fundo transparente, 200x60px
                  </p>
                </div>

                {/* Favicon Upload */}
                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon</Label>
                  <div className="flex items-center gap-4">
                    {formData.faviconUrl && (
                      <img
                        src={formData.faviconUrl}
                        alt="Favicon preview"
                        className="h-8 w-8 object-contain border rounded"
                      />
                    )}
                    <div className="flex-1">
                      <Input
                        id="favicon"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, "favicon");
                        }}
                        disabled={uploadingFavicon}
                      />
                      {uploadingFavicon && (
                        <p className="text-sm text-gray-500 mt-1">Uploading...</p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Recomendado: PNG ou ICO, 32x32px ou 64x64px
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={updateMutation.isPending || uploadingLogo || uploadingFavicon}
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Branding"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Social Media Tab */}
            <TabsContent value="social">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    type="url"
                    placeholder="https://facebook.com/borgesadv"
                    value={formData.socialMedia.facebook}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        socialMedia: { ...prev.socialMedia, facebook: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    type="url"
                    placeholder="https://instagram.com/borgesadv"
                    value={formData.socialMedia.instagram}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        socialMedia: { ...prev.socialMedia, instagram: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/company/borgesadv"
                    value={formData.socialMedia.linkedin}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        socialMedia: { ...prev.socialMedia, linkedin: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter / X</Label>
                  <Input
                    id="twitter"
                    type="url"
                    placeholder="https://twitter.com/borgesadv"
                    value={formData.socialMedia.twitter}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        socialMedia: { ...prev.socialMedia, twitter: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="+5548999999999"
                    value={formData.socialMedia.whatsapp}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        socialMedia: { ...prev.socialMedia, whatsapp: e.target.value },
                      }))
                    }
                  />
                  <p className="text-sm text-gray-500">
                    Formato: +55 (código do país) + DDD + número (sem espaços)
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Redes Sociais"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Supabase Tab */}
            <TabsContent value="database">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Conexão Supabase</h3>
                      <p className="text-sm text-gray-500">
                        Teste e configure as credenciais do banco de dados
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={testSupabaseConnection}
                        disabled={testingConnection || savingCredentials}
                        variant="outline"
                      >
                        {testingConnection ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Testando...
                          </>
                        ) : connectionStatus === "success" ? (
                          <>
                            <Check className="mr-2 h-4 w-4 text-green-600" />
                            Conectado
                          </>
                        ) : connectionStatus === "error" ? (
                          <>
                            <X className="mr-2 h-4 w-4 text-red-600" />
                            Erro
                          </>
                        ) : (
                          <>
                            <Database className="mr-2 h-4 w-4" />
                            Testar Conexão
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={saveSupabaseCredentials}
                        disabled={testingConnection || savingCredentials}
                      >
                        {savingCredentials ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Salvar Credenciais
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <Card className={
                    connectionStatus === "success" ? "border-green-200 bg-green-50" :
                    connectionStatus === "error" ? "border-red-200 bg-red-50" :
                    ""
                  }>
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="supabase-url">Supabase URL</Label>
                        <Input
                          id="supabase-url"
                          type="url"
                          value={supabaseCredentials.url}
                          onChange={(e) =>
                            setSupabaseCredentials((prev) => ({ ...prev, url: e.target.value }))
                          }
                          placeholder="https://xxxx.supabase.co"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="anon-key">Anon Public Key</Label>
                        <Input
                          id="anon-key"
                          type="text"
                          value={supabaseCredentials.anonKey}
                          onChange={(e) =>
                            setSupabaseCredentials((prev) => ({ ...prev, anonKey: e.target.value }))
                          }
                          className="font-mono text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="service-role">Service Role Key (Secret)</Label>
                        <Input
                          id="service-role"
                          type="password"
                          value={supabaseCredentials.serviceRole}
                          onChange={(e) =>
                            setSupabaseCredentials((prev) => ({ ...prev, serviceRole: e.target.value }))
                          }
                          className="font-mono text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="database-url">Database URL (Connection String)</Label>
                        <Input
                          id="database-url"
                          type="password"
                          value={supabaseCredentials.databaseUrl}
                          onChange={(e) =>
                            setSupabaseCredentials((prev) => ({ ...prev, databaseUrl: e.target.value }))
                          }
                          className="font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500">
                          Formato: postgresql://postgres.[ref]:[password]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
                        </p>
                      </div>

                      <div className="pt-4 border-t bg-yellow-50 p-4 rounded">
                        <p className="text-sm font-semibold text-yellow-800 mb-2">
                          ⚠️ IMPORTANTE: Configuração Inicial
                        </p>
                        <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
                          <li>Execute o arquivo <code className="bg-yellow-100 px-1 rounded font-bold">supabase-setup.sql</code> no SQL Editor do Supabase</li>
                          <li>Clique em "Salvar Credenciais" acima para atualizar o .env</li>
                          <li>Reinicie o servidor (Ctrl+C no terminal e rode <code className="bg-yellow-100 px-1 rounded">npm run dev</code> novamente)</li>
                          <li>Clique em "Testar Conexão" para verificar se está tudo funcionando</li>
                        </ol>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Status do Banco de Dados</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Projeto:</span>
                        <span className="font-mono">qzcdkfaaivwpfdpxchpl</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Região:</span>
                        <span>US East (Ohio) - aws-1-us-east-2</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tipo de Banco:</span>
                        <span>PostgreSQL 15</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <span className={
                          connectionStatus === "success" ? "text-green-600 font-medium" :
                          connectionStatus === "error" ? "text-red-600 font-medium" :
                          "text-gray-600"
                        }>
                          {connectionStatus === "success" ? "✅ Online" :
                           connectionStatus === "error" ? "❌ Erro de Conexão" :
                           "⚠️ Não testado"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-base text-blue-900">📋 SQL Setup</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-blue-800">
                        Para criar as tabelas no Supabase:
                      </p>
                      <ol className="text-sm text-blue-700 list-decimal list-inside space-y-1">
                        <li>Abra o <a href="https://supabase.com/dashboard/project/qzcdkfaaivwpfdpxchpl/sql/new" target="_blank" rel="noopener noreferrer" className="underline font-medium">SQL Editor do Supabase</a></li>
                        <li>Copie todo o conteúdo do arquivo <code className="bg-blue-100 px-1 rounded">supabase-setup.sql</code></li>
                        <li>Cole no editor e clique em "Run"</li>
                        <li>Aguarde a execução (pode levar alguns segundos)</li>
                      </ol>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
