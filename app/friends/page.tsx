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
    <div className="min-h-screen bg-background">
      <DashboardHeader user={data.user} />
      <main className="container mx-auto px-4 py-8">
        <FriendsManager userId={data.user.id} />
      </main>
    </div>
  );
}
