import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Calendar, MapPin, Plus, Users } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Meetings() {
  const { user } = useAuth();
  const { data: meetings, isLoading } = trpc.meetings.getAll.useQuery();

  const canCreateMeeting = user?.role === 'admin' || user?.role === 'facilitator';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Calendar className="h-8 w-8 text-primary" />
              Encontros
            </h1>
            <p className="text-muted-foreground">
              Reuniões e eventos da comunidade GENTE
            </p>
          </div>
          {canCreateMeeting && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Encontro
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : meetings && meetings.length > 0 ? (
          <div className="space-y-4">
            {meetings.map((meeting) => {
              const meetingDate = new Date(meeting.meeting_date);
              const isPast = meetingDate < new Date();
              
              return (
                <Card key={meeting.id} className={`hover:shadow-lg transition-shadow ${
                  meeting.is_completed ? 'opacity-75' : ''
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {meeting.title}
                          {meeting.is_completed && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-normal">
                              Realizado
                            </span>
                          )}
                          {!meeting.is_completed && isPast && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-normal">
                              Pendente
                            </span>
                          )}
                          {!meeting.is_completed && !isPast && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-normal">
                              Agendado
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {meeting.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(meetingDate, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                        {meeting.location && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{meeting.location}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4 mr-2" />
                          Ver Convidados
                        </Button>
                        {canCreateMeeting && !meeting.is_completed && (
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhum encontro agendado
              </p>
              {canCreateMeeting && (
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Agendar Primeiro Encontro
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
