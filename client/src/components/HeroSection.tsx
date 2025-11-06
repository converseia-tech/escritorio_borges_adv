import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const { data: heroContent } = trpc.site.getHeroContent.useQuery();

  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {heroContent?.backgroundImage ? (
          <img 
            src={heroContent.backgroundImage} 
            alt="Borges Advogados Associados - Equipe"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
        )}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Main Content - Aligned Left */}
      <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl w-full">
        <div className="max-w-3xl">
          <p className="text-yellow-500 text-base md:text-lg mb-4 tracking-widest font-semibold">
            SEJA BEM-VINDO À
          </p>
          
          <h1 className="text-white mb-2">
            <span className="block text-5xl md:text-7xl lg:text-8xl font-serif font-bold">
              Borges
            </span>
            <span className="block text-3xl md:text-4xl lg:text-5xl font-serif mt-2">
              Advogados Associados
            </span>
          </h1>
          
          <p className="text-white text-lg md:text-xl lg:text-2xl mb-8 mt-6 leading-relaxed">
            {heroContent?.subtitle || "Transformando desafios jurídicos complexos em soluções eficazes e personalizadas"}
          </p>
          
          <Button 
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-base px-8 py-6 tracking-wider border-2 border-yellow-500 hover:border-yellow-600 transition-all shadow-lg"
            asChild
          >
            <a href={heroContent?.ctaLink || "/#contato"}>
              {heroContent?.ctaText || "ENTRE EM CONTATO"}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
