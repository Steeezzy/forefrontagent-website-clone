"use client";

import Link from 'next/link';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { useSession, authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';

const NavigationHeader = () => {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    const token = localStorage.getItem("bearer_token");

    const { error } = await authClient.signOut({
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    if (error?.code) {
      toast.error("Failed to sign out. Please try again.");
      setIsLoggingOut(false);
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      toast.success("Signed out successfully");
      router.push("/");
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#001B38] text-white shadow-md font-inter">
      <nav className="container flex h-[72px] items-center justify-between">
        <Link href="/" aria-label="Forefrontagent homepage">
          <span className="text-2xl font-bold">Forefrontagent</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-80">
            <span>EN</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {isPending ? (
            <div className="h-8 w-20 bg-white/10 animate-pulse rounded" />
          ) : session?.user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
              >
                <User className="h-4 w-4" />
                <span>{session.user.name || session.user.email}</span>
              </Link>
              <button
                onClick={handleSignOut}
                disabled={isLoggingOut}
                className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
                <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium transition-opacity hover:opacity-80"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-[#5FD885] text-[#001B38] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#4CD964] transition-colors"
              >
                Sign up free
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavigationHeader;