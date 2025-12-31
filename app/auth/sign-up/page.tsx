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
import { Gift, User, Mail, Lock, Sparkles } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: { display_name: displayName },
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-entrance">
        <div className="flex flex-col gap-6">
          <Link
            href="/"
            className="flex items-center justify-center gap-3 group"
          >
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
              <Gift className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-foreground tracking-tighter">
              Birthday Buddy
            </h1>
          </Link>

          <Card className="glass border-primary/20 shadow-2xl rounded-[2.5rem]">
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-3xl font-black tracking-tight">
                Create Account
              </CardTitle>
              <CardDescription className="text-muted-foreground font-bold">
                Start tracking the moments that matter.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                    Display Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="John Doe"
                      className="h-12 pl-11 rounded-xl glass border-white/10"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      className="h-12 pl-11 rounded-xl glass border-white/10"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        className="h-12 pl-11 rounded-xl glass border-white/10"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                      Confirm
                    </Label>
                    <Input
                      type="password"
                      className="h-12 rounded-xl glass border-white/10"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-bold text-center border border-destructive/20">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-14 rounded-xl bg-primary text-white font-black text-lg btn-hover shadow-lg shadow-primary/30 mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Creating..."
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" /> Join the Circle
                    </>
                  )}
                </Button>

                <p className="text-center text-sm font-bold mt-4">
                  <span className="text-muted-foreground">
                    Already a member?
                  </span>{" "}
                  <Link
                    href="/auth/login"
                    className="text-primary hover:underline underline-offset-4"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
