import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const { data: heroContent } = trpc.site.getHeroContent.useQuery();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {heroContent?.backgroundImage ? (
          <img 
            src={heroContent.backgroundImage} 
            alt="Borges Advogados Associados - Equipe"
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
        )}
        {/* Gradient overlays modernos */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
      </div>

      {/* Efeito de brilho animado */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <div className="absolute -left-1/4 top-1/4 w-1/2 h-1/2 bg-yellow-500/10 blur-[100px] rounded-full animate-pulse-slow" />
      </div>

      {/* Main Content - Aligned Left SEM caixa, apenas text-shadow */}
      <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl w-full">
        <div className="max-w-3xl">
          <p className="text-yellow-500 text-sm sm:text-base md:text-lg mb-4 tracking-widest font-bold uppercase"
             style={{
               textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.6), 0 0 30px rgba(234,179,8,0.3)'
             }}>
            SEJA BEM-VINDO À
          </p>
          
          <h1 className="text-white mb-2">
            <span className="block text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold"
                  style={{
                    textShadow: '0 4px 15px rgba(0,0,0,0.9), 0 8px 30px rgba(0,0,0,0.7), 0 2px 5px rgba(0,0,0,1)'
                  }}>
              Borges
            </span>
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mt-2"
                  style={{
                    textShadow: '0 3px 12px rgba(0,0,0,0.9), 0 6px 25px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,1)'
                  }}>
              Advogados Associados
            </span>
          </h1>
          
          <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl mb-8 mt-6 leading-relaxed max-w-2xl"
             style={{
               textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 4px 15px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,1)'
             }}>
            {heroContent?.subtitle || "Transformando desafios jurídicos complexos em soluções eficazes e personalizadas"}
          </p>
          
          <Button 
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-sm sm:text-base md:text-lg px-6 sm:px-8 py-4 sm:py-6 tracking-wider border-2 border-yellow-500 hover:border-yellow-600 transition-all shadow-2xl hover:shadow-yellow-500/50 hover:scale-105"
            style={{
              boxShadow: '0 4px 20px rgba(0,0,0,0.8), 0 8px 40px rgba(234,179,8,0.4)'
            }}
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
