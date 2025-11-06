import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Instagram, Facebook } from "lucide-react";

export default function Footer() {
  const { data: contactInfo } = trpc.site.getContactInfo.useQuery();
  const { data: siteSettings } = trpc.site.getSiteSettings.useQuery();

  // JSONB do PostgreSQL já retorna objetos, não precisa fazer JSON.parse()
  const hours = contactInfo?.hours as Record<string, string> | null;
  const socialMedia = siteSettings?.socialMedia as { instagram?: string; facebook?: string; whatsapp?: string } | null;

  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo */}
          <div>
            {siteSettings?.logoUrl ? (
              <img 
                src={siteSettings.logoUrl} 
                alt="Borges Advogados Associados" 
                className="h-20 w-auto mb-4"
              />
            ) : (
              <div className="flex flex-col items-start mb-4">
                <div className="border-2 border-primary px-3 py-2">
                  <span className="text-primary text-2xl font-bold tracking-wider">BS</span>
                </div>
                <span className="text-primary text-xs mt-2 tracking-widest">BORGES</span>
                <span className="text-white text-[8px] tracking-wider">ADVOGADOS ASSOCIADOS</span>
              </div>
            )}
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 mt-4">
              {socialMedia?.instagram && (
                <a 
                  href={socialMedia.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {socialMedia?.facebook && (
                <a 
                  href={socialMedia.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {socialMedia?.whatsapp && (
                <a 
                  href={`https://wa.me/${socialMedia.whatsapp.replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-sm font-bold mb-4 tracking-wider">LINKS RÁPIDOS</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="text-gray-400 hover:text-primary transition-colors cursor-pointer text-sm">
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <a href="/#sobre-nos">
                  <span className="text-gray-400 hover:text-primary transition-colors cursor-pointer text-sm">
                    Sobre nós
                  </span>
                </a>
              </li>
              <li>
                <a href="/#contato">
                  <span className="text-gray-400 hover:text-primary transition-colors cursor-pointer text-sm">
                    Contato
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-sm font-bold mb-4 tracking-wider">CONTATO</h3>
            {contactInfo?.address && (
              <p className="text-gray-400 text-sm mb-2">SEDE</p>
            )}
            {contactInfo?.phone && (
              <p className="text-gray-400 text-sm">FIXO</p>
            )}
          </div>

          {/* Horários */}
          <div>
            <h3 className="text-sm font-bold mb-4 tracking-wider">HORÁRIOS</h3>
            {hours && (
              <ul className="space-y-1">
                {Object.entries(hours).map(([day, time]) => (
                  <li key={day} className="flex justify-between text-sm">
                    <span className="text-gray-400">{day}</span>
                    <span className="text-gray-400">{time as string}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Borges Advogados Associados. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
