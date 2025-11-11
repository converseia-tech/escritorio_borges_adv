import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Plus, Edit, Trash2, Upload, User, Calendar, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import RichTextEditor from "@/components/ui/RichTextEditor";

export default function BlogsManagement() {
  const { data: blogs, isLoading, refetch } = trpc.admin.getAllBlogs.useQuery();
  const [open, setOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featuredImage: "",
    author: "",
    authorBio: "",
    authorPhoto: "",
    published: 0,
  });

  const createMutation = trpc.admin.createBlog.useMutation();
  const updateMutation = trpc.admin.updateBlog.useMutation();
  const deleteMutation = trpc.admin.deleteBlog.useMutation();
  const uploadMutation = trpc.admin.uploadImage.useMutation();
  const [uploading, setUploading] = useState(false);

  const handleOpenDialog = (blog?: any) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        content: blog.content || "",
        excerpt: blog.excerpt || "",
        featuredImage: blog.featuredImage || "",
        author: blog.author || "",
        authorBio: blog.authorBio || "",
        authorPhoto: blog.authorPhoto || "",
        published: blog.published || 0,
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        featuredImage: "",
        author: "",
        authorBio: "",
        authorPhoto: "",
        published: 0,
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingBlog(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'featuredImage' | 'authorPhoto') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem muito grande! Máximo 5MB");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;

        const context = field === 'featuredImage' 
          ? `borges-advogados-blog-${formData.slug || "imagem"}`
          : `borges-advogados-autor-${formData.author.toLowerCase().replace(/\s+/g, '-') || "foto"}`;

        const result = await uploadMutation.mutateAsync({
          imageData: base64,
          originalName: file.name,
          context,
        });

        setFormData((prev) => ({ ...prev, [field]: result.url }));
        toast.success(field === 'featuredImage' ? "Capa enviada com sucesso!" : "Foto do autor enviada com sucesso!");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Erro ao enviar imagem");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug || !formData.content) {
      toast.error("Título, slug e conteúdo são obrigatórios");
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        publishedAt: formData.published === 1 ? new Date() : undefined,
      };

      if (editingBlog) {
        await updateMutation.mutateAsync({
          id: editingBlog.id,
          ...dataToSubmit,
        });
        toast.success("Blog atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync(dataToSubmit);
        toast.success("Blog criado com sucesso!");
      }
      handleCloseDialog();
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar blog");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja remover este blog?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Blog removido com sucesso!");
      refetch();
    } catch (error) {
      toast.error("Erro ao remover blog");
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Blogs</h2>
          <p className="text-sm text-gray-600">
            Gerencie os artigos do blog
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Blog
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBlog ? "Editar Blog" : "Novo Blog"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do artigo
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs defaultValue="conteudo" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
                  <TabsTrigger value="autor">Autor</TabsTrigger>
                  <TabsTrigger value="imagens">Imagens</TabsTrigger>
                </TabsList>

                {/* ABA 1: CONTEÚDO */}
                <TabsContent value="conteudo" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setFormData({
                          ...formData,
                          title,
                          slug: generateSlug(title),
                        });
                      }}
                      placeholder="Título do artigo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL) *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="titulo-do-artigo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Resumo</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Breve resumo do artigo..."
                      rows={2}
                      spellCheck={true}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Conteúdo * (com formatação rica)</Label>
                    <p className="text-xs text-gray-500 mb-2">
                      Use a barra de ferramentas para formatar o texto, adicionar títulos, listas, etc.
                      O corretor ortográfico está ativo.
                    </p>
                    <RichTextEditor
                      value={formData.content}
                      onChange={(value) => setFormData({ ...formData, content: value })}
                      placeholder="Escreva o conteúdo completo do artigo..."
                    />
                  </div>
                </TabsContent>

                {/* ABA 2: AUTOR */}
                <TabsContent value="autor" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">Nome do Autor</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Ex: Dr. João Silva"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="authorBio">Biografia do Autor</Label>
                    <Textarea
                      id="authorBio"
                      value={formData.authorBio}
                      onChange={(e) => setFormData({ ...formData, authorBio: e.target.value })}
                      placeholder="Breve biografia profissional do autor..."
                      rows={4}
                      spellCheck={true}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="authorPhoto">Foto do Autor</Label>
                    <p className="text-xs text-gray-500 mb-2">
                      Foto profissional do autor (máximo 5MB, preferencialmente quadrada)
                    </p>
                    
                    {formData.authorPhoto && (
                      <div className="relative mb-3 rounded-full overflow-hidden border-4 border-gray-200 w-32 h-32 mx-auto">
                        <img
                          src={formData.authorPhoto}
                          alt="Foto do autor"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-0 right-0 rounded-full"
                          onClick={() => setFormData({ ...formData, authorPhoto: "" })}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Input
                        id="authorPhoto"
                        value={formData.authorPhoto}
                        onChange={(e) => setFormData({ ...formData, authorPhoto: e.target.value })}
                        placeholder="Cole a URL da foto ou faça upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploading}
                        onClick={() => document.getElementById("author-photo-upload")?.click()}
                        className="min-w-[120px]"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload
                          </>
                        )}
                      </Button>
                      <input
                        id="author-photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'authorPhoto')}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* ABA 3: IMAGENS */}
                <TabsContent value="imagens" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="featuredImage">Imagem de Capa</Label>
                    <p className="text-xs text-gray-500 mb-2">
                      Imagem principal que aparecerá no topo do artigo (máximo 5MB)
                    </p>
                    
                    {formData.featuredImage && (
                      <div className="relative mb-3 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={formData.featuredImage}
                          alt="Preview da capa"
                          className="w-full h-64 object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setFormData({ ...formData, featuredImage: "" })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Input
                        id="featuredImage"
                        value={formData.featuredImage}
                        onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                        placeholder="Cole a URL da imagem ou faça upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploading}
                        onClick={() => document.getElementById("featured-image-upload")?.click()}
                        className="min-w-[120px]"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload
                          </>
                        )}
                      </Button>
                      <input
                        id="featured-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'featuredImage')}
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      💡 Dica: Imagens no texto
                    </h4>
                    <p className="text-sm text-blue-800">
                      Para inserir imagens dentro do conteúdo do artigo, use o editor de texto rico na aba "Conteúdo".
                      Você pode fazer upload de imagens diretamente no editor ou colar URLs de imagens.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex items-center space-x-2 pt-4 border-t">
                <Switch
                  id="published"
                  checked={formData.published === 1}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, published: checked ? 1 : 0 })
                  }
                />
                <Label htmlFor="published">Publicado</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1">
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {blogs?.map((blog) => (
          <Card key={blog.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Thumbnail da imagem */}
              {blog.featuredImage && (
                <div className="md:w-48 h-32 md:h-auto flex-shrink-0">
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex-1">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{blog.title}</CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-3">
                        {blog.author && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {blog.author}
                          </span>
                        )}
                        {blog.publishedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(blog.publishedAt), "dd/MM/yyyy")}
                          </span>
                        )}
                        {blog.published === 1 ? (
                          <Badge className="bg-green-600 hover:bg-green-700">Publicado</Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500 border-gray-400">Rascunho</Badge>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(blog)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(blog.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {blog.excerpt || blog.content.substring(0, 150) + "..."}
                  </p>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {blogs?.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-600">Nenhum blog cadastrado.</p>
            <Button className="mt-4" onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Blog
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
