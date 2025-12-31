import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard-header";
import { ProfileForm } from "@/components/profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={data.user} />
      <main className="container mx-auto px-4 py-8">
        <ProfileForm user={data.user} profile={profile} />
      </main>
    </div>
  );
}
