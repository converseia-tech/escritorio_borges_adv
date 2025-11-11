import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, AlertTriangle, Database, ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface StorageTestResult {
  success: boolean;
  message: string;
  details?: any;
  buckets?: Array<{ name: string; public: boolean; id: string }>;
  imagesBucket?: { exists: boolean; public: boolean; filesCount: number };
  error?: string;
}

export default function StorageTest() {
  const [testing, setTesting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [testResult, setTestResult] = useState<StorageTestResult | null>(null);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch("/api/test-storage");
      const data = await response.json();
      
      setTestResult(data);
      
      if (data.success) {
        toast.success("Storage configurado corretamente!");
      } else {
        toast.error(data.message || "Erro ao testar storage");
      }
    } catch (error) {
      const errorData: StorageTestResult = {
        success: false,
        message: "Erro ao conectar com o servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      };
      setTestResult(errorData);
      toast.error("Erro ao testar storage");
    } finally {
      setTesting(false);
    }
  };

  const handleCreateBucket = async () => {
    setCreating(true);

    try {
      const response = await fetch("/api/create-images-bucket", { method: "POST" });
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        // Testar novamente após criar
        setTimeout(() => handleTest(), 1000);
      } else {
        toast.error(data.error || "Erro ao criar bucket");
      }
    } catch (error) {
      toast.error("Erro ao criar bucket");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Teste do Supabase Storage</h2>
        <p className="text-gray-600">
          Verifique se o bucket de imagens está configurado corretamente
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Configuração do Storage
          </CardTitle>
          <CardDescription>
            Teste a conexão com o Supabase Storage e verifique se o bucket 'images' existe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={handleTest}
              disabled={testing}
              className="flex-1"
            >
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Testar Conexão
                </>
              )}
            </Button>

            <Button
              onClick={handleCreateBucket}
              disabled={creating || !testResult || testResult.success}
              variant="secondary"
            >
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Criar Bucket 'images'
                </>
              )}
            </Button>
          </div>

          {testResult && (
            <div className="space-y-4">
              {testResult.success ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-900">Sucesso!</AlertTitle>
                  <AlertDescription className="text-green-800">
                    {testResult.message}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>
                    {testResult.message}
                    {testResult.error && (
                      <div className="mt-2 text-sm font-mono bg-red-100 p-2 rounded">
                        {testResult.error}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {testResult.details && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Detalhes:</h4>
                  
                  {testResult.details.url && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm font-medium">URL do Supabase:</span>
                      <Badge variant="outline">{testResult.details.url}</Badge>
                    </div>
                  )}

                  {testResult.buckets && testResult.buckets.length > 0 && (
                    <div className="p-3 bg-gray-50 rounded">
                      <span className="text-sm font-medium mb-2 block">Buckets encontrados:</span>
                      <div className="space-y-1">
                        {testResult.buckets.map((bucket) => (
                          <div key={bucket.id} className="flex items-center gap-2">
                            <Badge variant={bucket.name === 'images' ? 'default' : 'secondary'}>
                              {bucket.name}
                            </Badge>
                            {bucket.public ? (
                              <span className="text-xs text-green-600">público</span>
                            ) : (
                              <span className="text-xs text-yellow-600">privado</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {testResult.imagesBucket && (
                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIcon className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Bucket 'images':</span>
                      </div>
                      <div className="space-y-1 text-sm text-blue-800">
                        <div>Status: {testResult.imagesBucket.exists ? "✅ Existe" : "❌ Não existe"}</div>
                        <div>Visibilidade: {testResult.imagesBucket.public ? "✅ Público" : "⚠️ Privado"}</div>
                        <div>Arquivos: {testResult.imagesBucket.filesCount}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!testResult.success && testResult.message.includes("não existe") && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-900">Ação Necessária</AlertTitle>
                  <AlertDescription className="text-yellow-800">
                    <p className="mb-2">O bucket 'images' não foi encontrado. Você pode:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Clicar no botão "Criar Bucket 'images'" acima, OU</li>
                      <li>Criar manualmente no Supabase Dashboard</li>
                    </ol>
                    <p className="mt-3 text-xs">
                      Consulte o arquivo <code className="bg-yellow-100 px-1 rounded">EXECUTAR_PRIMEIRO.md</code> para instruções detalhadas.
                    </p>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instruções</CardTitle>
          <CardDescription>
            Como configurar o Supabase Storage manualmente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <h4 className="font-semibold mb-2">1. Acesse o Supabase Dashboard:</h4>
            <a
              href="https://supabase.com/dashboard/project/qzcdkfaaivwpfdpxchpl/storage/buckets"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://supabase.com/dashboard → Storage → Buckets
            </a>
          </div>

          <div>
            <h4 className="font-semibold mb-2">2. Crie um novo bucket:</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Nome: <code className="bg-gray-100 px-1 rounded">images</code></li>
              <li>Marque como <strong>público</strong></li>
              <li>Limite de tamanho: 5 MB</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">3. Configure as políticas de acesso</h4>
            <p className="text-gray-600">
              Veja o arquivo <code className="bg-gray-100 px-1 rounded">EXECUTAR_PRIMEIRO.md</code> para os comandos SQL necessários.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
