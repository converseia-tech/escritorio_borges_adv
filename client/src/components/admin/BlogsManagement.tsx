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
import "react-quill/dist/quill.snow.css";

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
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Nome do autor"
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Conteúdo completo do artigo..."
                  rows={10}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="featuredImage">Imagem Destacada</Label>
                <p className="text-xs text-gray-500 mb-2">
                  Adicione uma imagem de capa para o artigo (máximo 5MB)
                </p>
                
                {/* Preview da imagem se existir */}
                {formData.featuredImage && (
                  <div className="relative mb-3 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={formData.featuredImage}
                      alt="Preview"
                      className="w-full h-48 object-cover"
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
                    onClick={() => document.getElementById("blog-image-upload")?.click()}
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
                    id="blog-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'featuredImage')}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
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
