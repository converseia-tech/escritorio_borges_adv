import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function TeamManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    bio: "",
    oab: "",
    image: "",
    displayOrder: 0,
  });

  const { data: teamMembers, refetch } = trpc.site.getTeamMembers.useQuery();

  // Função de upload de imagem
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Validar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 10MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('context', 'borges-advogados-equipe');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Falha no upload');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, image: data.url }));
      toast.success('Imagem carregada com sucesso!');
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleOpenDialog = (member?: any) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name || "",
        position: member.position || "",
        bio: member.bio || "",
        oab: member.oab || "",
        image: member.image || "",
        displayOrder: member.displayOrder || 0,
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: "",
        position: "",
        bio: "",
        oab: "",
        image: "",
        displayOrder: teamMembers?.length || 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMember(null);
    setFormData({
      name: "",
      position: "",
      bio: "",
      oab: "",
      image: "",
      displayOrder: 0,
    });
  };

  const createMutation = trpc.admin.createTeamMember.useMutation();
  const updateMutation = trpc.admin.updateTeamMember.useMutation();
  const deleteMutation = trpc.admin.deleteTeamMember.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.position) {
      toast.error("Nome e cargo são obrigatórios");
      return;
    }

    try {
      if (editingMember) {
        await updateMutation.mutateAsync({
          id: editingMember.id,
          ...formData,
        });
        toast.success("Membro atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Membro adicionado com sucesso!");
      }
      handleCloseDialog();
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar membro");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja remover este membro?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Membro removido com sucesso!");
      refetch();
    } catch (error) {
      toast.error("Erro ao remover membro");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Equipe</h2>
          <p className="text-gray-600 text-sm">Adicione, edite ou remova membros da equipe</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Membro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMember ? "Editar Membro" : "Adicionar Novo Membro"}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do membro da equipe
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Lucas Borges Languer"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Cargo *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="Ex: Advogado Sócio Fundador e CEO"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="oab">OAB</Label>
                  <Input
                    id="oab"
                    value={formData.oab}
                    onChange={(e) => setFormData({ ...formData, oab: e.target.value })}
                    placeholder="Ex: OAB/SC 40.598"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayOrder">Ordem de Exibição</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Imagem do Membro</Label>
                <div className="flex gap-2">
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="URL da foto do membro"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="team-image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('team-image-upload')?.click()}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {formData.image && (
                  <div className="mt-2">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Cole a URL da imagem ou faça upload usando o botão
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Escreva a biografia completa do membro..."
                  rows={8}
                  className="resize-none"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingMember ? "Salvar Alterações" : "Adicionar Membro"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers?.map((member) => (
          <Card key={member.id}>
            <CardHeader className="p-0">
              <div className="aspect-[3/4] bg-gray-200 overflow-hidden">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                    <span className="text-6xl font-bold text-gray-600">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-1">{member.name}</CardTitle>
              <p className="text-sm text-gray-600 mb-2">{member.position}</p>
              {member.oab && (
                <p className="text-xs text-gray-500 mb-3">{member.oab}</p>
              )}
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenDialog(member)}
                  className="flex-1"
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(member.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!teamMembers || teamMembers.length === 0) && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Nenhum membro cadastrado ainda.</p>
            <p className="text-sm text-gray-400 mt-2">
              Clique em "Adicionar Membro" para começar.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
