import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * GlobalLoader Component
 * 
 * Displays a full-screen loading overlay during page transitions.
 * Features:
 * - Animated spinning ring using brand colors (red-600)
 * - Pulsing logo in the center
 * - Branded loading text
 */
export default function GlobalLoader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Handle route change start - show loader
    const handleStart = (url: string) => {
      if (url !== router.asPath) {
        setLoading(true);
      }
    };

    // Handle route change complete/error - hide loader
    const handleComplete = () => {
      setLoading(false);
    };

    // Subscribe to router events
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    // Cleanup event listeners on unmount
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm">
      {/* Spinning Ring Container */}
      <div className="relative flex items-center justify-center">
        {/* Outer spinning ring using brand colors */}
        <div className="w-24 h-24 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
        
        {/* Logo in the center with pulse animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 animate-pulse">
            <Image
              src="/images/logo.jpg"
              alt="Imuhira TV"
              width={56}
              height={56}
              className="rounded-full object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Branded loading text */}
      <p className="mt-6 text-slate-500 text-sm font-bold uppercase tracking-widest">
        Fetching latest updates...
      </p>
    </div>
  );
}
