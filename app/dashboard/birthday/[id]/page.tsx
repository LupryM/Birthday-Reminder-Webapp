import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { BirthdayDetail } from "@/components/birthday-detail"

export default async function BirthdayDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { id } = await params

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch birthday details
  const { data: birthday } = await supabase
    .from("birthdays")
    .select("*")
    .eq("id", id)
    .eq("user_id", data.user.id)
    .single()

  if (!birthday) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50">
      <DashboardHeader user={data.user} />
      <main className="container mx-auto px-4 py-8">
        <BirthdayDetail birthday={birthday} userId={data.user.id} />
      </main>
    </div>
  )
}
