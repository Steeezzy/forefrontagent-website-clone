import React from 'react';

const FinalCtaSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div
          className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-10 rounded-[16px] bg-[#0a1e42] p-10 text-center lg:flex-row lg:gap-16 lg:p-20 lg:text-left"
        >
          <div className="flex-1">
            <h2 className="text-[40px] font-black leading-[1.2] text-white">
              Join the new standard in customer service
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#b3b3b3] lg:mx-0">
              Give your customers the service you want. Give your agents their
              best experience yet. Give your competitors customer service envy.
            </p>
          </div>

          <div className="flex w-full flex-shrink-0 flex-col items-center gap-4 sm:w-auto">
            <div className="flex w-full flex-col items-center sm:w-auto">
              <a
                href="#"
                className="inline-flex h-auto w-full items-center justify-center whitespace-nowrap rounded-[8px] bg-accent px-8 py-4 text-base font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-[260px]"
              >
                Start for free
              </a>
              <p className="mt-2 text-xs text-[#b3b3b3]">
                No credit card required
              </p>
            </div>
            <a
              href="#"
              className="inline-flex h-auto w-full items-center justify-center whitespace-nowrap rounded-[8px] bg-white px-8 py-4 text-base font-semibold text-[#0a1e42] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-[260px]"
            >
              Contact sales
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;