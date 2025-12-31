"use client";

import type React from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Gift, ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Mesh Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-entrance">
        <div className="flex flex-col gap-8">
          <Link
            href="/"
            className="flex items-center justify-center gap-3 group transition-transform hover:scale-105"
          >
            <div className="bg-primary p-3 rounded-2xl shadow-xl shadow-primary/20 group-hover:rotate-12 transition-transform">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-foreground tracking-tighter">
              Birthday <span className="text-primary italic">Buddy</span>
            </h1>
          </Link>

          <Card className="glass border-primary/20 shadow-2xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="space-y-2 pt-10 pb-2 text-center">
              <CardTitle className="text-4xl font-black tracking-tight">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-muted-foreground text-lg">
                Your circle is waiting for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-xs font-black uppercase tracking-widest ml-1"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        className="h-14 pl-12 rounded-xl glass border-white/10 focus:ring-primary focus:border-primary transition-all"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <Label
                        htmlFor="password"
                        className="text-xs font-black uppercase tracking-widest"
                      >
                        Password
                      </Label>
                      <Link
                        href="#"
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Forgot?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        className="h-14 pl-12 rounded-xl glass border-white/10 focus:ring-primary focus:border-primary transition-all"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold text-center">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-14 rounded-xl bg-primary text-white font-black text-lg btn-hover shadow-lg shadow-primary/30"
                  disabled={isLoading}
                >
                  {isLoading ? "Validating..." : "Login to Buddy"}
                  {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>

                <div className="text-center text-sm font-bold">
                  <span className="text-muted-foreground">
                    New to the circle?
                  </span>{" "}
                  <Link
                    href="/auth/sign-up"
                    className="text-primary hover:underline underline-offset-4"
                  >
                    Create an account
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
