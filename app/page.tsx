import { Button } from "@/components/ui/button";
import { Gift, Users, Calendar } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center gap-8 max-w-3xl mx-auto mb-20">
          <div className="flex items-center gap-3">
            <Gift className="h-10 w-10 text-primary" />
            <h1 className="text-5xl font-bold text-foreground">
              Birthday Buddy
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Never forget a birthday. Track everyone's special day, manage gift
            wishlists, and celebrate together.
          </p>
          <div className="flex gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-card border border-border p-8 rounded-lg">
            <Calendar className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Birthdays</h3>
            <p className="text-muted-foreground">
              Add and organize birthdays for friends and family in one place.
            </p>
          </div>

          <div className="bg-card border border-border p-8 rounded-lg">
            <Gift className="h-8 w-8 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Gift Wishlists</h3>
            <p className="text-muted-foreground">
              Create personalized gift ideas with links and priorities.
            </p>
          </div>

          <div className="bg-card border border-border p-8 rounded-lg">
            <Users className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Connect Friends</h3>
            <p className="text-muted-foreground">
              Share wishlists and stay connected with people you care about.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
