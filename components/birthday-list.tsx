"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit } from "lucide-react";
import { AddBirthdayDialog } from "@/components/add-birthday-dialog";
import { EditBirthdayDialog } from "@/components/edit-birthday-dialog";
import Link from "next/link";
import { format, differenceInYears } from "date-fns";

interface Birthday {
  id: string;
  person_name: string;
  birth_date: string;
  relationship: string | null;
  notes: string | null;
}

export function BirthdayList({ userId }: { userId: string }) {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState<Birthday | null>(null);

  const fetchBirthdays = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("birthdays")
      .select("*")
      .eq("user_id", userId)
      .order("birth_date", { ascending: true });

    if (data) {
      setBirthdays(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBirthdays();
  }, [userId]);

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    await supabase.from("birthdays").delete().eq("id", id);
    fetchBirthdays();
  };

  const calculateAge = (birthDate: string) => {
    return differenceInYears(new Date(), new Date(birthDate));
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">All Birthdays</CardTitle>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Birthday
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {birthdays.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No birthdays yet. Add your first one!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {birthdays.map((birthday) => (
                <Link
                  key={birthday.id}
                  href={`/dashboard/birthday/${birthday.id}`}
                >
                  <div className="p-4 border border-border rounded-lg hover:bg-card/80 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {birthday.person_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {format(
                            new Date(birthday.birth_date),
                            "MMMM d, yyyy"
                          )}{" "}
                          ({calculateAge(birthday.birth_date)} years old)
                        </p>
                        {birthday.relationship && (
                          <p className="text-sm text-muted-foreground">
                            {birthday.relationship}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.preventDefault();
                            setEditingBirthday(birthday);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(birthday.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddBirthdayDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        userId={userId}
        onSuccess={fetchBirthdays}
      />

      {editingBirthday && (
        <EditBirthdayDialog
          open={!!editingBirthday}
          onOpenChange={(open) => !open && setEditingBirthday(null)}
          birthday={editingBirthday}
          onSuccess={fetchBirthdays}
        />
      )}
    </>
  );
}
