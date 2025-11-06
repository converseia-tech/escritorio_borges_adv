import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Navbar() {
  const [areasDropdownOpen, setAreasDropdownOpen] = useState(false);
  const [equipeDropdownOpen, setEquipeDropdownOpen] = useState(false);

  const { data: practiceAreas } = trpc.site.getPracticeAreas.useQuery();
  const { data: teamMembers } = trpc.site.getTeamMembers.useQuery();
  const { data: siteSettings } = trpc.site.getSiteSettings.useQuery();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              {siteSettings?.logoUrl ? (
                <img 
                  src={siteSettings.logoUrl} 
                  alt="Borges Advogados Associados" 
                  className="h-20 w-auto md:h-24"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <div className="border-2 border-primary px-4 py-3">
                    <span className="text-primary text-3xl md:text-4xl font-bold tracking-wider">BS</span>
                  </div>
                  <span className="text-primary text-sm mt-1 tracking-widest">BORGES</span>
                  <span className="text-white text-[10px] tracking-wider">ADVOGADOS ASSOCIADOS</span>
                </div>
              )}
            </div>
          </Link>

          {/* Menu Items */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <span className="text-white hover:text-primary transition-colors cursor-pointer text-base font-medium tracking-wide">
                HOME
              </span>
            </Link>

            <a href="/#sobre-nos">
              <span className="text-white hover:text-primary transition-colors cursor-pointer text-base font-medium tracking-wide">
                SOBRE NÓS
              </span>
            </a>

            {/* Áreas de Atuação Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setAreasDropdownOpen(true)}
              onMouseLeave={() => setAreasDropdownOpen(false)}
            >
              <button className="flex items-center text-white hover:text-primary transition-colors text-base font-medium tracking-wide">
                ÁREAS DE ATUAÇÃO
                <ChevronDown className="ml-1 h-5 w-5" />
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
              onMouseEnter={() => setEquipeDropdownOpen(true)}
              onMouseLeave={() => setEquipeDropdownOpen(false)}
            >
              <button className="flex items-center text-white hover:text-primary transition-colors text-base font-medium tracking-wide">
                EQUIPE
                <ChevronDown className="ml-1 h-5 w-5" />
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
              <span className="text-white hover:text-primary transition-colors cursor-pointer text-base font-medium tracking-wide">
                CONTATO
              </span>
            </a>

            <Link href="/blog">
              <span className="text-white hover:text-primary transition-colors cursor-pointer text-base font-medium tracking-wide">
                BLOG
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
