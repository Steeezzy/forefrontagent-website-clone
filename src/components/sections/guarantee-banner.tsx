import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const GuaranteeBanner = () => {
  return (
    <div className="bg-[#0a1e42] rounded-2xl py-12 px-6 md:py-16 md:px-20">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-8">
        <div className="text-center lg:text-left">
          <h2 className="text-2xl sm:text-[32px] font-black leading-tight mb-4">
            Forefrontagent Resolution Rate Guarantee
          </h2>
          <p className="text-[#b3b3b3] text-base leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
            We're slightly obsessed by resolution rates. It's why our 67% rate is the highest in the industry. And why if we don't lift yours to at least 50%, you'll get your money back.
          </p>
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 bg-[#00d084] text-[#0a1e42] font-semibold py-3 px-7 rounded-lg transition-transform hover:scale-105"
          >
            <span>Contact sales</span>
            <ArrowRight size={20} />
          </a>
        </div>
        <div className="flex-shrink-0">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/images/images_14.png"
            alt="50% resolution rate guarantee graphic"
            width={245}
            height={132}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default GuaranteeBanner;