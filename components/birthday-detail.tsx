"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ShoppingBag,
  Check,
  LinkIcon,
  User,
} from "lucide-react";
import Link from "next/link";
import { format, differenceInYears } from "date-fns";
import { AddGiftDialog } from "@/components/add-gift-dialog";
import { useToast } from "@/hooks/use-toast";

interface Birthday {
  id: string;
  person_name: string;
  birth_date: string;
  relationship: string | null;
  notes: string | null;
  user_id: string;
}

interface GiftIdea {
  id: string;
  gift_name: string;
  gift_url: string | null;
  price_range: string | null;
  priority: string | null;
  is_purchased: boolean;
  notes: string | null;
  claimed_by_user_id: string | null;
  claimed_by_name?: string;
}

export function BirthdayDetail({
  birthday,
  userId,
}: {
  birthday: Birthday;
  userId: string;
}) {
  const [gifts, setGifts] = useState<GiftIdea[]>([]);
  const [showAddGift, setShowAddGift] = useState(false);
  const [claimingGiftId, setClaimingGiftId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchGifts = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("gift_ideas")
      .select("*")
      .eq("birthday_id", birthday.id)
      .order("priority", { ascending: false });

    if (data) {
      const giftsWithNames = await Promise.all(
        data.map(async (gift) => {
          if (gift.claimed_by_user_id) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("display_name")
              .eq("id", gift.claimed_by_user_id)
              .single();
            return {
              ...gift,
              claimed_by_name: profile?.display_name || "Someone",
            };
          }
          return gift;
        })
      );
      setGifts(giftsWithNames);
    }
  };

  useEffect(() => {
    fetchGifts();
  }, [birthday.id]);

  const handleDeleteGift = async (id: string) => {
    const supabase = createClient();
    await supabase.from("gift_ideas").delete().eq("id", id);
    fetchGifts();
    toast({ title: "Gift deleted" });
  };

  const handleTogglePurchased = async (id: string, isPurchased: boolean) => {
    const supabase = createClient();
    await supabase
      .from("gift_ideas")
      .update({ is_purchased: !isPurchased })
      .eq("id", id);
    fetchGifts();
  };

  const handleToggleClaim = async (giftId: string, currentClaimed: boolean) => {
    setClaimingGiftId(giftId);
    try {
      const supabase = createClient();
      if (currentClaimed) {
        // Unclaim gift
        await supabase
          .from("gift_ideas")
          .update({ claimed_by_user_id: null })
          .eq("id", giftId);
        toast({ title: "You've unclaimed this gift" });
      } else {
        // Claim gift
        await supabase
          .from("gift_ideas")
          .update({ claimed_by_user_id: userId })
          .eq("id", giftId);
        toast({ title: "You've claimed this gift!" });
      }
      fetchGifts();
    } catch (error) {
      toast({ title: "Error updating gift", variant: "destructive" });
    } finally {
      setClaimingGiftId(null);
    }
  };

  const calculateAge = (birthDate: string) => {
    return differenceInYears(new Date(), new Date(birthDate));
  };

  const getPriorityBadge = (priority: string | null) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-accent text-accent-foreground";
      case "low":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const isOwnBirthday = birthday.user_id === userId;

  return (
    <>
      <div className="space-y-6">
        <div>
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{birthday.person_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground">
                <strong>Birthday:</strong>{" "}
                {format(new Date(birthday.birth_date), "MMMM d, yyyy")} (
                {calculateAge(birthday.birth_date)} years old)
              </p>
              {birthday.relationship && (
                <p className="text-muted-foreground">
                  <strong>Relationship:</strong> {birthday.relationship}
                </p>
              )}
              {birthday.notes && (
                <p className="text-muted-foreground">
                  <strong>Notes:</strong> {birthday.notes}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-primary" />
                Gift Wishlist
              </CardTitle>
              {isOwnBirthday && (
                <Button onClick={() => setShowAddGift(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Gift
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {gifts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  {isOwnBirthday
                    ? "No gift ideas yet. Add one to get started!"
                    : "No gift ideas yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {gifts.map((gift) => {
                  const isClaimedByMe = gift.claimed_by_user_id === userId;
                  const isClaimed = gift.claimed_by_user_id !== null;
                  return (
                    <div
                      key={gift.id}
                      className={`p-4 border border-border rounded-lg transition-colors ${
                        gift.is_purchased
                          ? "bg-secondary/30"
                          : "hover:bg-card/80"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3
                              className={`font-semibold text-lg ${
                                gift.is_purchased
                                  ? "line-through text-muted-foreground"
                                  : ""
                              }`}
                            >
                              {gift.gift_name}
                            </h3>
                            {gift.priority && (
                              <span
                                className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityBadge(
                                  gift.priority
                                )}`}
                              >
                                {gift.priority.charAt(0).toUpperCase() +
                                  gift.priority.slice(1)}
                              </span>
                            )}
                            {gift.is_purchased && (
                              <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">
                                Purchased
                              </span>
                            )}
                          </div>
                          {isClaimed && (
                            <div className="flex items-center gap-1 mb-2 text-sm text-primary font-medium">
                              <User className="h-4 w-4" />
                              {gift.claimed_by_name} will get this
                            </div>
                          )}
                          {gift.price_range && (
                            <p className="text-sm text-muted-foreground mb-1">
                              ${gift.price_range}
                            </p>
                          )}
                          {gift.gift_url && (
                            <a
                              href={gift.gift_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-1"
                            >
                              <LinkIcon className="h-3 w-3" />
                              View Product
                            </a>
                          )}
                          {gift.notes && (
                            <p className="text-sm text-muted-foreground mt-1 italic">
                              {gift.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          {!isOwnBirthday && (
                            <Button
                              size="icon"
                              variant={isClaimedByMe ? "default" : "outline"}
                              onClick={() =>
                                handleToggleClaim(gift.id, isClaimedByMe)
                              }
                              disabled={claimingGiftId === gift.id}
                              className={isClaimedByMe ? "" : ""}
                              title={
                                isClaimedByMe
                                  ? "I'm not getting this anymore"
                                  : "I'll get this gift"
                              }
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          {isOwnBirthday && (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                  handleTogglePurchased(
                                    gift.id,
                                    gift.is_purchased
                                  )
                                }
                                className={
                                  gift.is_purchased
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }
                                title={
                                  gift.is_purchased
                                    ? "Mark as not purchased"
                                    : "Mark as purchased"
                                }
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDeleteGift(gift.id)}
                                className="text-destructive hover:text-destructive"
                                title="Delete this gift"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isOwnBirthday && (
        <AddGiftDialog
          open={showAddGift}
          onOpenChange={setShowAddGift}
          birthdayId={birthday.id}
          onSuccess={fetchGifts}
        />
      )}
    </>
  );
}
