import { useState, useRef } from "react";
import { Link } from "wouter";
import { ChevronDown, Menu, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [areasDropdownOpen, setAreasDropdownOpen] = useState(false);
  const [equipeDropdownOpen, setEquipeDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Refs para timeouts de fechamento
  const areasTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const equipeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: practiceAreas } = trpc.site.getPracticeAreas.useQuery();
  const { data: teamMembers } = trpc.site.getTeamMembers.useQuery();
  const { data: siteSettings } = trpc.site.getSiteSettings.useQuery();

  // Funções para controlar dropdown de áreas com delay
  const handleAreasMouseEnter = () => {
    if (areasTimeoutRef.current) {
      clearTimeout(areasTimeoutRef.current);
    }
    setAreasDropdownOpen(true);
  };

  const handleAreasMouseLeave = () => {
    areasTimeoutRef.current = setTimeout(() => {
      setAreasDropdownOpen(false);
    }, 300); // Delay de 300ms antes de fechar
  };

  // Funções para controlar dropdown de equipe com delay
  const handleEquipeMouseEnter = () => {
    if (equipeTimeoutRef.current) {
      clearTimeout(equipeTimeoutRef.current);
    }
    setEquipeDropdownOpen(true);
  };

  const handleEquipeMouseLeave = () => {
    equipeTimeoutRef.current = setTimeout(() => {
      setEquipeDropdownOpen(false);
    }, 300); // Delay de 300ms antes de fechar
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
              {siteSettings?.logoUrl ? (
                <img 
                  src={siteSettings.logoUrl} 
                  alt="Borges Advogados Associados" 
                  className="h-16 sm:h-20 md:h-24 w-auto"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <div className="border-2 border-primary px-3 py-2 sm:px-4 sm:py-3">
                    <span className="text-primary text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider">BS</span>
                  </div>
                  <span className="text-primary text-xs sm:text-sm mt-1 tracking-widest">BORGES</span>
                  <span className="text-white text-[8px] sm:text-[10px] tracking-wider">ADVOGADOS ASSOCIADOS</span>
                </div>
              )}
            </div>
          </Link>

          {/* Botão Menu Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:text-primary hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="/">
              <span className="text-white hover:text-primary transition-colors cursor-pointer text-sm lg:text-base font-medium tracking-wide">
                HOME
              </span>
            </Link>

            <Link href="/sobre">
              <span className="text-white hover:text-primary transition-colors cursor-pointer text-sm lg:text-base font-medium tracking-wide">
                SOBRE NÓS
              </span>
            </Link>

            {/* Áreas de Atuação Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleAreasMouseEnter}
              onMouseLeave={handleAreasMouseLeave}
            >
              <button className="flex items-center text-white hover:text-primary transition-colors text-sm lg:text-base font-medium tracking-wide">
                ÁREAS DE ATUAÇÃO
                <ChevronDown className="ml-1 h-4 w-4 lg:h-5 lg:w-5" />
              </button>
              
              {areasDropdownOpen && practiceAreas && practiceAreas.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-sm">
                  {practiceAreas.map((area) => (
                    <Link key={area.id} href={`/area/${area.slug}`}>
                      <div className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0">
                        <span className="text-gray-800 text-sm font-medium">{area.title}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Equipe Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleEquipeMouseEnter}
              onMouseLeave={handleEquipeMouseLeave}
            >
              <button className="flex items-center text-white hover:text-primary transition-colors text-sm lg:text-base font-medium tracking-wide">
                EQUIPE
                <ChevronDown className="ml-1 h-4 w-4 lg:h-5 lg:w-5" />
              </button>
              
              {equipeDropdownOpen && teamMembers && teamMembers.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-sm max-h-96 overflow-y-auto">
                  {teamMembers.map((member) => (
                    <Link key={member.id} href={`/equipe/${member.id}`}>
                      <div className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0">
                        <span className="text-gray-800 text-sm font-medium">{member.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <a href="/#contato">
              <span className="text-white hover:text-primary transition-colors cursor-pointer text-sm lg:text-base font-medium tracking-wide">
                CONTATO
              </span>
            </a>

            <Link href="/blog">
              <span className="text-white hover:text-primary transition-colors cursor-pointer text-sm lg:text-base font-medium tracking-wide">
                BLOG
              </span>
            </Link>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-white/20">
            <div className="flex flex-col space-y-4">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-white hover:text-primary transition-colors cursor-pointer text-base font-medium tracking-wide block py-2">
                  HOME
                </span>
              </Link>

              <Link href="/sobre" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-white hover:text-primary transition-colors cursor-pointer text-base font-medium tracking-wide block py-2">
                  SOBRE NÓS
                </span>
              </Link>

              {/* Áreas de Atuação - Mobile */}
              <div>
                <button 
                  onClick={() => setAreasDropdownOpen(!areasDropdownOpen)}
                  className="flex items-center justify-between w-full text-white hover:text-primary transition-colors text-base font-medium tracking-wide py-2"
                >
                  ÁREAS DE ATUAÇÃO
                  <ChevronDown className={`h-5 w-5 transition-transform ${areasDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {areasDropdownOpen && practiceAreas && practiceAreas.length > 0 && (
                  <div className="mt-2 ml-4 space-y-2">
                    {practiceAreas.map((area) => (
                      <Link key={area.id} href={`/area/${area.slug}`} onClick={() => setMobileMenuOpen(false)}>
                        <div className="text-gray-300 hover:text-primary cursor-pointer text-sm py-2">
                          {area.title}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Equipe - Mobile */}
              <div>
                <button 
                  onClick={() => setEquipeDropdownOpen(!equipeDropdownOpen)}
                  className="flex items-center justify-between w-full text-white hover:text-primary transition-colors text-base font-medium tracking-wide py-2"
                >
                  EQUIPE
                  <ChevronDown className={`h-5 w-5 transition-transform ${equipeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {equipeDropdownOpen && teamMembers && teamMembers.length > 0 && (
                  <div className="mt-2 ml-4 space-y-2 max-h-60 overflow-y-auto">
                    {teamMembers.map((member) => (
                      <Link key={member.id} href={`/equipe/${member.id}`} onClick={() => setMobileMenuOpen(false)}>
                        <div className="text-gray-300 hover:text-primary cursor-pointer text-sm py-2">
                          {member.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <a href="/#contato" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-white hover:text-primary transition-colors cursor-pointer text-base font-medium tracking-wide block py-2">
                  CONTATO
                </span>
              </a>

              <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-white hover:text-primary transition-colors cursor-pointer text-base font-medium tracking-wide block py-2">
                  BLOG
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
