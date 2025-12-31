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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AddGiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  birthdayId: string;
  onSuccess: () => void;
}

export function AddGiftDialog({
  open,
  onOpenChange,
  birthdayId,
  onSuccess,
}: AddGiftDialogProps) {
  const [giftName, setGiftName] = useState("");
  const [giftUrl, setGiftUrl] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [priority, setPriority] = useState("medium");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("gift_ideas").insert({
        birthday_id: birthdayId,
        gift_name: giftName,
        gift_url: giftUrl || null,
        price_range: priceRange || null,
        priority,
        notes: notes || null,
      });

      if (error) throw error;

      setIsLoading(false);
      setGiftName("");
      setGiftUrl("");
      setPriceRange("");
      setPriority("medium");
      setNotes("");
      onOpenChange(false);
      onSuccess();
      toast({ title: "Gift added successfully!" });
    } catch (error) {
      toast({ title: "Error adding gift", variant: "destructive" });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Gift Idea</DialogTitle>
          <DialogDescription>
            Add a gift idea to your wishlist for this person.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="gift-name">Gift Name</Label>
            <Input
              id="gift-name"
              value={giftName}
              onChange={(e) => setGiftName(e.target.value)}
              placeholder="Wireless Headphones"
              required
            />
          </div>
          <div>
            <Label htmlFor="gift-url">Product URL (Optional)</Label>
            <Input
              id="gift-url"
              type="url"
              value={giftUrl}
              onChange={(e) => setGiftUrl(e.target.value)}
              placeholder="https://example.com/product"
            />
          </div>
          <div>
            <Label htmlFor="price-range">Price Range (Optional)</Label>
            <Input
              id="price-range"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              placeholder="50-100"
            />
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="gift-notes">Notes (Optional)</Label>
            <Textarea
              id="gift-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional details about the gift..."
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
              {isLoading ? "Adding..." : "Add Gift Idea"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
