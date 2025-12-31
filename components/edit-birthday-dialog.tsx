"use client";

import type React from "react";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Birthday {
  id: string;
  person_name: string;
  birth_date: string;
  relationship: string | null;
  notes: string | null;
}

interface EditBirthdayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  birthday: Birthday;
  onSuccess: () => void;
}

export function EditBirthdayDialog({
  open,
  onOpenChange,
  birthday,
  onSuccess,
}: EditBirthdayDialogProps) {
  const [personName, setPersonName] = useState(birthday.person_name);
  const [birthDate, setBirthDate] = useState(birthday.birth_date);
  const [relationship, setRelationship] = useState(birthday.relationship || "");
  const [notes, setNotes] = useState(birthday.notes || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("birthdays")
        .update({
          person_name: personName,
          birth_date: birthDate,
          relationship: relationship || null,
          notes: notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", birthday.id);

      if (error) throw error;

      setIsLoading(false);
      onOpenChange(false);
      onSuccess();
      toast({ title: "Birthday updated successfully!" });
    } catch (error) {
      toast({ title: "Error updating birthday", variant: "destructive" });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Birthday</DialogTitle>
          <DialogDescription>
            Update the birthday information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-person-name">Name</Label>
            <Input
              id="edit-person-name"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-birth-date">Birth Date</Label>
            <Input
              id="edit-birth-date"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-relationship">Relationship (Optional)</Label>
            <Input
              id="edit-relationship"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="edit-notes">Notes (Optional)</Label>
            <Textarea
              id="edit-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
