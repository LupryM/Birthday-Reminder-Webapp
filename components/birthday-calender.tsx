"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

interface Birthday {
  id: string
  person_name: string
  birth_date: string
}

export function BirthdayCalendar({ userId }: { userId: string }) {
  const [birthdays, setBirthdays] = useState<Birthday[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    const fetchBirthdays = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("birthdays").select("*").eq("user_id", userId)
      if (data) setBirthdays(data)
    }

    fetchBirthdays()
  }, [userId])

  const getBirthdaysForDate = (date: Date) => {
    return birthdays.filter((b) => {
      const birthDate = new Date(b.birth_date)
      return birthDate.getMonth() === date.getMonth() && birthDate.getDate() === date.getDate()
    })
  }

  const selectedDateBirthdays = selectedDate ? getBirthdaysForDate(selectedDate) : []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          Birthday Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border border-border"
          />
        </div>
        <div className="lg:col-span-2">
          {selectedDate && (
            <div>
              <h3 className="font-semibold text-lg mb-4">Birthdays on {format(selectedDate, "MMMM d")}</h3>
              {selectedDateBirthdays.length === 0 ? (
                <p className="text-muted-foreground">No birthdays on this date</p>
              ) : (
                <div className="space-y-3">
                  {selectedDateBirthdays.map((birthday) => (
                    <div key={birthday.id} className="p-4 border border-border rounded-lg bg-card">
                      <p className="font-medium text-foreground">{birthday.person_name}</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(birthday.birth_date), "yyyy")}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
