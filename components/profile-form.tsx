"use client";

import type React from "react";
import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { UserCircle, Camera, Save, Fingerprint } from "lucide-react";

interface Profile {
  id: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  bio?: string;
}

export function ProfileForm({
  user,
  profile,
}: {
  user: User;
  profile: Profile | null;
}) {
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    const supabase = createClient();
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      setAvatarUrl(data.publicUrl);
      toast({ title: "Avatar updated" });
    } catch (error) {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          avatar_url: avatarUrl,
          bio: bio,
        })
        .eq("id", user.id);
      if (error) throw error;
      toast({
        title: "Profile Secured",
        description: "Your changes are now live.",
      });
    } catch (error) {
      toast({ title: "Update failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-entrance">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-2xl">
          <UserCircle className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight">Profile Hub</h1>
          <p className="text-muted-foreground font-bold">
            Customize how friends see you in the circle.
          </p>
        </div>
      </div>

      <Card className="glass border-white/5 rounded-[2rem] overflow-hidden">
        <CardContent className="p-10 space-y-10">
          {/* Enhanced Avatar Section */}
          <div className="flex flex-col items-center gap-6 pb-8 border-b border-white/5">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-primary shadow-2xl transition-transform group-hover:scale-105">
                <AvatarImage
                  src={avatarUrl || "/placeholder.svg"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/20 text-primary text-4xl font-black">
                  {displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-primary text-white p-3 rounded-xl shadow-lg hover:scale-110 active:scale-90 transition-all border-4 border-background"
              >
                <Camera size={20} />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest ml-1 text-primary">
                  Public Alias
                </Label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="The Birthday King"
                  className="h-14 rounded-xl glass border-white/10 font-bold"
                />
              </div>

              <div className="space-y-2 opacity-60">
                <Label className="text-xs font-black uppercase tracking-widest ml-1 flex items-center gap-1">
                  <Fingerprint size={12} /> Account ID (Email)
                </Label>
                <Input
                  value={user.email}
                  disabled
                  className="h-14 rounded-xl bg-transparent border-white/5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest ml-1 text-primary">
                Your Bio
              </Label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Obsessed with chocolate cake and retro gadgets..."
                className="min-h-[148px] rounded-xl glass border-white/10 p-4 font-bold"
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full h-16 rounded-2xl bg-primary text-white font-black text-xl btn-hover shadow-xl shadow-primary/20"
          >
            {isLoading ? (
              "Synchronizing..."
            ) : (
              <>
                <Save className="mr-2" /> Commit Changes
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
