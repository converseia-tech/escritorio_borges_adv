import { trpc } from "@/lib/trpc";
import { 
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
import { Link } from "wouter";

// Mapa expandido de ícones disponíveis
const iconMap: Record<string, any> = {
  bank: Building2,
  users: Users,
  briefcase: Briefcase,
  "shopping-cart": ShoppingCart,
  shield: Shield,
  scale: Scale,
  home: Home,
  heart: Heart,
  "file-text": FileText,
  landmark: Landmark,
  car: Car,
  banknote: Banknote,
  handshake: HandshakeIcon,
  "user-check": UserCheck,
  baby: Baby,
  coins: Coins,
};

export default function PracticeAreasSection() {
  const { data: practiceAreas } = trpc.site.getPracticeAreas.useQuery();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-gray-500 text-sm mb-2 tracking-widest">NOSSAS ESPECIALIDADES</p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900">Áreas de atuação</h2>
        </div>

        {/* Grid responsivo que mostra todas as áreas sem necessidade de scroll */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {practiceAreas?.map((area) => {
            const Icon = iconMap[area.icon || "briefcase"] || Briefcase;
            return (
              <Link key={area.id} href={`/area/${area.slug}`}>
                <div className="relative border-2 border-gray-200 p-8 hover:border-yellow-500 transition-all duration-300 cursor-pointer group h-full flex flex-col bg-white hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
                  {/* Efeito de brilho de fundo */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 via-yellow-500/0 to-yellow-500/0 group-hover:from-yellow-500/5 group-hover:via-yellow-500/10 group-hover:to-yellow-500/5 transition-all duration-500" />
                  
                  <div className="relative z-10">
                    {/* Ícone com background circular */}
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-yellow-500/20 group-hover:to-yellow-600/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                          <Icon className="h-10 w-10 text-gray-700 group-hover:text-yellow-600 transition-all duration-300 group-hover:scale-110" strokeWidth={1.5} />
                        </div>
                        {/* Anel externo animado */}
                        <div className="absolute inset-0 rounded-full border-2 border-yellow-500/0 group-hover:border-yellow-500/50 transition-all duration-300 group-hover:scale-125" />
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-serif text-center mb-3 text-gray-900 group-hover:text-yellow-600 transition-colors duration-300">
                      {area.title}
                    </h3>
                    <p className="text-sm text-gray-600 text-center line-clamp-3 group-hover:text-gray-800 transition-colors duration-300">
                      {area.description}
                    </p>
                    
                    {/* Seta de "saiba mais" */}
                    <div className="mt-4 flex justify-center">
                      <span className="text-xs text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold tracking-wider">
                        SAIBA MAIS →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
