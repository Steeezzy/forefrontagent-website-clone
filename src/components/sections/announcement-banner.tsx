"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="relative flex w-full items-center justify-center bg-[#0066FF] py-3 font-inter text-sm text-white"
    >
      <Link 
        href="#" 
        className="group flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-12"
      >
        <span
          className="whitespace-nowrap rounded-full bg-[var(--color-bright-green)] px-3 py-1 text-xs font-semibold text-white transition-colors group-hover:bg-[var(--color-bright-green-light)]"
        >
          Get holiday season ready
        </span>

        <div className="flex items-center gap-x-2">
          <p className="hidden sm:inline">
            Explore free tools and insights for peak season success
          </p>
          <ArrowRight className="h-4 w-4 flex-shrink-0" />
        </div>
      </Link>

      <button
        onClick={() => setIsVisible(false)}
        aria-label="Dismiss"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}