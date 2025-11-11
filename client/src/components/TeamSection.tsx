import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TeamSection() {
  const { data: teamMembers } = trpc.site.getTeamMembers.useQuery();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!teamMembers || teamMembers.length === 0) {
    return null;
  }

  const visibleMembers = 3;
  const maxIndex = Math.max(0, teamMembers.length - visibleMembers);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const displayedMembers = teamMembers.slice(currentIndex, currentIndex + visibleMembers);

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-gray-400 text-sm mb-2 tracking-widest">NOSSA EQUIPE</p>
          <h2 className="text-4xl md:text-5xl font-serif text-white">Conheça o nosso corpo Jurídico</h2>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-16">
            {displayedMembers.map((member, index) => {
              const isMiddle = index === 1; // Membro do meio
              return (
                <div 
                  key={member.id} 
                  className={`relative group transition-all duration-500 ${
                    isMiddle ? 'md:scale-110 md:z-10' : 'md:scale-100'
                  }`}
                >
                  <div className={`aspect-[3/4] bg-gray-800 overflow-hidden rounded-lg shadow-2xl transition-all duration-500 ${
                    isMiddle 
                      ? 'ring-4 ring-yellow-500/50 group-hover:ring-yellow-500 group-hover:ring-8 group-hover:scale-105' 
                      : 'group-hover:scale-105 group-hover:ring-4 group-hover:ring-yellow-500/30'
                  }`}>
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt={`${member.name} - ${member.position}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                        <div className="text-center">
                          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary text-4xl font-bold">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Overlay brilhante no hover */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-yellow-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                      isMiddle ? 'opacity-30 group-hover:opacity-60' : ''
                    }`} />
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 rounded-b-lg transition-all duration-500 ${
                    isMiddle ? 'group-hover:from-yellow-600/30 group-hover:via-black/90' : 'group-hover:from-yellow-600/20'
                  }`}>
                    <h3 className={`text-white text-xl font-serif mb-1 transition-colors duration-300 ${
                      isMiddle ? 'text-2xl font-bold group-hover:text-yellow-400' : 'group-hover:text-yellow-400'
                    }`}>
                      {member.name}
                    </h3>
                    <p className={`text-gray-300 text-sm transition-colors duration-300 ${
                      isMiddle ? 'text-base group-hover:text-yellow-200' : 'group-hover:text-yellow-200'
                    }`}>
                      {member.position}
                    </p>
                    {member.oab && (
                      <p className={`text-gray-400 text-xs mt-1 transition-colors duration-300 ${
                        isMiddle ? 'group-hover:text-yellow-300' : 'group-hover:text-yellow-300'
                      }`}>
                        OAB: {member.oab}
                      </p>
                    )}
                  </div>
                  {/* Badge especial para o membro do meio */}
                  {isMiddle && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                      <div className="bg-yellow-500 text-black px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
