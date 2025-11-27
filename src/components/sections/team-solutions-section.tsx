import { Settings2, Zap, Clock, Scale } from 'lucide-react';

const TeamSolutionsSection = () => {
  return (
    <section className="bg-primary py-20 font-inter">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[40px] font-bold leading-tight text-white max-w-lg">
              ... you don't want to replace your real team with robots.
            </h2>
            <p className="text-[#B3B3B3] text-base leading-relaxed max-w-lg">
              We're here to make your real agents more effective, not redundant. Forefrontagent's human agent solutions let your team put their talent where it really makes a difference.
            </p>
            <div className="mt-6 flex flex-col items-start gap-4">
              <div className="flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-primary">
                <Settings2 size={20} />
                <span className="text-base font-medium">Workflow organization</span>
              </div>
              <div className="flex cursor-pointer items-center gap-3 py-2 text-white">
                <Zap size={20} />
                <span className="text-base font-medium">Handling high volume</span>
              </div>
              <div className="flex cursor-pointer items-center gap-3 py-2 text-white">
                <Clock size={20} />
                <span className="text-base font-medium">Support task automation</span>
              </div>
              <div className="flex cursor-pointer items-center gap-3 py-2 text-white">
                <Scale size={20} />
                <span className="text-base font-medium">Real-time scalability</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative">
            <img
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/images/images_7.png"
              alt="Diagram illustrating the difference in customer service team organization with and without Forefrontagent"
              className="w-full h-auto rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSolutionsSection;