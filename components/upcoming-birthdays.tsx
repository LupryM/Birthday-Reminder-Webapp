"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { format, isThisMonth, isToday, isTomorrow, addDays } from "date-fns";
import Link from "next/link";

interface Birthday {
  id: string;
  person_name: string;
  birth_date: string;
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

            if (thisYearBirthday < today) {
              thisYearBirthday.setFullYear(today.getFullYear() + 1);
            }

            return {
              ...b,
              nextBirthday: thisYearBirthday,
            };
          })
          .filter((b) => b.nextBirthday <= addDays(today, 30))
          .sort((a, b) => a.nextBirthday.getTime() - b.nextBirthday.getTime());

        setUpcomingBirthdays(upcoming);
      }
    };

    fetchUpcoming();
  }, [userId]);

  const getTimeLabel = (dateStr: string) => {
    const birthDate = new Date(dateStr);
    const today = new Date();
    const thisYearBirthday = new Date(
      today.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );

    if (isToday(thisYearBirthday)) return "Today!";
    if (isTomorrow(thisYearBirthday)) return "Tomorrow";
    if (isThisMonth(thisYearBirthday))
      return format(thisYearBirthday, "MMMM d");
    return format(thisYearBirthday, "MMMM d");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Calendar className="h-6 w-6 text-accent" />
          Looking Ahead (30 days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingBirthdays.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming birthdays in the next 30 days
          </p>
        ) : (
          <div className="space-y-2">
            {upcomingBirthdays.map((birthday) => (
              <Link
                key={birthday.id}
                href={`/dashboard/birthday/${birthday.id}`}
              >
                <div className="p-3 bg-secondary rounded-lg border border-border hover:bg-secondary/80 transition-colors cursor-pointer">
                  <p className="font-medium text-foreground">
                    {birthday.person_name}
                  </p>
                  <p className="text-sm text-accent">
                    {getTimeLabel(birthday.birth_date)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
