import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Activity, Filter, Search, TrendingUp, Users, Briefcase, Coffee, Star } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

const activityIcons = {
  referral: Users,
  business: Briefcase,
  meeting: Coffee,
  testimonial: Star,
};

const activityLabels = {
  referral: "Indicação",
  business: "Negócio",
  meeting: "Reunião 1 a 1",
  testimonial: "Depoimento",
};

const activityColors = {
  referral: "text-blue-600 bg-blue-100",
  business: "text-green-600 bg-green-100",
  meeting: "text-purple-600 bg-purple-100",
  testimonial: "text-yellow-600 bg-yellow-100",
};

export default function Activities() {
  const { user, isAuthenticated } = useAuth();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: activities, isLoading } = trpc.activities.getRecent.useQuery(
    { limit: 100 },
    { enabled: isAuthenticated }
  );

  const { data: users } = trpc.users.getAll.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Filter activities
  const filteredActivities = activities?.filter((activity) => {
    // Type filter
    if (typeFilter !== "all" && activity.type !== typeFilter) {
      return false;
    }

    // Search filter (description or user name)
    if (searchTerm) {
      const fromUser = users?.find(u => u.id === activity.from_user_id);
      const toUser = activity.to_user_id ? users?.find(u => u.id === activity.to_user_id) : null;
      
      const searchLower = searchTerm.toLowerCase();
      const matchesDescription = activity.description?.toLowerCase().includes(searchLower);
      const matchesFromUser = fromUser?.name?.toLowerCase().includes(searchLower);
      const matchesToUser = toUser?.name?.toLowerCase().includes(searchLower);
      
      if (!matchesDescription && !matchesFromUser && !matchesToUser) {
        return false;
      }
    }

    // Date range filter
    if (startDate) {
      const activityDate = new Date(activity.activity_date);
      const filterStart = new Date(startDate);
      if (activityDate < filterStart) {
        return false;
      }
    }

    if (endDate) {
      const activityDate = new Date(activity.activity_date);
      const filterEnd = new Date(endDate);
      filterEnd.setHours(23, 59, 59, 999); // End of day
      if (activityDate > filterEnd) {
        return false;
      }
    }

    return true;
  });

  const formatValue = (value: number | null) => {
    if (!value) return null;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              Atividades
            </h1>
            <p className="text-muted-foreground">
              Histórico completo de atividades da comunidade
            </p>
          </div>
          <Button onClick={() => window.location.href = "/activities/new"}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Nova Atividade
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
            <CardDescription>
              Filtre as atividades por tipo, período ou busca
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Atividade</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="referral">Indicações</SelectItem>
                    <SelectItem value="business">Negócios</SelectItem>
                    <SelectItem value="meeting">Reuniões 1 a 1</SelectItem>
                    <SelectItem value="testimonial">Depoimentos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Nome ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Data Inicial</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Data Final</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {(typeFilter !== "all" || searchTerm || startDate || endDate) && (
              <div className="mt-4 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTypeFilter("all");
                    setSearchTerm("");
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  Limpar Filtros
                </Button>
                <span className="text-sm text-muted-foreground">
                  {filteredActivities?.length || 0} atividade(s) encontrada(s)
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activities List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-16 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredActivities && filteredActivities.length > 0 ? (
          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const Icon = activityIcons[activity.type as keyof typeof activityIcons];
              const label = activityLabels[activity.type as keyof typeof activityLabels];
              const colorClass = activityColors[activity.type as keyof typeof activityColors];
              const fromUser = users?.find(u => u.id === activity.from_user_id);
              const toUser = activity.to_user_id ? users?.find(u => u.id === activity.to_user_id) : null;

              return (
                <Card key={activity.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{label}</CardTitle>
                          <CardDescription className="mt-1">
                            <span className="font-medium">{fromUser?.name || 'Usuário'}</span>
                            {toUser && (
                              <>
                                {' → '}
                                <span className="font-medium">{toUser.name}</span>
                              </>
                            )}
                            {' · '}
                            {format(new Date(activity.activity_date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                              locale: ptBR,
                            })}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-semibold text-primary">
                          {activity.points} pontos
                        </span>
                        {activity.value && (
                          <span className="text-sm font-medium text-green-600">
                            {formatValue(activity.value)}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {activity.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {typeFilter !== "all" || searchTerm || startDate || endDate
                  ? "Nenhuma atividade encontrada com os filtros aplicados"
                  : "Nenhuma atividade registrada ainda"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
