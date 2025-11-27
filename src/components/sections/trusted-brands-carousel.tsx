"use client";
import React from 'react';
import Image from 'next/image';

const brands = [
  {
    name: 'Under Armour',
    src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/under-armour-3.svg',
  },
  {
    name: 'The Body Shop',
    src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/the-body-shop-4.svg',
  },
  {
    name: 'Dermalogica',
    src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/dermalogica-5.svg',
  },
  {
    name: 'Ninja Transfers',
    src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/ninja_transfers-6.svg',
  },
  {
    name: 'Stanley',
    src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/stanley-7.svg',
  },
  {
    name: 'Wasatch',
    src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/wasatch-8.svg',
  },
  {
    name: 'Jaguar',
    src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/jaguar-9.svg',
  },
];

const TrustedBrandsCarousel = () => {
  return (
    <>
      <style>
        {`
          @keyframes scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
          .animate-scroll {
            animation: scroll 40s linear infinite;
          }
        `}
      </style>
      <section className="bg-gradient-to-br from-[#002B4F] to-[#001B38] py-[60px] font-inter">
        <div className="container mx-auto flex flex-col items-center gap-16">
          <h2 className="max-w-[650px] text-center text-[32px] font-bold leading-[1.25] text-white">
            Trusted by brands that refuse to compromise on customer experience
          </h2>

          <div className="group w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex animate-scroll group-hover:[animation-play-state:paused]">
              {[...brands, ...brands].map((brand, index) => (
                <div
                  key={`${brand.name}-${index}`}
                  className="mx-3 flex h-[92px] w-[212px] flex-shrink-0 items-center justify-center rounded-sm bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={brand.src}
                      alt={brand.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TrustedBrandsCarousel;