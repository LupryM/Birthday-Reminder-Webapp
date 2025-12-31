import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard-header";
import { FriendsManager } from "@/components/friends-manager";

export default async function FriendsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <DashboardHeader user={data.user} />

      {/* Immersive background decoration */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <main className="container mx-auto px-4 py-12 relative z-10">
        <FriendsManager userId={data.user.id} />
      </main>
    </div>
  );
}
