import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const NavigationHeader = () => {
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
          <Link href="#" className="text-sm font-medium transition-opacity hover:opacity-80">
            Log in
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default NavigationHeader;