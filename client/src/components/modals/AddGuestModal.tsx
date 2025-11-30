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
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AddGuestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meetingId?: number;
}

export function AddGuestModal({ open, onOpenChange, meetingId }: AddGuestModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");

  const utils = trpc.useUtils();
  
  const createGuest = trpc.guests.create.useMutation({
    onSuccess: () => {
      toast.success("Convidado adicionado com sucesso!");
      // Invalidate queries to refresh data
      utils.guests.invalidate();
      utils.meetings.invalidate();
      onOpenChange(false);
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setNotes("");
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar convidado: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    const payload: {
      name: string;
      email?: string;
      phone?: string;
      company?: string;
      notes?: string;
      meetingId?: number;
    } = {
      name: name.trim(),
    };
    
    if (email.trim()) payload.email = email.trim();
    if (phone.trim()) payload.phone = phone.trim();
    if (company.trim()) payload.company = company.trim();
    if (notes.trim()) payload.notes = notes.trim();
    if (meetingId) payload.meetingId = meetingId;

    createGuest.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adicionar Convidado</DialogTitle>
            <DialogDescription>
              Adicione um novo convidado {meetingId ? "a este encontro" : "à lista de convidados"}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Nome Completo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ex: João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={createGuest.isPending}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="joao@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={createGuest.isPending}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={createGuest.isPending}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                placeholder="Nome da empresa"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={createGuest.isPending}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                placeholder="Informações adicionais sobre o convidado..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={createGuest.isPending}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createGuest.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createGuest.isPending}>
              {createGuest.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
