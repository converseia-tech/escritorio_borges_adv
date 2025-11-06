import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Blog() {
  const { data: blogs, isLoading } = trpc.site.getPublishedBlogs.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando artigos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            BLOG JURÍDICO
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Artigos e Notícias
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fique por dentro das principais novidades do mundo jurídico com conteúdos
            escritos por nossa equipe de especialistas
          </p>
        </div>

        {/* Blog Grid */}
        {blogs && blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  {blog.featuredImage && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      {blog.publishedAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(blog.publishedAt), "dd 'de' MMMM, yyyy", {
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {blog.title}
                    </CardTitle>
                    {blog.excerpt && (
                      <CardDescription className="mt-2 line-clamp-3">
                        {blog.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      {blog.author && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="h-4 w-4" />
                          <span>{blog.author}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                        Ler mais
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              Nenhum artigo publicado no momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
