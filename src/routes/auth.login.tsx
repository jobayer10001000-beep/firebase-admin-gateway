import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { Particles } from "@/components/site/Particles";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Login — RED EYES OFFICIAL" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => { if (user) nav({ to: "/" }); }, [user, nav]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back.");
      nav({ to: "/" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="relative pt-32 pb-20 px-6 flex items-center justify-center min-h-[100svh]">
        <Particles count={24} />
        <form onSubmit={onSubmit} className="glass-strong rounded-2xl p-8 w-full max-w-md relative">
          <h1 className="font-display font-black text-3xl uppercase text-gradient text-center mb-2">Sign In</h1>
          <p className="text-center text-sm text-muted-foreground mb-8">Access your RED EYES account.</p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full mt-6 bg-gradient-to-r from-[var(--blood)] to-[var(--neon)] shadow-[var(--shadow-glow-sm)] font-display uppercase tracking-widest">
            {loading ? "…" : "Enter"}
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-5">
            No account? <Link to="/auth/register" className="text-[var(--neon)] hover:underline">Register</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
