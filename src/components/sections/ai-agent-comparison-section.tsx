import Image from 'next/image';
import { Settings, CircleDollarSign, Shield, WandSparkles, TerminalSquare } from 'lucide-react';

const features = [
  { name: "Seamless integrations", icon: Settings },
  { name: "Cost efficiency", icon: CircleDollarSign },
  { name: "Data security & privacy", icon: Shield },
  { name: "Personalized AI responses", icon: WandSparkles },
  { name: "Advanced task execution", icon: TerminalSquare },
];

const AiAgentComparisonSection = () => {
  return (
    <section className="bg-[#001b38] text-white py-20 px-6 sm:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-[40px] font-bold leading-tight">
            ... you're already using an AI agent but aren't that impressed.
          </h2>
          <p className="text-base text-[#b3b3b3] leading-relaxed max-w-xl mb-12">
            Most AI agents are distinctly average. But Forefrontagent is the new standard in AI customer service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Left Card: Ordinary AI */}
          <div className="bg-[#0d2847] p-10 rounded-[20px] flex flex-col">
            <h3 className="text-lg font-semibold text-white">Ordinary AI solution</h3>
            <p className="mt-2 text-gray-400">
              Weak integrations with your CRM, ERP and other business critical tools
            </p>
            <div className="mt-auto pt-8">
              <Image 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/images/images_8.png" 
                alt="Diagram showing weak integrations between an AI agent and other tools"
                width={488}
                height={275}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Right Card: Forefrontagent Suite */}
          <div className="bg-[#0d2847] p-10 rounded-[20px] border border-[rgba(95,216,133,0.3)] relative flex flex-col">
             <div className="absolute top-0 left-0 right-0 h-1 bg-accent rounded-t-[20px] shadow-[0_0_15px_theme(colors.accent)]"></div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-accent">The Forefrontagent customer service suite</h3>
                <p className="mt-2 text-gray-400">
                  Seamless integrations with all your apps, platforms and systems. Keep your existing tools and integrate Forefrontagent into your workflows without migrations.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {features.map((feature, index) => (
                  <div 
                    key={feature.name}
                    className={`flex items-center gap-3 text-left p-4 rounded-lg w-full font-semibold ${
                      index === 0 
                      ? 'bg-white text-[#0d2847]' 
                      : 'text-gray-300'
                    }`}
                  >
                    <feature.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{feature.name}</span>
                  </div>
                ))}
              </div>
             </div>
             <div className="mt-auto pt-8">
                <Image 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/images/images_9.png"
                  alt="Diagram showing Forefrontagent integrating with multiple platforms like Zendesk, Shopify, and Wordpress"
                  width={488}
                  height={275}
                  className="w-full h-auto"
                />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiAgentComparisonSection;