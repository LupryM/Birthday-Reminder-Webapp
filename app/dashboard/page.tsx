import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard-header";
import { TodayBirthdays } from "@/components/today-birthdays";
import { UpcomingBirthdays } from "@/components/upcoming-birthdays";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={data.user} />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <TodayBirthdays userId={data.user.id} />
          <UpcomingBirthdays userId={data.user.id} />
        </div>
      </main>
    </div>
  );
}
