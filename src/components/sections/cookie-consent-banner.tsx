"use client";

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const ToggleItem = ({
  id,
  label,
  checked,
  onCheckedChange,
  disabled = false,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}) => (
  <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-3">
    <Label htmlFor={id} className={`pr-2 text-sm font-medium ${disabled ? 'cursor-not-allowed text-zinc-500' : 'cursor-pointer'}`}>
      {label}
    </Label>
    <Switch
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
    />
  </div>
);

const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [preferences, setPreferences] = useState(false);
  const [statistics, setStatistics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  if (!isVisible) {
    return null;
  }

  const handleConfirm = () => {
    console.log('Cookie preferences confirmed:', {
      necessary: true,
      preferences,
      statistics,
      marketing,
    });
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[2147483647] rounded-t-[12px] bg-white font-inter text-[#333333] shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="relative mx-auto max-w-7xl p-6">
        <button
          onClick={handleClose}
          className="absolute right-6 top-6 text-zinc-400 transition-colors hover:text-zinc-600"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col lg:flex-row lg:gap-8">
          <div className="flex flex-1 items-start gap-4">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/cookie-icon-1.svg"
              alt="Cookie icon"
              width={32}
              height={32}
              className="mt-1 flex-shrink-0"
            />
            <div>
              <h2 className="text-base font-bold">This website uses cookies.</h2>
              <p className="mt-1 text-sm">
                We use cookies to ensure that our website runs smoothly, improve your experience, monitor our performance, and for advertising purposes. To learn more about how we use cookies, go here:{' '}
                <a href="/privacy-policy#ccpa" className="text-blue-600 underline hover:no-underline">
                  CCPA
                </a>
                . By clicking “Confirm”, you are giving us consent to use all cookies.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col justify-between gap-4 lg:mt-0">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-2">
              <ToggleItem label="Necessary" id="necessary" checked={true} disabled />
              <ToggleItem label="Preferences" id="preferences" checked={preferences} onCheckedChange={setPreferences} />
              <ToggleItem label="Statistics" id="statistics" checked={statistics} onCheckedChange={setStatistics} />
              <ToggleItem label="Marketing" id="marketing" checked={marketing} onCheckedChange={setMarketing} />
            </div>

            <div className="flex flex-col-reverse items-center gap-y-4 sm:flex-row sm:justify-end sm:gap-x-6">
              <a href="#" className="text-center text-sm font-medium underline hover:no-underline">
                Manage cookies
              </a>
              <button
                onClick={handleConfirm}
                className="w-full whitespace-nowrap rounded-[6px] bg-[#00D084] px-6 py-[10px] text-base font-semibold text-white transition-colors hover:bg-[#00c57c] sm:w-auto"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;