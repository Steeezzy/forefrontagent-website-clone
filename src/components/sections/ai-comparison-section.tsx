import Image from "next/image";
import { BrainCircuit, Megaphone, Smile, Users } from "lucide-react";

type Feature = {
  icon: React.ReactNode;
  text: string;
};

const features: Feature[] = [
  {
    icon: <Smile size={20} className="text-text-dark" />,
    text: "Human-like responses",
  },
  {
    icon: <BrainCircuit size={20} className="text-text-dark" />,
    text: "Understanding complexity",
  },
  {
    icon: <Megaphone size={20} className="text-text-dark" />,
    text: "Brand voice alignment",
  },
  {
    icon: <Users size={20} className="text-text-dark" />,
    text: "User & team experience",
  },
];

const AiComparisonSection = () => {
  return (
    <section className="bg-primary-navy text-white">
      <div className="max-w-[1280px] mx-auto px-6 md:px-20 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-y-12 lg:gap-x-12 items-center">
          <div>
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/images/images_5.png"
              alt="Diagram comparing a linear 'Ordinary AI solution' with the circular, more advanced 'Forefrontagent AI Agent' flow."
              width={768}
              height={648}
              className="w-full h-auto"
            />
          </div>

          <div>
            <h2 className="text-[32px] md:text-[40px] font-bold leading-tight mb-6 md:mb-10">
              ... you'd never risk AI taking care of your hard-won customers.
            </h2>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed md:leading-8 mb-6 md:mb-10">
              Forget everything you think about AI agents. And meet Forefrontagent AI. The
              smart, sensible way to work with AI that doesn't risk your
              customer relationships. It improves them.
            </p>

            <div className="flex flex-col items-start gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white text-text-dark rounded-full flex items-center gap-4 py-3 px-6 w-fit"
                >
                  {feature.icon}
                  <span className="text-sm font-semibold tracking-[-0.01em]">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiComparisonSection;