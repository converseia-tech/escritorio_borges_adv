import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Blog() {
  const { data: blogs, isLoading } = trpc.site.getPublishedBlogs.useQuery();

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-32 pb-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando artigos...</p>
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
      <div className="min-h-screen pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          {/* Header com design aprimorado */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <Badge variant="outline" className="px-6 py-2 text-yellow-600 border-yellow-600 font-semibold">
                BLOG JURÍDICO
              </Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-gray-900">
              Artigos e Notícias
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Fique por dentro das principais novidades do mundo jurídico com conteúdos
              escritos por nossa equipe de especialistas
            </p>
          </div>

          {/* Blog Grid com layout aprimorado */}
          {blogs && blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {blogs.map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.slug}`}>
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-white overflow-hidden border-0 shadow-md hover:-translate-y-1">
                    {/* Imagem destacada com overlay */}
                    {blog.featuredImage ? (
                      <div className="relative aspect-[16/10] overflow-hidden bg-gray-200">
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Overlay gradiente */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Badge de categoria (se houver) */}
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-yellow-600 hover:bg-yellow-700 text-white border-0 shadow-lg">
                            Artigo
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-[16/10] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <div className="text-center p-8">
                          <div className="w-16 h-16 mx-auto mb-3 bg-white/80 rounded-full flex items-center justify-center">
                            <span className="text-2xl">⚖️</span>
                          </div>
                          <p className="text-sm text-gray-600 font-medium">{blog.title.substring(0, 30)}...</p>
                        </div>
                      </div>
                    )}
                    
                    <CardHeader className="pb-4">
                      {/* Meta informações */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
                        {blog.publishedAt && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              {format(new Date(blog.publishedAt), "dd MMM yyyy", {
                                locale: ptBR,
                              })}
                            </span>
                          </div>
                        )}
                        {blog.author && (
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            <span>{blog.author}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>5 min</span>
                        </div>
                      </div>
                      
                      {/* Título */}
                      <CardTitle className="text-xl font-serif leading-tight group-hover:text-yellow-600 transition-colors line-clamp-2 mb-3">
                        {blog.title}
                      </CardTitle>
                      
                      {/* Excerpt/Descrição */}
                      {blog.excerpt && (
                        <CardDescription className="text-sm leading-relaxed line-clamp-3">
                          {blog.excerpt}
                        </CardDescription>
                      )}
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {/* Separador */}
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            Artigo Completo
                          </span>
                          <div className="flex items-center gap-2 text-yellow-600 text-sm font-semibold group-hover:gap-3 transition-all">
                            Ler agora
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl">📰</span>
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">
                Nenhum artigo publicado
              </h3>
              <p className="text-gray-500 text-lg">
                Em breve teremos novos conteúdos disponíveis.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
