"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Check, X, Plus, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Friendship {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: "pending" | "accepted" | "blocked";
  requester?: { display_name: string; email: string };
  recipient?: { display_name: string; email: string };
}

interface Profile {
  id: string;
  display_name: string;
  email: string;
}

export function FriendsManager({ userId }: { userId: string }) {
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friendship[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [inviteLink, setInviteLink] = useState("");
  const { toast } = useToast();

  const fetchFriendships = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("friendships")
      .select("*")
      .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);

    if (data) {
      const accepted = data.filter((f) => f.status === "accepted");
      const pending = data.filter(
        (f) => f.status === "pending" && f.recipient_id === userId
      );
      setFriends(accepted);
      setPendingRequests(pending);
    }
  };

  useEffect(() => {
    fetchFriendships();
    // Generate shareable invite link
    const link = `${
      typeof window !== "undefined" ? window.location.origin : ""
    }/auth/sign-up?invite=${userId}`;
    setInviteLink(link);
  }, [userId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail) return;

    setIsSearching(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .ilike("email", `%${searchEmail}%`)
      .limit(5);

    setSearchResults(data || []);
    setIsSearching(false);
  };

  const handleSendRequest = async (recipientId: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("friendships").insert({
      requester_id: userId,
      recipient_id: recipientId,
      status: "pending",
    });

    if (error) {
      toast({ title: "Error sending friend request", variant: "destructive" });
    } else {
      toast({ title: "Friend request sent!" });
      setSearchResults([]);
      setSearchEmail("");
    }
  };

  const handleAcceptRequest = async (friendshipId: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("id", friendshipId);

    if (!error) {
      toast({ title: "Friend request accepted!" });
      fetchFriendships();
    }
  };

  const handleRejectRequest = async (friendshipId: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("friendships")
      .delete()
      .eq("id", friendshipId);

    if (!error) {
      toast({ title: "Friend request declined" });
      fetchFriendships();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({ title: "Invite link copied to clipboard!" });
  };

  return (
    <div className="space-y-8">
      {/* Shareable Invite Link Section */}
      <Card>
        <CardHeader>
          <CardTitle>Share Your Invite Link</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Share this link with friends to add them quickly:
          </p>
          <div className="flex gap-2">
            <Input value={inviteLink} readOnly className="text-sm" />
            <Button onClick={handleCopyLink} size="sm" variant="outline">
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Friend */}
      <Card>
        <CardHeader>
          <CardTitle>Add Friend by Email</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Search by Email</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="friend@example.com"
                />
                <Button type="submit" disabled={isSearching}>
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2">
                {searchResults.map((profile) => (
                  <div
                    key={profile.id}
                    className="p-3 border border-border rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{profile.display_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.email}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSendRequest(profile.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Friend Requests ({pendingRequests.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="p-3 border border-border rounded-lg flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">
                    {request.requester?.display_name || "Unknown"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {request.requester?.email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRejectRequest(request.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Friends List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Friends ({friends.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {friends.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No friends yet. Add someone to get started!
            </p>
          ) : (
            <div className="space-y-3">
              {friends.map((friend) => {
                const friendProfile =
                  friend.requester_id === userId
                    ? friend.recipient
                    : friend.requester;
                return (
                  <div
                    key={friend.id}
                    className="p-3 border border-border rounded-lg"
                  >
                    <p className="font-medium">
                      {friendProfile?.display_name || "Unknown"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {friendProfile?.email}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
