"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Gift, Cake } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface Birthday {
  id: string;
  person_name: string;
  birth_date: string;
  relationship: string | null;
}

export function TodayBirthdays({ userId }: { userId: string }) {
  const [todayBirthdays, setTodayBirthdays] = useState<Birthday[]>([]);

  useEffect(() => {
    const fetchToday = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("birthdays")
        .select("id, person_name, birth_date, relationship")
        .eq("user_id", userId);
      if (data) {
        const todayStr = format(new Date(), "MM-dd");
        const birthdays = data.filter(
          (b) => format(new Date(b.birth_date), "MM-dd") === todayStr
        );
        setTodayBirthdays(birthdays);
      }
    };
    fetchToday();
  }, [userId]);

  if (todayBirthdays.length === 0) return null;

  return (
    <div className="space-y-6 animate-entrance">
      <div className="px-8">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
          Happening Today
        </h2>
      </div>

      {todayBirthdays.map((birthday) => (
        <div
          key={birthday.id}
          className="glass-pill p-6 md:p-8 relative overflow-hidden group"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-8">
              <div className="h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all duration-700">
                <Cake className="h-10 w-10 text-foreground" />
              </div>
              <div>
                <h3 className="text-3xl font-bold tracking-tighter text-foreground">
                  {birthday.person_name}
                </h3>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">
                  {birthday.relationship || "Special Someone"}
                </p>
              </div>
            </div>

            <Link
              href={`/dashboard/birthday/${birthday.id}`}
              className="w-full md:w-auto"
            >
              <Button className="btn-pill w-full md:w-auto bg-white text-black hover:bg-white/90 shadow-2xl shadow-white/5 flex items-center gap-3">
                <Gift className="h-5 w-5" />
                <span>View Wishlist</span>
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
