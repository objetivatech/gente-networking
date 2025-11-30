import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Users, UserPlus } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { CreateGroupModal } from "@/components/modals/CreateGroupModal";
import { useState } from "react";

export default function Groups() {
  const { user } = useAuth();
  const { data: groups, isLoading } = trpc.groups.getAll.useQuery();
  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              Grupos
            </h1>
            <p className="text-muted-foreground">
              Grupos de networking da comunidade GENTE
            </p>
          </div>
          {user?.role === 'admin' && (
            <Button onClick={() => setCreateGroupModalOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Grupo
            </Button>
          )}
        </div>
        
        <CreateGroupModal 
          open={createGroupModalOpen} 
          onOpenChange={setCreateGroupModalOpen} 
        />

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        ) : groups && groups.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    {group.name}
                  </CardTitle>
                  <CardDescription>
                    {group.description || 'Grupo de networking'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        group.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {group.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <Button variant="outline" className="w-full">
                      Ver Membros
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhum grupo cadastrado ainda
              </p>
              {user?.role === 'admin' && (
                <Button className="mt-4" onClick={() => setCreateGroupModalOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Primeiro Grupo
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
