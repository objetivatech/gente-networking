import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function NewActivity() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  
  // Get type from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const typeFromUrl = urlParams.get('type') as 'referral' | 'business' | 'meeting' | 'testimonial' | null;
  
  const [type, setType] = useState<'referral' | 'business' | 'meeting' | 'testimonial'>(
    typeFromUrl || 'referral'
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [toUserId, setToUserId] = useState('');
  
  const { data: users } = trpc.users.getAll.useQuery();
  
  const createMutation = trpc.activities.create.useMutation({
    onSuccess: () => {
      toast.success('Atividade registrada com sucesso!');
      utils.activities.getRecent.invalidate();
      utils.gamification.getLeaderboard.invalidate();
      utils.gamification.getUserScore.invalidate();
      setLocation('/');
    },
    onError: (error) => {
      toast.error('Erro ao registrar atividade: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast.error('Por favor, preencha a descrição');
      return;
    }
    
    const points = type === 'referral' ? 10 : type === 'business' ? 20 : type === 'meeting' ? 15 : 5;
    
    createMutation.mutate({
      type,
      title: title.trim() || undefined,
      description: description.trim(),
      value: value ? Math.round(parseFloat(value) * 100) : undefined,
      toUserId: toUserId ? parseInt(toUserId) : undefined,
      points,
      activityDate: new Date(),
    });
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'referral':
        return 'Indicação de Contato';
      case 'business':
        return 'Novo Negócio';
      case 'meeting':
        return 'Reunião 1 a 1 (Gente em Ação)';
      case 'testimonial':
        return 'Depoimento/Agradecimento';
    }
  };

  const getTypeDescription = () => {
    switch (type) {
      case 'referral':
        return 'Registre uma indicação de contato que você fez para outro membro';
      case 'business':
        return 'Registre um negócio fechado através da rede GENTE';
      case 'meeting':
        return 'Registre uma reunião 1 a 1 com outro membro (Gente em Ação)';
      case 'testimonial':
        return 'Deixe um depoimento ou agradecimento para outro membro';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Atividade</h1>
          <p className="text-muted-foreground">
            Registre suas atividades na comunidade GENTE
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{getTypeLabel()}</CardTitle>
            <CardDescription>{getTypeDescription()}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Atividade</Label>
                <Select value={type} onValueChange={(v) => setType(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="referral">🤝 Indicação de Contato</SelectItem>
                    <SelectItem value="business">💼 Novo Negócio</SelectItem>
                    <SelectItem value="meeting">☕ Reunião 1 a 1</SelectItem>
                    <SelectItem value="testimonial">⭐ Depoimento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(type === 'referral' || type === 'business' || type === 'meeting' || type === 'testimonial') && (
                <div className="space-y-2">
                  <Label htmlFor="toUser">Membro Relacionado</Label>
                  <Select value={toUserId} onValueChange={setToUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um membro" />
                    </SelectTrigger>
                    <SelectContent>
                      {users?.filter(u => u.id !== user?.id).map((u) => (
                        <SelectItem key={u.id} value={u.id.toString()}>
                          {u.name || u.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {type === 'referral' && 'Para quem você fez a indicação'}
                    {type === 'business' && 'Com quem você fechou o negócio'}
                    {type === 'meeting' && 'Com quem você se reuniu'}
                    {type === 'testimonial' && 'Para quem é o depoimento'}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Título (Opcional)</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Indicação para consultoria"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva a atividade realizada..."
                  rows={4}
                  required
                />
              </div>

              {type === 'business' && (
                <div className="space-y-2">
                  <Label htmlFor="value">Valor do Negócio (R$)</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    min="0"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="0,00"
                  />
                  <p className="text-xs text-muted-foreground">
                    Valor aproximado do negócio realizado
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1"
                >
                  {createMutation.isPending ? 'Registrando...' : 'Registrar Atividade'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation('/')}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
