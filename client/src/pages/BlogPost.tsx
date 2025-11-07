import { useParams, Link } from "wouter";
import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trackViewContent } from "@/lib/tracking";

export default function BlogPost() {
  const { slug } = useParams();
  const { data: blogs } = trpc.site.getPublishedBlogs.useQuery();
  
  const blog = blogs?.find((b) => b.slug === slug);

  // Rastrear visualização do conteúdo do blog
  useEffect(() => {
    if (blog) {
      trackViewContent(blog.title, 'blog', blog.id.toString());
    }
  }, [blog]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.excerpt || "",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado para a área de transferência!");
    }
  };

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-32 pb-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Artigo não encontrado</h1>
              <p className="text-gray-600 mb-8">
                O artigo que você está procurando não existe ou foi removido.
              </p>
              <Link href="/blog">
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para o blog
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-32 pb-20 bg-gray-50">
        <div className="container mx-auto px-6">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="hover:bg-yellow-50 hover:text-yellow-600">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o blog
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <article className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* Featured Image */}
              {blog.featuredImage && (
                <div className="aspect-video overflow-hidden rounded-lg mb-8">
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Category Badge */}
              <Badge variant="outline" className="mb-4 text-yellow-600 border-yellow-600">
                ARTIGO JURÍDICO
              </Badge>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
                {blog.title}
              </h1>

              {/* Excerpt */}
              {blog.excerpt && (
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {blog.excerpt}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b">
                {blog.author && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-5 w-5" />
                    <span className="font-medium">{blog.author}</span>
                  </div>
                )}
                {blog.publishedAt && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-5 w-5" />
                    <span>
                      {format(new Date(blog.publishedAt), "dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="ml-auto hover:bg-yellow-50 hover:text-yellow-600"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </div>

              {/* Content */}
              <div
                className="prose prose-lg max-w-none
                  prose-headings:font-bold prose-headings:text-gray-900
                  prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:text-yellow-600
                  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
                  prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                  prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                  prose-li:text-gray-700 prose-li:mb-3 prose-li:text-lg
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-a:text-yellow-600 prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-yellow-600 prose-blockquote:bg-yellow-50 prose-blockquote:py-4 prose-blockquote:px-6"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg p-8 mt-12 text-white">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Precisa de ajuda jurídica?
                </h2>
                <p className="text-lg mb-6 opacity-90">
                  Nossa equipe de advogados especializados está pronta para atender você.
                  Entre em contato conosco e agende uma consulta.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/#contato">
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-yellow-600 hover:bg-gray-100">
                      Fale Conosco
                    </Button>
                  </Link>
                  <a
                    href="https://wa.me/5548999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white text-yellow-600 hover:bg-gray-100 border-white">
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">Outros artigos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs
                  ?.filter((b) => b.id !== blog.id)
                  .slice(0, 2)
                  .map((relatedBlog) => (
                    <Link key={relatedBlog.id} href={`/blog/${relatedBlog.slug}`}>
                      <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-yellow-600">
                        <h4 className="font-bold text-lg mb-2 hover:text-yellow-600 transition-colors">
                          {relatedBlog.title}
                        </h4>
                        {relatedBlog.excerpt && (
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {relatedBlog.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </article>
        </div>
      </div>
      <Footer />
    </>
  );
}
