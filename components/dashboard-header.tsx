"use client";

import { Button } from "@/components/ui/button";
import { Gift, Users, User, LogOut } from "lucide-react";
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
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-6xl z-50">
      <div className="glass-pill h-20 px-10 flex items-center justify-between border-white/5">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <Gift className="h-6 w-6 text-foreground group-hover:rotate-12 transition-transform" />
          <h1 className="text-lg font-bold tracking-tighter hidden sm:block">
            Buddy
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-2 mr-4 border-r border-white/10 pr-6">
            <Link href="/friends">
              <Button
                variant="ghost"
                size="sm"
                className="btn-pill h-10 px-4 hover:bg-white/5"
              >
                <Users size={18} />
                <span className="hidden md:inline ml-2">Friends</span>
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="btn-pill h-10 px-4 hover:bg-white/5"
              >
                <User size={18} />
                <span className="hidden md:inline ml-2">Profile</span>
              </Button>
            </Link>
          </nav>

          <Button
            onClick={handleSignOut}
            size="sm"
            variant="ghost"
            className="btn-pill h-10 w-10 p-0 text-muted-foreground hover:text-white hover:bg-white/5"
          >
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
}
