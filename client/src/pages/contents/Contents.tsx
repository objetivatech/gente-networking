import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { FileText, Video, FileSpreadsheet, Link as LinkIcon, Plus } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Contents() {
  const { user } = useAuth();
  const { data: contents, isLoading } = trpc.contents.getAll.useQuery();

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'presentation':
        return <FileSpreadsheet className="h-5 w-5" />;
      case 'link':
        return <LinkIcon className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Vídeo';
      case 'document':
        return 'Documento';
      case 'presentation':
        return 'Apresentação';
      case 'link':
        return 'Link';
      default:
        return 'Conteúdo';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              Conteúdos Estratégicos
            </h1>
            <p className="text-muted-foreground">
              Materiais exclusivos para membros da comunidade
            </p>
          </div>
          {user?.role === 'admin' && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Conteúdo
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : contents && contents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contents.map((content) => (
              <Card key={content.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {getIcon(content.type)}
                      </div>
                      <span className="text-xs font-medium bg-muted px-2 py-1 rounded">
                        {getTypeLabel(content.type)}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="mt-3 group-hover:text-primary transition-colors">
                    {content.title}
                  </CardTitle>
                  {content.category && (
                    <CardDescription className="text-xs">
                      {content.category}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {content.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {content.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {formatDistanceToNow(new Date(content.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={content.url} target="_blank" rel="noopener noreferrer">
                        Acessar
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhum conteúdo disponível ainda
              </p>
              {user?.role === 'admin' && (
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Conteúdo
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
