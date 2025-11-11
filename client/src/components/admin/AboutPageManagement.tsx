import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Upload, Image as ImageIcon, Save } from "lucide-react";
import { toast } from "sonner";

export default function AboutPageManagement() {
  const { data: aboutPage, isLoading, refetch } = trpc.site.getAboutPage.useQuery();
  const updateAboutPage = trpc.admin.updateAboutPage.useMutation();
  const uploadMutation = trpc.admin.uploadImage.useMutation();

  const [heroTitle, setHeroTitle] = useState("");
  const [heroBackgroundImage, setHeroBackgroundImage] = useState("");
  const [historyTitle, setHistoryTitle] = useState("");
  const [historySubtitle, setHistorySubtitle] = useState("");
  const [historyContent, setHistoryContent] = useState("");
  const [historyImage, setHistoryImage] = useState("");

  const [uploadingHeroBg, setUploadingHeroBg] = useState(false);
  const [uploadingHistoryImg, setUploadingHistoryImg] = useState(false);

  useEffect(() => {
    if (aboutPage) {
      setHeroTitle(aboutPage.heroTitle || "");
      setHeroBackgroundImage(aboutPage.heroBackgroundImage || "");
      setHistoryTitle(aboutPage.historyTitle || "");
      setHistorySubtitle(aboutPage.historySubtitle || "");
      setHistoryContent(aboutPage.historyContent || "");
      setHistoryImage(aboutPage.historyImage || "");
    }
  }, [aboutPage]);

  const handleHeroBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHeroBg(true);
    try {
      console.log("[About] 📤 Fazendo upload de imagem hero via backend...");
      
      // ✅ Usar tRPC para fazer upload via BACKEND (service_role_key)
      const result = await uploadMutation.mutateAsync({
        imageData: await fileToBase64(file),
        originalName: file.name,
        context: "about-hero"
      });

      setHeroBackgroundImage(result.url);
      toast.success("Imagem de fundo do hero enviada com sucesso!");
    } catch (error) {
      console.error("[About] ❌ Erro ao fazer upload:", error);
      toast.error("Erro ao enviar imagem");
    } finally {
      setUploadingHeroBg(false);
    }
  };

  const handleHistoryImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHistoryImg(true);
    try {
      console.log("[About] 📤 Fazendo upload de imagem history via backend...");
      
      // ✅ Usar tRPC para fazer upload via BACKEND (service_role_key)
      const result = await uploadMutation.mutateAsync({
        imageData: await fileToBase64(file),
        originalName: file.name,
        context: "about-history"
      });

      setHistoryImage(result.url);
      toast.success("Imagem da equipe enviada com sucesso!");
    } catch (error) {
      console.error("[About] ❌ Erro ao fazer upload:", error);
      toast.error("Erro ao enviar imagem");
    } finally {
      setUploadingHistoryImg(false);
    }
  };

  // Helper: Converter File para Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async () => {
    try {
      await updateAboutPage.mutateAsync({
        heroTitle,
        heroBackgroundImage,
        historyTitle,
        historySubtitle,
        historyContent,
        historyImage,
      });
      
      await refetch();
      toast.success("Página Sobre atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      toast.error("Erro ao atualizar a página");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Hero Section
          </CardTitle>
          <CardDescription>
            Configure o título e a imagem de fundo da seção principal da página Sobre
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="heroTitle">Título do Hero</Label>
            <Input
              id="heroTitle"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="Sobre nós"
            />
          </div>

          <div>
            <Label htmlFor="heroBackground">Imagem de Fundo (Hero)</Label>
            <p className="text-sm text-gray-500 mb-2">
              Esta imagem aparecerá em fade-in no fundo do hero section
            </p>
            <div className="flex items-center gap-4">
              <Input
                id="heroBackground"
                type="file"
                accept="image/*"
                onChange={handleHeroBgUpload}
                disabled={uploadingHeroBg}
                className="flex-1"
              />
              {uploadingHeroBg && <Loader2 className="h-5 w-5 animate-spin" />}
            </div>
            {heroBackgroundImage && (
              <div className="mt-4">
                <img
                  src={heroBackgroundImage}
                  alt="Hero Background Preview"
                  className="h-40 w-full object-cover rounded border"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* História Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Seção "Conheça nossa história"
          </CardTitle>
          <CardDescription>
            Configure o conteúdo sobre a história do escritório e a imagem da equipe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="historyTitle">Título</Label>
            <Input
              id="historyTitle"
              value={historyTitle}
              onChange={(e) => setHistoryTitle(e.target.value)}
              placeholder="Borges Advogados Associados"
            />
          </div>

          <div>
            <Label htmlFor="historySubtitle">Subtítulo (Opcional)</Label>
            <Input
              id="historySubtitle"
              value={historySubtitle}
              onChange={(e) => setHistorySubtitle(e.target.value)}
              placeholder="Excelência jurídica desde 2018"
            />
          </div>

          <div>
            <Label htmlFor="historyContent">Conteúdo</Label>
            <p className="text-sm text-gray-500 mb-2">
              Você pode usar HTML para formatação (negrito, parágrafos, etc.)
            </p>
            <Textarea
              id="historyContent"
              value={historyContent}
              onChange={(e) => setHistoryContent(e.target.value)}
              placeholder="<p>Digite a história do escritório aqui...</p>"
              rows={12}
              className="font-mono text-sm"
            />
          </div>

          <div>
            <Label htmlFor="historyImage">Imagem da Equipe</Label>
            <p className="text-sm text-gray-500 mb-2">
              Foto da equipe que aparecerá ao lado do texto
            </p>
            <div className="flex items-center gap-4">
              <Input
                id="historyImage"
                type="file"
                accept="image/*"
                onChange={handleHistoryImgUpload}
                disabled={uploadingHistoryImg}
                className="flex-1"
              />
              {uploadingHistoryImg && <Loader2 className="h-5 w-5 animate-spin" />}
            </div>
            {historyImage && (
              <div className="mt-4">
                <img
                  src={historyImage}
                  alt="Team Preview"
                  className="h-60 w-full object-cover rounded border"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={updateAboutPage.isPending}
          className="bg-yellow-600 hover:bg-yellow-700"
        >
          {updateAboutPage.isPending ? (
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
      </div>
    </div>
  );
}
