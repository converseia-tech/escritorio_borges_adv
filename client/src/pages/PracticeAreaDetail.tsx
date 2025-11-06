import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Loader2 } from "lucide-react";

export default function PracticeAreaDetail() {
  const [, params] = useRoute("/area/:slug");
  const slug = params?.slug || "";

  const { data: area, isLoading } = trpc.site.getPracticeAreaBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!area) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Área não encontrada</h1>
            <p className="text-gray-600">A área de atuação solicitada não existe.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative h-[400px] flex items-center justify-center text-white"
        style={{
          backgroundImage: area.featuredImage
            ? `url(${area.featuredImage})`
            : "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center max-w-4xl px-4">
          <p className="text-sm uppercase tracking-widest text-primary mb-4">
            ÁREAS DE ATUAÇÃO
          </p>
          <h1 className="text-5xl md:text-6xl font-serif mb-6">{area.title}</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Transformando desafios jurídicos complexos em soluções eficazes e personalizadas
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Text Content */}
            <div>
              <p className="text-sm uppercase tracking-widest text-primary mb-4">
                SOMOS ESPECIALISTAS
              </p>
              <h2 className="text-4xl font-serif mb-6">{area.title}</h2>
              
              {area.description && (
                <p className="text-lg font-semibold mb-6 text-gray-800">
                  {area.description}
                </p>
              )}

              {area.detailedContent && (
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                  {area.detailedContent.split('\n\n').map((paragraph: string, index: number) => (
                    <p key={index} className="text-justify">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative">
                <img
                  src={
                    area.featuredImage ||
                    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800"
                  }
                  alt={area.title}
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 border-4 border-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
