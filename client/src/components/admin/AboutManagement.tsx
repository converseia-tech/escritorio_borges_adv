import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save, Upload } from "lucide-react";

export default function AboutManagement() {
  const { data: aboutContent, isLoading, refetch } = trpc.site.getAboutContent.useQuery();
  const updateMutation = trpc.admin.updateAboutContent.useMutation();
  const uploadMutation = trpc.admin.uploadImage.useMutation();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    image: "",
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (aboutContent) {
      setFormData({
        title: aboutContent.title || "",
        subtitle: aboutContent.subtitle || "",
        content: aboutContent.content || "",
        image: aboutContent.image || "",
      });
    }
  }, [aboutContent]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Validar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Imagem muito grande! Máximo 10MB");
      return;
    }

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('context', 'borges-advogados-sobre');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('Falha no upload');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, image: data.url }));
      toast.success('Imagem carregada com sucesso!');
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error("Erro ao enviar imagem");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateMutation.mutateAsync(formData);
      toast.success("Seção Sobre Nós atualizada com sucesso!");
      refetch();
    } catch (error) {
      toast.error("Erro ao atualizar Sobre Nós");
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
    <Card>
      <CardHeader>
        <CardTitle>Seção Sobre Nós</CardTitle>
        <CardDescription>
          Edite o conteúdo da seção "Sobre Nós"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Borges Advogados Associados"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtítulo</Label>
            <Input
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="CONHEÇA NOSSA HISTÓRIA"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="O escritório Borges Advogados Associados..."
              rows={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Imagem</Label>
            <div className="flex gap-2">
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="URL da imagem"
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={() => document.getElementById("about-image-upload")?.click()}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </Button>
              <input
                id="about-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="mt-2 h-48 w-full object-cover rounded"
              />
            )}
          </div>

          <Button type="submit" disabled={updateMutation.isPending} className="w-full">
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
