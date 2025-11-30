import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateMeetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMeetingModal({ open, onOpenChange }: CreateMeetingModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [location, setLocation] = useState("");
  const [groupId, setGroupId] = useState<string>("");

  const { data: groups } = trpc.groups.getAll.useQuery();
  const utils = trpc.useUtils();
  
  const createMeeting = trpc.meetings.create.useMutation({
    onSuccess: () => {
      toast.success("Encontro criado com sucesso!");
      utils.meetings.getAll.invalidate();
      onOpenChange(false);
      // Reset form
      setTitle("");
      setDescription("");
      setMeetingDate("");
      setMeetingTime("");
      setLocation("");
      setGroupId("");
    },
    onError: (error) => {
      toast.error(`Erro ao criar encontro: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Título é obrigatório");
      return;
    }
    
    if (!meetingDate || !meetingTime) {
      toast.error("Data e hora são obrigatórias");
      return;
    }
    
    if (!location.trim()) {
      toast.error("Local é obrigatório");
      return;
    }

    // Combine date and time
    const dateTimeString = `${meetingDate}T${meetingTime}:00`;
    const meetingDateTime = new Date(dateTimeString);

    const payload: {
      title: string;
      description?: string;
      meetingDate: Date;
      location: string;
      groupId?: number;
    } = {
      title: title.trim(),
      meetingDate: meetingDateTime,
      location: location.trim(),
    };
    
    if (description.trim()) {
      payload.description = description.trim();
    }
    
    if (groupId) {
      payload.groupId = parseInt(groupId);
    }

    createMeeting.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Novo Encontro</DialogTitle>
            <DialogDescription>
              Agende um novo encontro para a comunidade. Você poderá adicionar convidados depois.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid gap-2">
              <Label htmlFor="title">
                Título <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Ex: Encontro Mensal - Janeiro 2025"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={createMeeting.isPending}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva a agenda e objetivos do encontro..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={createMeeting.isPending}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="meetingDate">
                  Data <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="meetingDate"
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  disabled={createMeeting.isPending}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="meetingTime">
                  Hora <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="meetingTime"
                  type="time"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  disabled={createMeeting.isPending}
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">
                Local <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                placeholder="Endereço completo ou link online"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={createMeeting.isPending}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="group">Grupo (opcional)</Label>
              <Select
                value={groupId}
                onValueChange={setGroupId}
                disabled={createMeeting.isPending}
              >
                <SelectTrigger id="group">
                  <SelectValue placeholder="Selecione um grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum grupo</SelectItem>
                  {groups?.map((group) => (
                    <SelectItem key={group.id} value={group.id.toString()}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMeeting.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createMeeting.isPending}>
              {createMeeting.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar Encontro
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
