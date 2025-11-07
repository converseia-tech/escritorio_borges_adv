import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Check, X, Activity, BarChart3, Zap, ExternalLink, Copy, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MarketingManagement() {
  const [savingEnv, setSavingEnv] = useState(false);
  const [testingTracking, setTestingTracking] = useState(false);
  const [trackingStatus, setTrackingStatus] = useState<"idle" | "success" | "error">("idle");
  const [copied, setCopied] = useState<string | null>(null);

  const [marketingConfig, setMarketingConfig] = useState({
    metaPixelId: import.meta.env.VITE_META_PIXEL_ID || "",
    ga4MeasurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID || "",
    apiAuthKey: "",
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copiado!`);
    setTimeout(() => setCopied(null), 2000);
  };

  const saveMarketingConfig = async () => {
    setSavingEnv(true);

    try {
      const response = await fetch("/api/save-marketing-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(marketingConfig),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("✅ Configurações salvas! Reinicie o servidor para aplicar.");
      } else {
        toast.error(`❌ ${data.message || "Falha ao salvar configurações"}`);
      }
    } catch (error) {
      toast.error("❌ Erro: " + (error as Error).message);
    } finally {
      setSavingEnv(false);
    }
  };

  const testTracking = () => {
    setTestingTracking(true);
    setTrackingStatus("idle");

    // Simulate testing tracking - check if Meta Pixel and GA4 are initialized
    setTimeout(() => {
      const metaPixelExists = typeof window !== "undefined" && (window as any).fbq;
      const ga4Exists = typeof window !== "undefined" && (window as any).gtag;

      if (metaPixelExists && ga4Exists) {
        setTrackingStatus("success");
        toast.success("✅ Tracking funcionando! Meta Pixel e GA4 detectados.");
      } else if (metaPixelExists || ga4Exists) {
        setTrackingStatus("error");
        toast.warning(`⚠️ Apenas ${metaPixelExists ? "Meta Pixel" : "GA4"} detectado.`);
      } else {
        setTrackingStatus("error");
        toast.error("❌ Nenhum tracker detectado. Verifique as configurações.");
      }
      setTestingTracking(false);
    }, 1500);
  };

  const generateApiKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "";
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setMarketingConfig((prev) => ({ ...prev, apiAuthKey: key }));
    toast.success("🔑 API Key gerada com sucesso!");
  };

  const currentMetaPixel = import.meta.env.VITE_META_PIXEL_ID || "Não configurado";
  const currentGA4 = import.meta.env.VITE_GA4_MEASUREMENT_ID || "Não configurado";
  const hasMetaPixel = import.meta.env.VITE_META_PIXEL_ID && import.meta.env.VITE_META_PIXEL_ID !== "XXXXXXXXX";
  const hasGA4 = import.meta.env.VITE_GA4_MEASUREMENT_ID && import.meta.env.VITE_GA4_MEASUREMENT_ID !== "G-XXXXXXXX";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Marketing & Analytics</CardTitle>
          <CardDescription>
            Configure Meta Pixel, Google Analytics 4 e Blog REST API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="status" className="space-y-6">
            <TabsList>
              <TabsTrigger value="status">
                <Activity className="h-4 w-4 mr-2" />
                Status
              </TabsTrigger>
              <TabsTrigger value="meta">
                <BarChart3 className="h-4 w-4 mr-2" />
                Meta Pixel
              </TabsTrigger>
              <TabsTrigger value="ga4">
                <BarChart3 className="h-4 w-4 mr-2" />
                Google Analytics
              </TabsTrigger>
              <TabsTrigger value="api">
                <Zap className="h-4 w-4 mr-2" />
                Blog API
              </TabsTrigger>
            </TabsList>

            {/* Status Tab */}
            <TabsContent value="status">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Status do Tracking</h3>
                    <p className="text-sm text-gray-500">
                      Verifique se o Meta Pixel e GA4 estão funcionando
                    </p>
                  </div>
                  <Button
                    onClick={testTracking}
                    disabled={testingTracking}
                    variant="outline"
                  >
                    {testingTracking ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testando...
                      </>
                    ) : trackingStatus === "success" ? (
                      <>
                        <Check className="mr-2 h-4 w-4 text-green-600" />
                        Funcionando
                      </>
                    ) : trackingStatus === "error" ? (
                      <>
                        <X className="mr-2 h-4 w-4 text-red-600" />
                        Com Problemas
                      </>
                    ) : (
                      <>
                        <Activity className="mr-2 h-4 w-4" />
                        Testar Tracking
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className={hasMetaPixel ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        {hasMetaPixel ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                        ) : (
                          <X className="h-5 w-5 text-yellow-600 mr-2" />
                        )}
                        Meta Pixel (Facebook)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Pixel ID:</span>
                        <span className={`font-mono ${hasMetaPixel ? "text-green-700" : "text-yellow-700"}`}>
                          {currentMetaPixel}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <span className={hasMetaPixel ? "text-green-600 font-medium" : "text-yellow-600 font-medium"}>
                          {hasMetaPixel ? "✅ Configurado" : "⚠️ Não configurado"}
                        </span>
                      </div>
                      {hasMetaPixel && (
                        <div className="pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => window.open("https://business.facebook.com/events_manager", "_blank")}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Abrir Events Manager
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className={hasGA4 ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        {hasGA4 ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                        ) : (
                          <X className="h-5 w-5 text-yellow-600 mr-2" />
                        )}
                        Google Analytics 4
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Measurement ID:</span>
                        <span className={`font-mono ${hasGA4 ? "text-green-700" : "text-yellow-700"}`}>
                          {currentGA4}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <span className={hasGA4 ? "text-green-600 font-medium" : "text-yellow-600 font-medium"}>
                          {hasGA4 ? "✅ Configurado" : "⚠️ Não configurado"}
                        </span>
                      </div>
                      {hasGA4 && (
                        <div className="pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => window.open("https://analytics.google.com/", "_blank")}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Abrir Google Analytics
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Alert>
                  <Activity className="h-4 w-4" />
                  <AlertTitle>Eventos Rastreados Automaticamente</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                      <li><strong>PageView</strong> - Cada mudança de página/rota</li>
                      <li><strong>ViewContent</strong> - Leitura de posts do blog</li>
                      <li><strong>Contact</strong> - Cliques no botão WhatsApp</li>
                      <li><strong>Lead</strong> - Envio de formulários</li>
                    </ul>
                    <p className="mt-3 text-sm">
                      Use o <strong>Meta Pixel Helper</strong> (Chrome) e <strong>Google Tag Assistant</strong> para verificar eventos em tempo real.
                    </p>
                  </AlertDescription>
                </Alert>

                {(!hasMetaPixel || !hasGA4) && (
                  <Alert variant="destructive">
                    <X className="h-4 w-4" />
                    <AlertTitle>Ação Necessária</AlertTitle>
                    <AlertDescription>
                      Configure suas credenciais nas abas acima e clique em "Salvar Configurações" para ativar o tracking.
                      <br />
                      <strong>Após salvar, reinicie o servidor</strong> para aplicar as mudanças.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>

            {/* Meta Pixel Tab */}
            <TabsContent value="meta">
              <div className="space-y-6">
                <Alert>
                  <BarChart3 className="h-4 w-4" />
                  <AlertTitle>Como Obter o Meta Pixel ID</AlertTitle>
                  <AlertDescription className="space-y-2">
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Acesse <a href="https://business.facebook.com/events_manager" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Facebook Events Manager</a></li>
                      <li>Selecione seu pixel (ou crie um novo)</li>
                      <li>Copie o <strong>Pixel ID</strong> (número de 15 dígitos)</li>
                      <li>Cole no campo abaixo e clique em "Salvar Configurações"</li>
                    </ol>
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="meta-pixel-id">Meta Pixel ID</Label>
                      <div className="flex gap-2">
                        <Input
                          id="meta-pixel-id"
                          type="text"
                          placeholder="123456789012345"
                          value={marketingConfig.metaPixelId}
                          onChange={(e) =>
                            setMarketingConfig((prev) => ({ ...prev, metaPixelId: e.target.value }))
                          }
                          className="font-mono"
                        />
                        {currentMetaPixel !== "Não configurado" && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(currentMetaPixel, "Pixel ID")}
                          >
                            {copied === "Pixel ID" ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Atualmente: <span className="font-mono">{currentMetaPixel}</span>
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded p-4">
                      <h4 className="font-medium text-blue-900 mb-2">📊 Recursos do Meta Pixel</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>✓ Tracking de conversões para Facebook Ads</li>
                        <li>✓ Criação de públicos personalizados (custom audiences)</li>
                        <li>✓ Otimização de campanhas de anúncios</li>
                        <li>✓ Remarketing para visitantes do site</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* GA4 Tab */}
            <TabsContent value="ga4">
              <div className="space-y-6">
                <Alert>
                  <BarChart3 className="h-4 w-4" />
                  <AlertTitle>Como Obter o Google Analytics 4 Measurement ID</AlertTitle>
                  <AlertDescription className="space-y-2">
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Acesse <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Google Analytics</a></li>
                      <li>Vá em Admin → Data Streams → Web</li>
                      <li>Copie o <strong>Measurement ID</strong> (começa com "G-")</li>
                      <li>Cole no campo abaixo e clique em "Salvar Configurações"</li>
                    </ol>
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ga4-id">Google Analytics 4 Measurement ID</Label>
                      <div className="flex gap-2">
                        <Input
                          id="ga4-id"
                          type="text"
                          placeholder="G-XXXXXXXXXX"
                          value={marketingConfig.ga4MeasurementId}
                          onChange={(e) =>
                            setMarketingConfig((prev) => ({ ...prev, ga4MeasurementId: e.target.value }))
                          }
                          className="font-mono"
                        />
                        {currentGA4 !== "Não configurado" && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(currentGA4, "GA4 ID")}
                          >
                            {copied === "GA4 ID" ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Atualmente: <span className="font-mono">{currentGA4}</span>
                      </p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded p-4">
                      <h4 className="font-medium text-green-900 mb-2">📈 Recursos do GA4</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>✓ Análise de comportamento de usuários</li>
                        <li>✓ Funis de conversão personalizados</li>
                        <li>✓ Relatórios em tempo real</li>
                        <li>✓ Integração com Google Ads</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Blog API Tab */}
            <TabsContent value="api">
              <div className="space-y-6">
                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertTitle>Blog REST API para Automação N8N</AlertTitle>
                  <AlertDescription>
                    API completa para criar, atualizar e deletar posts programaticamente.
                    Ideal para automações com N8N, Zapier, ou integrações custom.
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Authentication Key</Label>
                      <div className="flex gap-2">
                        <Input
                          id="api-key"
                          type="password"
                          placeholder="Cole ou gere uma API Key segura"
                          value={marketingConfig.apiAuthKey}
                          onChange={(e) =>
                            setMarketingConfig((prev) => ({ ...prev, apiAuthKey: e.target.value }))
                          }
                          className="font-mono"
                        />
                        <Button
                          variant="outline"
                          onClick={generateApiKey}
                        >
                          Gerar
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Mínimo 32 caracteres. Mantenha esta chave em segredo!
                      </p>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded p-4">
                      <h4 className="font-medium text-purple-900 mb-2">🔌 Endpoints Disponíveis</h4>
                      <div className="text-sm text-purple-700 space-y-2">
                        <div className="font-mono bg-white p-2 rounded">
                          GET /api/blog/list
                        </div>
                        <div className="font-mono bg-white p-2 rounded">
                          POST /api/blog/create
                        </div>
                        <div className="font-mono bg-white p-2 rounded">
                          POST /api/blog/update
                        </div>
                        <div className="font-mono bg-white p-2 rounded">
                          POST /api/blog/delete
                        </div>
                      </div>
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open("/docs/n8n-integration.md", "_blank")}
                          className="w-full"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ver Documentação Completa
                        </Button>
                      </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded p-4">
                      <h4 className="font-medium text-orange-900 mb-2">📝 Exemplo de Uso (cURL)</h4>
                      <pre className="text-xs text-orange-800 bg-white p-3 rounded overflow-x-auto">
{`curl -X POST http://localhost:3000/api/blog/create \\
  -H "Authorization: Bearer SUA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Novo Artigo",
    "slug": "novo-artigo",
    "content": "Conteúdo do artigo...",
    "published": true
  }'`}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="pt-6 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Salvar Todas as Configurações</p>
                <p className="text-xs text-gray-500">
                  As configurações serão salvas no arquivo .env
                </p>
              </div>
              <Button
                onClick={saveMarketingConfig}
                disabled={savingEnv}
                size="lg"
              >
                {savingEnv ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </>
                )}
              </Button>
            </div>
            
            {(marketingConfig.metaPixelId || marketingConfig.ga4MeasurementId || marketingConfig.apiAuthKey) && (
              <Alert className="mt-4" variant="destructive">
                <Activity className="h-4 w-4" />
                <AlertTitle>⚠️ Reinicialização Necessária</AlertTitle>
                <AlertDescription>
                  Após salvar as configurações, você deve <strong>reiniciar o servidor</strong> para que as mudanças tenham efeito:
                  <pre className="mt-2 bg-black text-white p-2 rounded text-xs">
                    Ctrl+C (parar servidor)
                    npm run dev (reiniciar)
                  </pre>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documentation Links */}
      <Card>
        <CardHeader>
          <CardTitle>📚 Documentação Completa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.open("https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc", "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Meta Pixel Helper (Chrome Extension)
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.open("https://tagassistant.google.com/", "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Google Tag Assistant
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              // Link to local docs
              toast.info("Documentação disponível em: docs/MARKETING_README.md");
            }}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Guia de Implementação Completo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
