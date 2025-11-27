import React from 'react';

const statsData = [
  {
    value: '67%',
    label: 'The highest resolution rate on the market',
    bgColor: 'bg-white',
  },
  {
    value: '#1',
    label: 'AI agent for SMBs',
    bgColor: 'bg-[#d4f5e9]',
  },
  {
    value: '300K+',
    label: 'Loved by brands, customers and service teams',
    bgColor: 'bg-white',
  },
];

const StatsCardsSection = () => {
  return (
    <section className="bg-[#0a1e42] py-20 font-sans">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-xl py-10 px-8 text-center flex flex-col items-center justify-center shadow-[0_2px_16px_rgba(0,0,0,0.3)]`}
            >
              <p className="text-[64px] font-black text-[#0a1e42] leading-none">
                {stat.value}
              </p>
              <p className="mt-4 text-base font-normal text-[#333333] max-w-[250px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCardsSection;