"use client"

import type React from "react"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@supabase/supabase-js"
import { useToast } from "@/hooks/use-toast"

interface Profile {
  id: string
  display_name: string
  email: string
  avatar_url: string | null
  bio?: string
}

export function ProfileForm({ user, profile }: { user: User; profile: Profile | null }) {
  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    const supabase = createClient()

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName)
      setAvatarUrl(data.publicUrl)

      toast({ title: "Avatar uploaded successfully" })
    } catch (error) {
      toast({ title: "Error uploading avatar", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          avatar_url: avatarUrl,
          bio: bio,
        })
        .eq("id", user.id)

      if (error) throw error
      toast({ title: "Profile updated successfully" })
    } catch (error) {
      toast({ title: "Error updating profile", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl || "/placeholder.svg"} />
              <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex gap-2">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                {isLoading ? "Uploading..." : "Upload Avatar"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell your friends about yourself"
              className="min-h-32"
            />
          </div>

          <Button onClick={handleSave} disabled={isLoading} className="w-full">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
