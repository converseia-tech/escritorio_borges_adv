import { trpc } from "@/lib/trpc";
import { Building2, Users, Briefcase, ShoppingCart, Shield } from "lucide-react";
import { Link } from "wouter";

const iconMap: Record<string, any> = {
  bank: Building2,
  users: Users,
  briefcase: Briefcase,
  "shopping-cart": ShoppingCart,
  shield: Shield,
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {practiceAreas?.slice(0, 3).map((area) => {
            const Icon = iconMap[area.icon || "briefcase"] || Briefcase;
            return (
              <Link key={area.id} href={`/area/${area.slug}`}>
                <div className="border border-gray-300 p-8 hover:border-primary transition-all cursor-pointer group h-full flex flex-col">
                  <div className="flex justify-center mb-6">
                    <Icon className="h-16 w-16 text-gray-800 group-hover:text-primary transition-colors" strokeWidth={1} />
                  </div>
                  <h3 className="text-xl font-serif text-center mb-4 text-gray-900">
                    {area.title}
                  </h3>
                  <p className="text-sm text-gray-600 text-center line-clamp-3">
                    {area.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {practiceAreas && practiceAreas.length > 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
            {practiceAreas.slice(3, 5).map((area) => {
              const Icon = iconMap[area.icon || "briefcase"] || Briefcase;
              return (
                <Link key={area.id} href={`/area/${area.slug}`}>
                  <div className="border border-gray-300 p-8 hover:border-primary transition-all cursor-pointer group h-full flex flex-col">
                    <div className="flex justify-center mb-6">
                      <Icon className="h-16 w-16 text-gray-800 group-hover:text-primary transition-colors" strokeWidth={1} />
                    </div>
                    <h3 className="text-xl font-serif text-center mb-4 text-gray-900">
                      {area.title}
                    </h3>
                    <p className="text-sm text-gray-600 text-center line-clamp-3">
                      {area.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
