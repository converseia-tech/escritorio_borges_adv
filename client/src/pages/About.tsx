import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";

export default function About() {
  const { data: aboutPage, isLoading } = trpc.site.getAboutPage.useQuery();

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      {/* Hero Section com imagem de fundo em fade-in */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image com fade-in overlay */}
        {aboutPage?.heroBackgroundImage && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${aboutPage.heroBackgroundImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
          </>
        )}
        
        {/* Sem imagem, usar fundo escuro */}
        {!aboutPage?.heroBackgroundImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
        )}

        {/* Logo BA gigante em background */}
        <div className="absolute inset-0 flex items-center justify-start pl-12 opacity-10">
          <div className="text-[600px] font-bold text-yellow-600 leading-none select-none">
            BA
          </div>
        </div>

        {/* Conteúdo do Hero */}
        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-yellow-600 uppercase tracking-wider text-sm font-semibold mb-4">
              CONHEÇA NOSSA HISTÓRIA
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-0">
              {aboutPage?.heroTitle || "Sobre nós"}
            </h1>
          </div>
        </div>
      </section>

      {/* História Section - Baseada na segunda imagem de referência */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          {/* Título da seção */}
          <div className="text-center mb-4">
            <p className="text-yellow-600 uppercase tracking-wider text-sm font-semibold mb-2">
              CONHEÇA NOSSA HISTÓRIA
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              {aboutPage?.historyTitle || "Borges Advogados Associados"}
            </h2>
          </div>

          {/* Grid: Texto + Imagem */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
            {/* Coluna de Texto */}
            <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: aboutPage?.historyContent || "" 
                }} 
                className="prose prose-lg max-w-none
                  prose-p:mb-4 prose-p:leading-relaxed
                  prose-strong:text-gray-900 prose-strong:font-semibold"
              />
            </div>

            {/* Coluna da Imagem com moldura decorativa */}
            {aboutPage?.historyImage && (
              <div className="relative">
                {/* Moldura decorativa */}
                <div className="absolute -top-4 -right-4 w-full h-full border-4 border-yellow-600 rounded-lg" />
                
                {/* Imagem */}
                <div className="relative bg-white p-2 rounded-lg shadow-xl">
                  <img
                    src={aboutPage.historyImage}
                    alt="Equipe Borges Advogados"
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ENTRE EM CONTATO
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Convidamos você a conhecer nosso escritório e nossa equipe, e a descobrir como podemos auxiliar na resolução de suas demandas jurídicas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/#contato" className="inline-block">
              <button className="bg-white text-yellow-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Fale Conosco
              </button>
            </a>
            <a
              href="https://wa.me/5548999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-yellow-600 transition-colors">
                WhatsApp
              </button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
