"use client";

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const cardsData = [
  {
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/images/images_2.png",
    alt: "Forefrontagent AI Agent interface mockup showing a chat conversation.",
    title: "The AI agent to resolve more queries easily",
    description: "Leave 67% of your most repetitive, time-consuming queries across chat, email and social to Forefrontagent AI Agent, the #1 choice for SMBs.",
    ctas: [{ text: "More about Forefrontagent", href: "#" }]
  },
  {
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/images/images_3.png",
    alt: "Circular workflow diagram showing Help Desk and Live Chat features.",
    title: "The service suite your team deserves",
    description: "Turn chaos into streamlined structure with a Help Desk and the most intuitive real-time Live Chat that lets your team perform properly and increase CSAT.",
    ctas: [
      { text: "More about Help Desk", href: "#" },
      { text: "More about Live Chat", href: "#" }
    ]
  },
  {
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/images/images_4.png",
    alt: "Automation flow diagram with a message bubble and decision tree.",
    title: "The flows that convert 24% more customers",
    description: "Imagine your own SDR optimizing every single interaction. Make it happen with Flows and operations-streamlining Product Suite.",
    ctas: [{ text: "More about Flows", href: "#" }]
  }
];

const ThreeCardStackSection = () => {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-['Inter'] text-[48px] font-black leading-tight text-foreground">
            The complete customer service stack
          </h2>
        </div>
        <div className="mx-auto mt-16 grid max-w-none grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {cardsData.map((card, index) => (
            <article key={index} className="flex flex-col rounded-[16px] bg-[#f0f4ff] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
              <div className="relative h-56 w-full">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="mt-8 font-['Inter'] text-[20px] font-semibold leading-8 text-black">
                {card.title}
              </h3>
              <p className="mt-4 flex-grow text-base font-normal leading-7 text-[#666666]">
                {card.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {card.ctas.map((cta, ctaIndex) => (
                  <a
                    key={ctaIndex}
                    href={cta.href}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#001B38] px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 ease-in-out hover:scale-[1.02]"
                  >
                    <span>{cta.text}</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeCardStackSection;