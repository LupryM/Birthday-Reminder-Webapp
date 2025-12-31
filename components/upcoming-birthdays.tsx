"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChevronRight } from "lucide-react";
import { format, isToday, isTomorrow, addDays } from "date-fns";
import Link from "next/link";

interface Birthday {
  id: string;
  person_name: string;
  birth_date: string;
  nextBirthday: Date;
}

export function UpcomingBirthdays({ userId }: { userId: string }) {
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<Birthday[]>([]);

  useEffect(() => {
    const fetchUpcoming = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("birthdays")
        .select("id, person_name, birth_date")
        .eq("user_id", userId);

      if (data) {
        const today = new Date();
        const upcoming = data
          .map((b) => {
            const birthDate = new Date(b.birth_date);
            const thisYearBirthday = new Date(
              today.getFullYear(),
              birthDate.getMonth(),
              birthDate.getDate()
            );
            if (thisYearBirthday < today && !isToday(thisYearBirthday)) {
              thisYearBirthday.setFullYear(today.getFullYear() + 1);
            }
            return { ...b, nextBirthday: thisYearBirthday };
          })
          .filter((b) => b.nextBirthday <= addDays(today, 30))
          .sort((a, b) => a.nextBirthday.getTime() - b.nextBirthday.getTime());

        setUpcomingBirthdays(upcoming);
      }
    };
    fetchUpcoming();
  }, [userId]);

  const getTimeLabel = (date: Date) => {
    if (isToday(date))
      return <span className="text-primary font-black uppercase">Today!</span>;
    if (isTomorrow(date))
      return <span className="text-amber-500 font-bold">Tomorrow</span>;
    return (
      <span className="text-muted-foreground font-semibold">
        {format(date, "MMMM d")}
      </span>
    );
  };

  return (
    <Card className="glass border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-3">
          <Calendar className="h-5 w-5 text-primary" />
          Next 30 Days
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingBirthdays.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8 bg-background/20 rounded-2xl border border-dashed">
            Quiet month ahead. Relax!
          </p>
        ) : (
          <div className="grid gap-2">
            {upcomingBirthdays.map((birthday) => (
              <Link
                key={birthday.id}
                href={`/dashboard/birthday/${birthday.id}`}
                className="group"
              >
                <div className="p-4 bg-background/40 rounded-2xl border border-transparent group-hover:border-primary/20 group-hover:bg-background/80 transition-all flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="font-bold text-lg group-hover:text-primary transition-colors leading-tight">
                      {birthday.person_name}
                    </p>
                    <p className="text-sm">
                      {getTimeLabel(birthday.nextBirthday)}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
