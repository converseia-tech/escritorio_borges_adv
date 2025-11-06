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
            {displayedMembers.map((member) => (
              <div key={member.id} className="relative group">
                <div className="aspect-[3/4] bg-gray-800 overflow-hidden">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={`${member.name} - ${member.position}`}
                      className="w-full h-full object-cover"
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
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                  <h3 className="text-white text-xl font-serif mb-1">{member.name}</h3>
                  <p className="text-gray-300 text-sm">{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
