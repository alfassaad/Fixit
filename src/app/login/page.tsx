
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppContext();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login({ email, password }); // Corrected to only use the context login function
      setLoading(false);
      toast({
        title: "Login Successful",
        description: `Welcome back! Logged in as ${isAdmin ? 'Admin' : 'Citizen'}.`,
      });
      router.push(isAdmin ? '/admin/dashboard' : '/map');
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Invalid login credentials.",
        variant: "destructive",
      });
    }
  };

  const handleGuest = () => {
    // For guest login, you might want to create a guest session or use a default guest account
    // For this example, we'll just redirect to the map
    router.push('/map');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A5276] to-[#2E86C1] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <CardHeader className="text-center pt-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-2xl shadow-lg">
              <Wrench className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">FixIt</h1>
          <p className="text-muted-foreground font-medium">Fix your city, one report at a time</p>
        </CardHeader>
        
        <CardContent className="px-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                <Input 
                  type="email" 
                  placeholder="citizen@demo.com" 
                  className="pl-10"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="pl-10 pr-10"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg font-semibold bg-accent hover:bg-accent/90 shadow-md transition-all active:scale-95" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : `Login as ${isAdmin ? 'Admin' : 'Citizen'}`}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground font-medium">Or continue with</span></div>
          </div>

          <Button variant="outline" className="w-full h-11 font-medium hover:bg-slate-50 transition-all" onClick={handleGuest}>
            Continue as Guest
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pb-8">
          <button 
            onClick={() => setIsAdmin(!isAdmin)}
            className="text-sm text-primary font-semibold hover:underline"
          >
            Switch to {isAdmin ? 'Citizen' : 'Admin'} Login
          </button>
          
          <Link href="/signup" className="text-sm text-primary font-semibold hover:underline">
            Don't have an account? Sign Up
          </Link>

          <div className="bg-slate-50 p-3 rounded-lg border border-dashed border-slate-300 text-xs text-center">
            <p className="text-muted-foreground font-medium">Demo Credentials:</p>
            <p className="font-bold text-slate-600">citizen@demo.com / admin@demo.com</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
