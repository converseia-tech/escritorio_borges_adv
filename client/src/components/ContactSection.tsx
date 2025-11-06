import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function ContactSection() {
  const { data: practiceAreas } = trpc.site.getPracticeAreas.useQuery();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    specialty: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    // Aqui você pode adicionar a lógica para enviar o formulário
    console.log("Form submitted:", formData);
    toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    
    // Limpar formulário
    setFormData({
      name: "",
      email: "",
      phone: "",
      city: "",
      specialty: "",
      message: "",
    });
  };

  return (
    <section id="contato" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-gray-500 text-sm mb-2 tracking-widest">ENTRE EM CONTATO</p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            Como podemos ajudar?
          </h2>
          <p className="text-gray-600">
            Preencha o formulário abaixo para receber o contato de um especialista:
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              placeholder="Nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white"
              required
            />
            <Input
              type="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="tel"
              placeholder="Telefone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-white"
              required
            />
            <Input
              placeholder="Cidade"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="bg-white"
            />
          </div>

          <Select
            value={formData.specialty}
            onValueChange={(value) => setFormData({ ...formData, specialty: value })}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Especialidade" />
            </SelectTrigger>
            <SelectContent>
              {practiceAreas?.map((area) => (
                <SelectItem key={area.id} value={area.slug}>
                  {area.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Mensagem"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="bg-white min-h-[150px]"
            required
          />

          <div className="text-center">
            <Button 
              type="submit"
              className="bg-black text-white hover:bg-gray-800 px-12 py-6 text-sm tracking-wider"
            >
              ENVIAR
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
