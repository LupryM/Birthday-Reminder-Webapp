"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        const today = new Date();
        const todayFormatted = format(today, "MM-dd");

        const birthdays = data.filter((b) => {
          const birthDate = new Date(b.birth_date);
          const birthFormatted = format(birthDate, "MM-dd");
          return birthFormatted === todayFormatted;
        });

        setTodayBirthdays(birthdays);
      }
    };

    fetchToday();
  }, [userId]);

  if (todayBirthdays.length === 0) {
    return (
      <Card className="border-2 border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-2">
            <Cake className="h-8 w-8 text-primary" />
            Today&apos;s Birthdays
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No birthdays today
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary bg-gradient-to-r from-primary/10 to-transparent">
      <CardHeader>
        <CardTitle className="text-3xl flex items-center gap-2">
          <Cake className="h-8 w-8 text-primary" />
          Today&apos;s Birthdays 🎉
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todayBirthdays.map((birthday) => (
            <div
              key={birthday.id}
              className="p-4 bg-white dark:bg-slate-900 border border-border rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg text-foreground">
                    {birthday.person_name}
                  </p>
                  {birthday.relationship && (
                    <p className="text-sm text-muted-foreground">
                      {birthday.relationship}
                    </p>
                  )}
                </div>
                <Link href={`/dashboard/birthday/${birthday.id}`}>
                  <Button className="gap-2">
                    <Gift className="h-4 w-4" />
                    View Gift Ideas
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
