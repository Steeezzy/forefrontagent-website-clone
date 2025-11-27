import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const cardData = [
  {
    id: 1,
    title: '1.\u00a0Add Forefrontagent',
    description: 'Want to transform your service without changing platforms? Add Forefrontagent to your existing tech stack for instantly higher standards.',
    ctaText: 'Start for free',
    imageSrc: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/images/images_15.png',
    imageAlt: 'Forefrontagent integration with other platforms diagram',
    imageWidth: 288,
    imageHeight: 288,
  },
  {
    id: 2,
    title: '2.\u00a0Integrate deeper',
    description: 'Want your own custom agent? Help Desk integrates with your systems to create a customer service agent that\'s tailor made for your business.',
    ctaText: 'See how it works',
    imageSrc: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/images/images_16.png',
    imageAlt: 'API integration flow diagram for Forefrontagent agent',
    imageWidth: 288,
    imageHeight: 288,
  },
  {
    id: 3,
    title: '3.\u00a0Full suite solution',
    description: 'Want to optimize your entire service offering? Give the service you want and your customers deserve with the full Forefrontagent suite.',
    ctaText: 'Contact sales',
    imageSrc: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/images/images_17.png',
    imageAlt: 'Team collaboration diagram with user avatars',
    imageWidth: 288,
    imageHeight: 288,
  },
];

const ThreeStepsSection = () => {
  return (
    <section className="bg-white py-20 font-inter">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        <h2 className="text-[48px] font-black leading-tight text-center text-[#1A1A1A] mb-16">
          Improve your customer service in an instant
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {cardData.map((card) => (
            <div key={card.id} className="flex flex-col h-full bg-gradient-to-b from-[#E8F3FF] to-white p-6 rounded-[16px] border border-[#E8E8E8]">
              <div className="mx-auto mb-6">
                <Image src={card.imageSrc} alt={card.imageAlt} width={card.imageWidth} height={card.imageHeight} className="max-w-full h-auto" />
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">{card.title}</h3>
                <p className="text-base text-[#666666] leading-relaxed flex-grow">
                  {card.description}
                </p>
                <div className="mt-8">
                  <a href="#" className="inline-flex items-center bg-[#001B38] text-white font-semibold py-3 px-5 rounded-lg w-fit transition-transform hover:scale-[1.02]">
                    {card.ctaText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeStepsSection;