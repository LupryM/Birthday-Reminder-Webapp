import { Button } from "@/components/ui/button";
import { Gift, ArrowRight, Calendar, Users, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl w-full text-center space-y-12 relative z-10">
        <div className="space-y-6 animate-entrance">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass-pill border-white/5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            <ShieldCheck size={14} />
            Private & Secure
          </div>

          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-none text-foreground">
            Simply <br />
            <span className="text-muted-foreground italic font-light">
              Buddy
            </span>
            .
          </h1>

          <p className="text-xl text-muted-foreground max-w-xl mx-auto font-medium leading-relaxed">
            The minimalist registry for meaningful connections. Track dates and
            share wishlists in a clean, distraction-free space.
          </p>
        </div>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-entrance"
          style={{ animationDelay: "200ms" }}
        >
          <Button
            asChild
            className="btn-pill bg-white text-black hover:bg-white/90 shadow-2xl shadow-white/10 text-lg"
          >
            <Link href="/auth/sign-up" className="flex items-center gap-2">
              Get Started <ArrowRight size={20} />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="btn-pill glass-pill border-white/10 hover:bg-white/5 text-lg"
          >
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 animate-entrance"
          style={{ animationDelay: "400ms" }}
        >
          {[
            {
              icon: Calendar,
              title: "Calendar",
              desc: "Precision tracking for your inner circle.",
            },
            {
              icon: Gift,
              title: "Wishlists",
              desc: "Curated gift ideas, simplified.",
            },
            {
              icon: Users,
              title: "Groups",
              desc: "Collaborate on gifts privately.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="glass-pill p-10 hover:border-white/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                <item.icon className="text-foreground w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2 tracking-tight">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
