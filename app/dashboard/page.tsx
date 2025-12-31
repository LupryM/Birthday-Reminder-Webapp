import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard-header";
import { TodayBirthdays } from "@/components/today-birthdays";
import { UpcomingBirthdays } from "@/components/upcoming-birthdays";
import { BirthdayList } from "@/components/birthday-list";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 pb-20">
      <DashboardHeader user={data.user} />
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-6">
          <TodayBirthdays userId={data.user.id} />
          <UpcomingBirthdays userId={data.user.id} />
          <BirthdayList userId={data.user.id} />
        </div>
      </main>
    </div>
  );
}
