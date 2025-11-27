import React from 'react';
import { Star, PlayCircle } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
    return (
        <section className="bg-[#001B38] text-white pt-24 pb-20 sm:pt-32 sm:pb-28">
            <div className="container mx-auto px-6 text-center">
                
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="flex text-[#5FD885]">
                        <Star fill="currentColor" strokeWidth={0} className="w-5 h-5" />
                        <Star fill="currentColor" strokeWidth={0} className="w-5 h-5" />
                        <Star fill="currentColor" strokeWidth={0} className="w-5 h-5" />
                        <Star fill="currentColor" strokeWidth={0} className="w-5 h-5" />
                        <Star fill="currentColor" strokeWidth={0} className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-gray-300">
                        4.7 (1769+ reviews)
                    </p>
                </div>

                <h1 className="font-black text-4xl sm:text-5xl md:text-[64px] leading-[1.2] tracking-[-0.02em] max-w-3xl mx-auto">
                    Welcome to the new standard in customer service
                </h1>

                <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto font-normal">
                    Push your resolution rates, customer satisfaction and service team efficiency to the highest possible level with Forefrontagent.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link 
                        href="#" 
                        className="bg-[#00D084] text-[#001B38] font-semibold text-base px-8 py-[14px] rounded-lg transition hover:opacity-90 w-full sm:w-auto"
                    >
                        Start for free
                    </Link>
                    <Link 
                        href="#" 
                        className="bg-white text-[#1a1a1a] font-semibold text-base px-8 py-[14px] rounded-lg border border-[#e5e5e5] transition hover:bg-gray-100 w-full sm:w-auto"
                    >
                        Contact sales
                    </Link>
                </div>

                <p className="mt-4 text-sm text-gray-400">
                    No credit card required
                </p>

                <div className="mt-16 w-full max-w-5xl mx-auto">
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
                    <div className="absolute inset-0 bg-[#00234D] -z-10"></div>
                    <video
                      src="https://www.tidio.com/video/components/hero-media/homepage-hero-video-new.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="mt-8 mx-auto flex items-center gap-2 font-semibold text-white/80 transition-colors hover:text-white">
                      <PlayCircle className="w-7 h-7" />
                      <span className="text-lg">Watch video</span>
                  </button>
                </div>

            </div>
        </section>
    );
};

export default HeroSection;