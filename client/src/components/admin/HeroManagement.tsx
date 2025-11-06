import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save, Upload } from "lucide-react";

export default function HeroManagement() {
  const { data: heroContent, isLoading, refetch } = trpc.site.getHeroContent.useQuery();
  const updateMutation = trpc.admin.updateHeroContent.useMutation();
  const uploadMutation = trpc.admin.uploadImage.useMutation();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    ctaText: "",
    ctaLink: "",
    backgroundImage: "",
  });

  const [uploading, setUploading] = useState(false);

  // Atualizar form quando dados carregarem
  useEffect(() => {
    if (heroContent) {
      setFormData({
        title: heroContent.title || "",
        subtitle: heroContent.subtitle || "",
        ctaText: heroContent.ctaText || "",
        ctaLink: heroContent.ctaLink || "",
        backgroundImage: heroContent.backgroundImage || "",
      });
    }
  }, [heroContent]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Validar tamanho (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Imagem muito grande! Máximo 10MB");
      return;
    }

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('context', 'borges-advogados-hero');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('Falha no upload');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, backgroundImage: data.url }));
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
      toast.success("Hero Section atualizada com sucesso!");
      refetch();
    } catch (error) {
      toast.error("Erro ao atualizar Hero Section");
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
        <CardTitle>Hero Section</CardTitle>
        <CardDescription>
          Edite o conteúdo principal da página inicial
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
            <Textarea
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Transformando desafios jurídicos..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ctaText">Texto do Botão</Label>
              <Input
                id="ctaText"
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                placeholder="ENTRE EM CONTATO"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaLink">Link do Botão</Label>
              <Input
                id="ctaLink"
                value={formData.ctaLink}
                onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                placeholder="/contato"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="backgroundImage">Imagem de Fundo</Label>
            <div className="flex gap-2">
              <Input
                id="backgroundImage"
                value={formData.backgroundImage}
                onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
                placeholder="URL da imagem"
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={() => document.getElementById("hero-image-upload")?.click()}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </Button>
              <input
                id="hero-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            {formData.backgroundImage && (
              <img
                src={formData.backgroundImage}
                alt="Preview"
                className="mt-2 h-32 w-full object-cover rounded"
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
