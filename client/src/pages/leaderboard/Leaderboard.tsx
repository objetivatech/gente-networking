import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Trophy, TrendingUp } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Leaderboard() {
  const { user } = useAuth();
  const { data: leaderboard, isLoading } = trpc.gamification.getLeaderboard.useQuery({ limit: 50 });

  const getCurrentMonth = () => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-8 w-8 text-secondary" />
            Ranking da Comunidade
          </h1>
          <p className="text-muted-foreground">
            Membros mais ativos de {getCurrentMonth()}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Membros</CardTitle>
            <CardDescription>
              Classificação baseada em pontos acumulados no mês atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : leaderboard && leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.map((member, index) => {
                  const isCurrentUser = member.userId === user?.id;
                  const isTop3 = index < 3;
                  
                  return (
                    <div
                      key={member.userId}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                        isCurrentUser ? 'bg-primary/5 border-primary' : 'hover:bg-accent/50'
                      }`}
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full font-bold text-lg ${
                          index === 0
                            ? 'bg-yellow-500 text-white'
                            : index === 1
                            ? 'bg-gray-400 text-white'
                            : index === 2
                            ? 'bg-orange-600 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-base font-semibold truncate">
                            {member.userName}
                          </p>
                          {isCurrentUser && (
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                              Você
                            </span>
                          )}
                          {isTop3 && (
                            <Trophy className={`h-4 w-4 ${
                              index === 0 ? 'text-yellow-500' :
                              index === 1 ? 'text-gray-400' :
                              'text-orange-600'
                            }`} />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>
                            🤝 {member.referral_count} indicações
                          </span>
                          <span>
                            💼 {member.business_count} negócios
                          </span>
                          <span>
                            ☕ {member.meeting_count} reuniões
                          </span>
                          <span>
                            ⭐ {member.testimonial_count} depoimentos
                          </span>
                        </div>

                        {member.total_business_value > 0 && (
                          <p className="text-sm font-semibold text-green-600 mt-1">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(member.total_business_value / 100)}
                            {' '}em negócios
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {member.total_points}
                        </p>
                        <p className="text-xs text-muted-foreground">pontos</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhum dado disponível para este mês
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sistema de Pontuação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🤝</span>
                <div>
                  <p className="font-semibold">Indicação de Contato</p>
                  <p className="text-sm text-muted-foreground">10 pontos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">💼</span>
                <div>
                  <p className="font-semibold">Novo Negócio</p>
                  <p className="text-sm text-muted-foreground">20 pontos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">☕</span>
                <div>
                  <p className="font-semibold">Reunião 1 a 1</p>
                  <p className="text-sm text-muted-foreground">15 pontos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <p className="font-semibold">Depoimento</p>
                  <p className="text-sm text-muted-foreground">5 pontos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
