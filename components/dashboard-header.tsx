"use client";

import { Button } from "@/components/ui/button";
import { Gift, Users, User } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function DashboardHeader({ user }: { user: SupabaseUser }) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Gift className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              Birthday Buddy
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/friends">
              <Button variant="ghost" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Friends
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Button variant="outline" onClick={handleSignOut} size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
