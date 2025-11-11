import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Loader2, MessageCircle, Code, Phone, AlertCircle } from "lucide-react";

export default function ChatManagement() {
  const { data: settings, isLoading, refetch } = trpc.admin.getChatSettings.useQuery();
  const updateMutation = trpc.admin.updateChatSettings.useMutation();

  const [formData, setFormData] = useState<{
    enabled: boolean;
    type: "whatsapp" | "custom";
    whatsappNumber: string;
    whatsappMessage: string;
    customScript: string;
  }>({
    enabled: settings?.enabled === 1,
    type: (settings?.type as "whatsapp" | "custom") || "whatsapp",
    whatsappNumber: settings?.whatsappNumber || "",
    whatsappMessage: settings?.whatsappMessage || "Olá! Gostaria de mais informações.",
    customScript: settings?.customScript || "",
  });

  // Atualizar form quando dados carregarem
  useState(() => {
    if (settings) {
      setFormData({
        enabled: settings.enabled === 1,
        type: (settings.type as "whatsapp" | "custom") || "whatsapp",
        whatsappNumber: settings.whatsappNumber || "",
        whatsappMessage: settings.whatsappMessage || "Olá! Gostaria de mais informações.",
        customScript: settings.customScript || "",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateMutation.mutateAsync(formData);
      toast.success("Configurações do chat atualizadas com sucesso!");
      refetch();
    } catch (error) {
      console.error("Error updating chat settings:", error);
      toast.error("Erro ao atualizar configurações do chat");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Chat / Pop-up</h2>
        <p className="text-gray-600">
          Configure o chat ou pop-up de atendimento do site
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Configurações do Chat
            </CardTitle>
            <CardDescription>
              Ative e configure o chat para atendimento dos visitantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Habilitar/Desabilitar Chat */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="enabled" className="text-base font-semibold">
                  Habilitar Chat
                </Label>
                <p className="text-sm text-gray-600">
                  Exibir o chat/pop-up no site
                </p>
              </div>
              <Switch
                id="enabled"
                checked={formData.enabled}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, enabled: checked })
                }
              />
            </div>

            {formData.enabled && (
              <>
                {/* Tipo de Chat */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Tipo de Chat</Label>
                  <RadioGroup
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value as "whatsapp" | "custom" })
                    }
                  >
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="whatsapp" id="whatsapp" />
                      <Label htmlFor="whatsapp" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Phone className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-semibold">WhatsApp</div>
                          <div className="text-sm text-gray-600">
                            Pop-up com botão flutuante do WhatsApp
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Code className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-semibold">Script Personalizado</div>
                          <div className="text-sm text-gray-600">
                            Inserir código de chat externo (ex: chatbot, widget)
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Configurações WhatsApp */}
                {formData.type === "whatsapp" && (
                  <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-900 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Configurações WhatsApp
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="whatsappNumber">
                        Número do WhatsApp *
                      </Label>
                      <Input
                        id="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, whatsappNumber: e.target.value })
                        }
                        placeholder="5548999999999 (com código do país)"
                        required={formData.type === "whatsapp"}
                      />
                      <p className="text-xs text-green-700">
                        Formato: Código do país + DDD + Número (ex: 5548999999999)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatsappMessage">
                        Mensagem Padrão (Opcional)
                      </Label>
                      <Textarea
                        id="whatsappMessage"
                        value={formData.whatsappMessage}
                        onChange={(e) =>
                          setFormData({ ...formData, whatsappMessage: e.target.value })
                        }
                        placeholder="Mensagem que será preenchida automaticamente..."
                        rows={3}
                      />
                      <p className="text-xs text-green-700">
                        Esta mensagem aparecerá no campo de texto do WhatsApp quando o usuário clicar
                      </p>
                    </div>
                  </div>
                )}

                {/* Configurações Script Personalizado */}
                {formData.type === "custom" && (
                  <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Script Personalizado
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="customScript">
                        Código HTML/JavaScript *
                      </Label>
                      <Textarea
                        id="customScript"
                        value={formData.customScript}
                        onChange={(e) =>
                          setFormData({ ...formData, customScript: e.target.value })
                        }
                        placeholder='<script>
  (function(e, t, n) {
    // Seu código aqui
  })(document);
</script>'
                        rows={12}
                        className="font-mono text-sm"
                        required={formData.type === "custom"}
                        spellCheck={false}
                      />
                      <p className="text-xs text-blue-700">
                        Cole o código fornecido pela plataforma de chat (ex: chatbot, widget)
                      </p>
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        <strong>Importante:</strong> Certifique-se de que o código é de uma fonte confiável.
                        Scripts maliciosos podem comprometer a segurança do site.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </>
            )}

            <div className="flex gap-2 pt-4 border-t">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Configurações"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview/Info */}
        {formData.enabled && (
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                Como o chat aparecerá no site
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formData.type === "whatsapp" && formData.whatsappNumber && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Um botão flutuante do WhatsApp aparecerá no canto inferior direito do site.
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Número configurado:</p>
                      <p className="text-sm text-gray-600">{formData.whatsappNumber}</p>
                    </div>
                    <div className="bg-green-500 text-white rounded-full p-3">
                      <Phone className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              )}

              {formData.type === "custom" && formData.customScript && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    O script personalizado será injetado no final da página.
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="font-semibold mb-2">Script configurado:</p>
                    <code className="text-xs text-gray-600 block overflow-x-auto">
                      {formData.customScript.substring(0, 100)}...
                    </code>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}
