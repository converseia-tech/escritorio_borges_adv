import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AboutSection() {
  const { data: aboutContent } = trpc.site.getAboutContent.useQuery();

  if (!aboutContent) {
    return null;
  }

  return (
    <section id="sobre-nos" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Text Content */}
          <div>
            <p className="text-gray-500 text-sm mb-2 tracking-widest">{aboutContent.subtitle}</p>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
              {aboutContent.title}
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              {aboutContent.content}
            </p>
            <a href="#contato">
              <Button 
                variant="outline" 
                className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all"
              >
                ENTRE EM CONTATO
              </Button>
            </a>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] bg-gray-200 border-8 border-white shadow-2xl">
              {aboutContent.image ? (
                <img 
                  src={aboutContent.image} 
                  alt="Borges Advogados Associados - Escritório"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                  <div className="text-center p-8">
                    <div className="border-4 border-primary p-6 inline-block">
                      <span className="text-primary text-6xl font-bold">BS</span>
                    </div>
                    <p className="text-gray-600 mt-4 text-sm">Imagem do escritório</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
