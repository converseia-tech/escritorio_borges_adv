import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Loader2, 
  Plus, 
  Edit, 
  Trash2,
  Building2, 
  Users, 
  Briefcase, 
  ShoppingCart, 
  Shield,
  Scale,
  Home,
  Heart,
  FileText,
  Landmark,
  Car,
  Banknote,
  HandshakeIcon,
  UserCheck,
  Baby,
  Coins
} from "lucide-react";

// Ícones disponíveis com labels
const availableIcons = [
  { value: "bank", label: "Banco", Icon: Building2 },
  { value: "users", label: "Pessoas", Icon: Users },
  { value: "briefcase", label: "Maleta", Icon: Briefcase },
  { value: "shopping-cart", label: "Consumidor", Icon: ShoppingCart },
  { value: "shield", label: "Escudo", Icon: Shield },
  { value: "scale", label: "Balança (Direito)", Icon: Scale },
  { value: "home", label: "Casa/Imóveis", Icon: Home },
  { value: "heart", label: "Coração/Saúde", Icon: Heart },
  { value: "file-text", label: "Documento", Icon: FileText },
  { value: "landmark", label: "Edifício Público", Icon: Landmark },
  { value: "car", label: "Carro/Trânsito", Icon: Car },
  { value: "banknote", label: "Dinheiro", Icon: Banknote },
  { value: "handshake", label: "Acordo", Icon: HandshakeIcon },
  { value: "user-check", label: "Trabalhista", Icon: UserCheck },
  { value: "baby", label: "Família", Icon: Baby },
  { value: "coins", label: "Previdenciário", Icon: Coins },
];

export default function PracticeAreasManagement() {
  const { data: areas, isLoading, refetch } = trpc.site.getPracticeAreas.useQuery();
  const [open, setOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    detailedContent: "",
    featuredImage: "",
    icon: "briefcase",
    displayOrder: 0,
  });

  const createMutation = trpc.admin.createPracticeArea.useMutation();
  const updateMutation = trpc.admin.updatePracticeArea.useMutation();
  const deleteMutation = trpc.admin.deletePracticeArea.useMutation();

  const handleOpenDialog = (area?: any) => {
    if (area) {
      setEditingArea(area);
      setFormData({
        title: area.title || "",
        slug: area.slug || "",
        description: area.description || "",
        content: area.content || "",
        detailedContent: area.detailedContent || "",
        featuredImage: area.featuredImage || "",
        icon: area.icon || "briefcase",
        displayOrder: area.displayOrder || 0,
      });
    } else {
      setEditingArea(null);
      setFormData({
        title: "",
        slug: "",
        description: "",
        content: "",
        detailedContent: "",
        featuredImage: "",
        icon: "briefcase",
        displayOrder: areas?.length || 0,
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingArea(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      content: "",
      detailedContent: "",
      featuredImage: "",
      icon: "briefcase",
      displayOrder: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug) {
      toast.error("Título e slug são obrigatórios");
      return;
    }

    try {
      if (editingArea) {
        await updateMutation.mutateAsync({
          id: editingArea.id,
          ...formData,
        });
        toast.success("Área de atuação atualizada com sucesso!");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Área de atuação adicionada com sucesso!");
      }
      handleCloseDialog();
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar área de atuação");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja remover esta área de atuação?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Área de atuação removida com sucesso!");
      refetch();
    } catch (error) {
      toast.error("Erro ao remover área de atuação");
    }
  };

  // Gerar slug automaticamente a partir do título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
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
          <h2 className="text-2xl font-bold">Áreas de Atuação</h2>
          <p className="text-sm text-gray-600">
            Gerencie as áreas de atuação do escritório
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Área
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingArea ? "Editar Área de Atuação" : "Nova Área de Atuação"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados da área de atuação
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
                  placeholder="Ex: Bancário - FRAUDES"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="bancario-fraudes"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Ícone</Label>
                <div className="grid grid-cols-4 gap-3 p-4 border rounded-lg bg-gray-50">
                  {availableIcons.map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: value })}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        formData.icon === value
                          ? 'border-yellow-500 bg-yellow-50 shadow-md scale-105'
                          : 'border-gray-200 bg-white hover:border-yellow-300 hover:bg-yellow-50'
                      }`}
                    >
                      <Icon className={`h-8 w-8 ${
                        formData.icon === value ? 'text-yellow-600' : 'text-gray-600'
                      }`} />
                      <span className={`text-xs text-center leading-tight ${
                        formData.icon === value ? 'text-yellow-600 font-semibold' : 'text-gray-600'
                      }`}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Selecione o ícone que melhor representa esta área de atuação
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição Curta</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve descrição para o card..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailedContent">Conteúdo Detalhado</Label>
                <Textarea
                  id="detailedContent"
                  value={formData.detailedContent}
                  onChange={(e) => setFormData({ ...formData, detailedContent: e.target.value })}
                  placeholder="Conteúdo completo da página individual..."
                  rows={8}
                />
                <p className="text-xs text-gray-500">
                  Use \n\n para separar parágrafos
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="featuredImage">URL da Imagem Destaque</Label>
                <Input
                  id="featuredImage"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                <p className="text-xs text-gray-500">
                  Imagem que aparecerá na página individual e no hero
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayOrder">Ordem de Exibição</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, displayOrder: parseInt(e.target.value) })
                  }
                />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {areas?.map((area) => (
          <Card key={area.id}>
            <CardHeader>
              <CardTitle className="text-lg">{area.title}</CardTitle>
              <CardDescription>{area.slug}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {area.description}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDialog(area)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(area.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {areas?.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-600">Nenhuma área de atuação cadastrada.</p>
            <Button className="mt-4" onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Primeira Área
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
