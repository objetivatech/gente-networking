import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Activity, TrendingUp, Users, Calendar, Plus, Trophy } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: activities, isLoading } = trpc.activities.getRecent.useQuery(
    { limit: 20 },
    { enabled: isAuthenticated }
  );
  const { data: leaderboard } = trpc.gamification.getLeaderboard.useQuery(
    { limit: 5 },
    { enabled: isAuthenticated }
  );
  const { data: myScore } = trpc.gamification.getUserScore.useQuery(
    {},
    { enabled: isAuthenticated }
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'referral':
        return '🤝';
      case 'business':
        return '💼';
      case 'meeting':
        return '☕';
      case 'testimonial':
        return '⭐';
      default:
        return '📌';
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'referral':
        return 'Indicação';
      case 'business':
        return 'Negócio';
      case 'meeting':
        return 'Reunião 1 a 1';
      case 'testimonial':
        return 'Depoimento';
      default:
        return 'Atividade';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bem-vindo, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Acompanhe suas atividades e o desempenho da comunidade
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/activities/new?type=referral">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Nova Indicação
                </CardTitle>
                <span className="text-2xl">🤝</span>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Indicar um contato para outro membro
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/activities/new?type=business">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Novo Negócio
                </CardTitle>
                <span className="text-2xl">💼</span>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Registrar negócio realizado
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/activities/new?type=meeting">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Reunião 1 a 1
                </CardTitle>
                <span className="text-2xl">☕</span>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Registrar Gente em Ação
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/activities/new?type=testimonial">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Depoimento
                </CardTitle>
                <span className="text-2xl">⭐</span>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Agradecer ou elogiar um membro
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Seu Desempenho</CardTitle>
              <CardDescription>Estatísticas do mês atual</CardDescription>
            </CardHeader>
            <CardContent>
              {myScore ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Pontos Totais</span>
                    <span className="text-2xl font-bold text-primary">
                      {myScore.total_points}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Indicações</p>
                      <p className="text-xl font-semibold">{myScore.referral_count}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Negócios</p>
                      <p className="text-xl font-semibold">{myScore.business_count}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Reuniões</p>
                      <p className="text-xl font-semibold">{myScore.meeting_count}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Depoimentos</p>
                      <p className="text-xl font-semibold">{myScore.testimonial_count}</p>
                    </div>
                  </div>
                  {myScore.total_business_value > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground">Valor em Negócios</p>
                      <p className="text-xl font-semibold text-green-600">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(myScore.total_business_value / 100)}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhuma atividade registrada este mês
                </p>
              )}
            </CardContent>
          </Card>

          {/* Leaderboard Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-secondary" />
                Ranking do Mês
              </CardTitle>
              <CardDescription>Top 5 membros mais ativos</CardDescription>
            </CardHeader>
            <CardContent>
              {leaderboard && leaderboard.length > 0 ? (
                <div className="space-y-3">
                  {leaderboard.map((member, index) => (
                    <div key={member.userId} className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-600 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{member.userName}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.total_points} pontos
                        </p>
                      </div>
                      {member.userId === user?.id && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          Você
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum dado disponível
                </p>
              )}
              <Link href="/leaderboard">
                <a>
                  <Button variant="outline" className="w-full mt-4">
                    Ver Ranking Completo
                  </Button>
                </a>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Feed de Atividades</CardTitle>
            <CardDescription>Últimas atividades da comunidade</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : activities && activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="text-3xl">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                          {getActivityLabel(activity.type)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.created_at), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                      {activity.title && (
                        <p className="text-sm font-medium">{activity.title}</p>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {activity.description}
                      </p>
                      {activity.value && activity.value > 0 && (
                        <p className="text-sm font-semibold text-green-600 mt-1">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(activity.value / 100)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhuma atividade registrada ainda
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
