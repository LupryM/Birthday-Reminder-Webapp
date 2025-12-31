"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Check, X, Plus, Copy, Search, UserPlus, LinkIcon } from "lucide-react";
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
    const { data } = await supabase.from("friendships").select("*").or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);
    if (data) {
      setFriends(data.filter((f) => f.status === "accepted"));
      setPendingRequests(data.filter((f) => f.status === "pending" && f.recipient_id === userId));
    }
  };

  useEffect(() => {
    fetchFriendships();
    const link = `${typeof window !== "undefined" ? window.location.origin : ""}/auth/sign-up?invite=${userId}`;
    setInviteLink(link);
  }, [userId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail) return;
    setIsSearching(true);
    const supabase = createClient();
    const { data } = await supabase.from("profiles").select("*").ilike("email", `%${searchEmail}%`).limit(5);
    setSearchResults(data || []);
    setIsSearching(false);
  };

  const handleSendRequest = async (recipientId: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("friendships").insert({ requester_id: userId, recipient_id: recipientId, status: "pending" });
    if (error) toast({ title: "Request failed", variant: "destructive" });
    else { toast({ title: "Request Sent" }); setSearchResults([]); setSearchEmail(""); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-entrance">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <Users className="h-10 w-10 text-primary" /> The Circle
          </h1>
          <p className="text-muted-foreground font-bold text-lg mt-1">Connect with friends to swap gift ideas.</p>
        </div>
        
        <div className="glass p-3 rounded-2xl border-primary/20 flex items-center gap-4">
          <div className="bg-primary/10 p-2 rounded-xl">
            <LinkIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Your Invite Link</p>
            <div className="flex gap-2">
              <code className="text-xs bg-black/20 p-2 rounded-lg block truncate max-w-[150px]">{inviteLink}</code>
              <Button onClick={() => { navigator.clipboard.writeText(inviteLink); toast({ title: "Link Copied" }); }} size="sm" className="h-8 rounded-lg bg-primary">
                <Copy size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Search & Pending */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass border-white/5 rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-xl font-black">Expand Your Circle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    placeholder="Enter friend's email..."
                    className="h-14 pl-12 rounded-xl glass border-white/10"
                  />
                </div>
                <Button type="submit" disabled={isSearching} className="w-full h-12 rounded-xl bg-secondary hover:bg-primary transition-colors text-white font-bold">
                  {isSearching ? "Hunting..." : "Find Friend"}
                </Button>
              </form>

              {searchResults.length > 0 && (
                <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
                  {searchResults.map((profile) => (
                    <div key={profile.id} className="p-4 glass border-primary/10 rounded-2xl flex items-center justify-between group">
                      <div>
                        <p className="font-bold text-sm">{profile.display_name}</p>
                        <p className="text-[10px] text-muted-foreground">{profile.email}</p>
                      </div>
                      <Button size="sm" onClick={() => handleSendRequest(profile.id)} className="h-10 w-10 p-0 rounded-xl bg-primary">
                        <Plus />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {pendingRequests.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-accent flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full animate-ping" />
                Pending Inbound
              </h3>
              {pendingRequests.map((req) => (
                <div key={req.id} className="p-5 glass border-accent/20 rounded-[1.5rem] flex items-center justify-between">
                  <div>
                    <p className="font-black text-lg leading-none mb-1">{req.requester?.display_name}</p>
                    <p className="text-xs text-muted-foreground">{req.requester?.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" className="h-10 w-10 rounded-xl bg-accent" onClick={() => {/* Existing Logic */}}>
                      <Check size={18} />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl bg-white/5" onClick={() => {/* Existing Logic */}}>
                      <X size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Friends List */}
        <div className="lg:col-span-3">
          <Card className="glass border-white/5 rounded-[2.5rem] min-h-[400px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-black">All Friends ({friends.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {friends.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <UserPlus size={48} className="opacity-10 mb-4" />
                  <p className="font-bold">The circle is empty.</p>
                  <p className="text-xs italic">Use the search to find your friends.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {friends.map((friend) => {
                    const profile = friend.requester_id === userId ? friend.recipient : friend.requester;
                    return (
                      <div key={friend.id} className="p-5 glass border-white/5 rounded-2xl hover:border-primary/20 transition-all group flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center font-black text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          {profile?.display_name?.slice(0,1).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black truncate">{profile?.display_name}</p>
                          <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}