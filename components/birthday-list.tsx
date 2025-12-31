"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit, ChevronRight, Users } from "lucide-react";
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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    setDeletingId(id);
    const supabase = createClient();
    await supabase.from("birthdays").delete().eq("id", id);
    fetchBirthdays();
    setDeletingId(null);
  };

  const calculateAge = (birthDate: string) => {
    return differenceInYears(new Date(), new Date(birthDate));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div>All Birthdays</div>
                <p className="text-sm font-normal text-muted-foreground">
                  {birthdays.length}{" "}
                  {birthdays.length === 1 ? "person" : "people"}
                </p>
              </div>
            </CardTitle>
            <Button
              onClick={() => setShowAddDialog(true)}
              size="sm"
              className="gap-2 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {birthdays.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                <Users className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold mb-1">No birthdays yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first birthday to get started!
              </p>
              <Button onClick={() => setShowAddDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Birthday
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {birthdays.map((birthday) => (
                <div
                  key={birthday.id}
                  className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:border-primary hover:shadow-md"
                >
                  <Link
                    href={`/dashboard/birthday/${birthday.id}`}
                    className="block p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">
                          {birthday.person_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {format(
                            new Date(birthday.birth_date),
                            "MMMM d, yyyy"
                          )}{" "}
                          • {calculateAge(birthday.birth_date)} years old
                        </p>
                        {birthday.relationship && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {birthday.relationship}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>

                  {/* Action buttons */}
                  <div className="flex gap-1 border-t bg-muted/30 p-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        setEditingBirthday(birthday);
                      }}
                      className="flex-1 gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          confirm(`Delete ${birthday.person_name}'s birthday?`)
                        ) {
                          handleDelete(birthday.id);
                        }
                      }}
                      disabled={deletingId === birthday.id}
                      className="flex-1 gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingId === birthday.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Floating Action Button for Mobile */}
      <Button
        onClick={() => setShowAddDialog(true)}
        size="lg"
        className="fixed right-4 bottom-20 h-14 w-14 rounded-full shadow-lg md:hidden"
      >
        <Plus className="h-6 w-6" />
      </Button>

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
