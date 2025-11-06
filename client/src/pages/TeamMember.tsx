import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function TeamMember() {
  const [, params] = useRoute("/equipe/:id");
  const memberId = params?.id ? parseInt(params.id) : 0;

  const { data: member, isLoading } = trpc.site.getTeamMemberById.useQuery({ id: memberId });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Membro não encontrado</h1>
          <Link href="/">
            <Button>Voltar para Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-6">
          <p className="text-white text-sm mb-4 tracking-widest">ESTOU PRONTO PARA AJUDÁ-LO</p>
          <h1 className="text-white text-5xl md:text-6xl font-serif mb-4">
            {member.name}
          </h1>
          <p className="text-white text-lg">
            {member.position}
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-gray-500 text-sm mb-4 tracking-widest">SOBRE MIM</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Image */}
              <div className="relative">
                <div className="aspect-[3/4] bg-gray-200 overflow-hidden shadow-2xl">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                      <div className="text-center p-8">
                        <div className="w-32 h-32 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
                          <span className="text-primary text-6xl font-bold">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div>
                <h2 className="text-4xl font-serif text-gray-900 mb-4">
                  {member.name}
                </h2>
                <p className="text-xl text-primary mb-2">{member.position}</p>
                {member.oab && (
                  <p className="text-sm text-gray-600 mb-6">{member.oab}</p>
                )}
                
                <div className="prose prose-lg max-w-none">
                  {member.bio ? (
                    member.bio.split('\n\n').map((paragraph: string, index: number) => (
                      <p key={index} className="text-gray-700 mb-4 text-justify leading-relaxed">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-600 italic">Biografia não disponível.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
