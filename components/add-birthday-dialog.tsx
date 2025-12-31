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

interface AddBirthdayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onSuccess: () => void;
}

export function AddBirthdayDialog({
  open,
  onOpenChange,
  userId,
  onSuccess,
}: AddBirthdayDialogProps) {
  const [personName, setPersonName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [relationship, setRelationship] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("birthdays").insert({
        user_id: userId,
        person_name: personName,
        birth_date: birthDate,
        relationship: relationship || null,
        notes: notes || null,
      });

      if (error) throw error;

      setIsLoading(false);
      setPersonName("");
      setBirthDate("");
      setRelationship("");
      setNotes("");
      onOpenChange(false);
      onSuccess();
      toast({ title: "Birthday added successfully!" });
    } catch (error) {
      toast({ title: "Error adding birthday", variant: "destructive" });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Birthday</DialogTitle>
          <DialogDescription>
            Add a new birthday to track and never miss a celebration.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="person-name">Name</Label>
            <Input
              id="person-name"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <Label htmlFor="birth-date">Birth Date</Label>
            <Input
              id="birth-date"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="relationship">Relationship (Optional)</Label>
            <Input
              id="relationship"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="Friend, Family, Colleague..."
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
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
              {isLoading ? "Adding..." : "Add Birthday"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
