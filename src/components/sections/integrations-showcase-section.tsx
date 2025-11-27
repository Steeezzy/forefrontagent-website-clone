import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const integrations = [
  { 
    name: 'Mailchimp', 
    bgColor: 'bg-[#ffeb85]', 
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/mailchimp-17.svg' 
  },
  { 
    name: 'HubSpot', 
    bgColor: 'bg-[#ffab99]', 
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/hubspot-18.svg' 
  },
  { 
    name: 'WordPress', 
    bgColor: 'bg-[#a3d3e9]', 
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/wordpress-19.svg' 
  },
  { 
    name: 'Shopify', 
    bgColor: 'bg-[#b8e48b]', 
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/shopify-20.svg' 
  },
  { 
    name: 'Squarespace', 
    bgColor: 'bg-[#c3a4f6]', 
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/squarespace-21.svg' 
  },
  { 
    name: 'Zendesk', 
    bgColor: 'bg-[#679198]', 
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/zendesk-22.svg' 
  },
  { 
    name: 'Zapier', 
    bgColor: 'bg-[#ffa380]', 
    icon: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/zapier-23.svg' 
  },
];

const IntegrationsShowcaseSection = () => {
  return (
    <section className="bg-[#001B38] py-20">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-20 flex flex-col items-center text-center">
        <h2 className="text-white text-[40px] font-black leading-tight">
          How integrations should be
        </h2>
        <a
          href="#"
          className="mt-8 inline-flex items-center justify-center gap-2 px-7 py-3 bg-white text-[#0a1e42] text-base font-semibold rounded-lg hover:bg-gray-200 transition-colors"
        >
          Find your workflow
          <ArrowRight className="h-5 w-5" />
        </a>
        <div className="mt-16 flex flex-wrap justify-center items-center gap-4">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className={`${integration.bgColor} w-[120px] h-[120px] rounded-full flex items-center justify-center`}
            >
              <Image
                src={integration.icon}
                alt={`${integration.name} logo`}
                width={80}
                height={80}
              />
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-[#999999]">
          and 120+ tools to integrate
        </p>
      </div>
    </section>
  );
};

export default IntegrationsShowcaseSection;