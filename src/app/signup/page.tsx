
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench, Mail, Lock, Eye, EyeOff, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { signUp } from '@/services/authService';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signUp({ email, password, fullName });
      setLoading(false);
      toast({
        title: "Sign Up Successful",
        description: "Welcome to FixIt! You are now logged in.",
      });
      router.push('/explore');
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Could not sign up. Please try again.",
        variant: "destructive",
      });
    }
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
          <p className="text-muted-foreground font-medium">Create your account</p>
        </CardHeader>
        
        <CardContent className="px-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                <Input 
                  type="text" 
                  placeholder="John Doe" 
                  className="pl-10"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
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
              {loading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pb-8">
          <Link href="/login" className="text-sm text-primary font-semibold hover:underline">
            Already have an account? Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
