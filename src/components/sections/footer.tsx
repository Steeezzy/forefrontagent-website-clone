import Image from "next/image";
import { Star, ChevronDown, Globe } from "lucide-react";

type LinkItem = {
  name: string;
  href: string;
};

const FooterLinkColumn = ({ title, links }: { title: string; links: LinkItem[] }) => (
  <div>
    <h3 className="text-xs font-bold uppercase tracking-wider text-[#666666] mb-6">{title}</h3>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.name}>
          <a href={link.href} className="text-sm text-[#b3b3b3] hover:text-white transition-colors duration-200">
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  const forefrongagentLinks: LinkItem[] = [
    { name: "About", href: "#" }, { name: "FAQ", href: "#" }, { name: "Contact", href: "#" },
    { name: "Partner Programs", href: "#" }, { name: "Careers", href: "#" }, { name: "Blog", href: "#" },
    { name: "Reviews", href: "#" }, { name: "Newsroom", href: "#" },
  ];

  const productLinks: LinkItem[] = [
    { name: "Pricing", href: "#" }, { name: "Forefrontagent AI Agent", href: "#" }, { name: "Help Desk", href: "#" },
    { name: "Live Chat", href: "#" }, { name: "Flows", href: "#" }, { name: "Integrations", href: "#" },
    { name: "Start for free", href: "#" }, { name: "Contact sales", href: "#" },
  ];

  const resourcesLinks: LinkItem[] = [
    { name: "Customer Stories", href: "#" }, { name: "Watch Demo", href: "#" }, { name: "AI Playground", href: "#" },
    { name: "ROI Calculator", href: "#" }, { name: "Ebooks", href: "#" }, { name: "Templates", href: "#" },
    { name: "Webinars", href: "#" }, { name: "Comparisons", href: "#" },
  ];

  const compareLinks: LinkItem[] = [
    { name: "vs Salesforce Drift", href: "#" }, { name: "vs Gorgias", href: "#" }, { name: "vs Intercom", href: "#" },
    { name: "vs LiveChat", href: "#" }, { name: "vs Zendesk", href: "#" }, { name: "vs Olark", href: "#" },
    { name: "vs Crisp", href: "#" }, { name: "All comparisons", href: "#" },
  ];

  const supportLinks: LinkItem[] = [
    { name: "Help Center", href: "#" }, { name: "Developers", href: "#" }, { name: "Status Page", href: "#" },
    { name: "Product Updates", href: "#" }, { name: "Roadmap", href: "#" }, { name: "What's New", href: "#" },
  ];
  
  const linkColumns = [
    { title: "FOREFRONTAGENT", links: forefrongagentLinks },
    { title: "PRODUCT", links: productLinks },
    { title: "RESOURCES", links: resourcesLinks },
    { title: "COMPARE", links: compareLinks },
    { title: "SUPPORT", links: supportLinks },
  ];

  const platformIcons = [
    { src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/browser-28.svg", name: "Browser" },
    { src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/android-29.svg", name: "Android" },
    { name: "iOS", src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/mac-30.svg"}, // uses Mac icon for iOS as per instruction context
    { src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/windows-31.svg", name: "Windows" },
    { src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/mac-30.svg", name: "Mac" },
  ];
  const socialIcons = [
    { src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/linkedin-32.svg", name: "LinkedIn" },
    { src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/youtube-33.svg", name: "YouTube" },
    { src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/twitter-34.svg", name: "Twitter" },
    { src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/reddit-35.svg", name: "Reddit" },
    { src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/facebook-36.svg", name: "Facebook" },
    { src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/instagram-37.svg", name: "Instagram" },
  ];
  const legalLinks = [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms and Conditions", href: "#" },
    { name: "Do not sell data", href: "#" },
  ];

  return (
    <footer className="bg-[#0a1e42] text-white">
      <div className="max-w-[1400px] mx-auto py-[80px] px-[60px] lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[repeat(5,minmax(0,1fr))_minmax(0,1.5fr)] gap-y-10 gap-x-8">
          {linkColumns.map((col) => (
            <FooterLinkColumn key={col.title} title={col.title} links={col.links} />
          ))}

          <div className="flex flex-col gap-6 items-start">
            <a href="#" className="py-2.5 px-6 rounded-lg text-sm font-semibold bg-white text-primary-navy w-full text-center transition-colors hover:bg-gray-200">Contact sales</a>
            <a href="#" className="py-2.5 px-6 rounded-lg text-sm font-semibold bg-white text-primary-navy w-full text-center transition-colors hover:bg-gray-200">Pricing</a>
            
            <div className="mt-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-white" fill="white" />)}
              </div>
              <p className="text-sm text-[#b3b3b3] mt-2">4.7 - 60 reviews</p>
              <div className="flex items-center gap-4 mt-3 opacity-60">
                <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/G2_gray-24.svg" alt="G2 logo" width={48} height={15} />
                <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/capterra_gray-25.svg" alt="Capterra logo" width={77} height={16} />
                <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/shopify_gray-26.svg" alt="Shopify logo" width={64} height={18} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-white" fill="white" />
              <p className="text-sm text-[#b3b3b3]">4.6 on Shopify</p>
            </div>
            
            <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/images/images_29.png" alt="AICPA SOC certification" width={64} height={64} />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700 flex flex-col xl:flex-row justify-between items-center gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/3df7ade8-110d-41f4-bbb9-289e44aa8e3a-tidio-com/assets/svgs/logo_white-27.svg" alt="Forefrontagent Logo" width={90} height={24} />
            <p className="text-sm text-[#b3b3b3]">Join 300k+ businesses that use Forefrontagent</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-[#b3b3b3] flex-wrap justify-center">
            {platformIcons.map((platform, index) => (
              <div key={index} className="flex items-center gap-2">
                <Image src={platform.src} alt={`${platform.name} icon`} width={16} height={16} className="opacity-70"/>
                <span>{platform.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-x-6 gap-y-4 text-xs text-[#666666]">
            <p>Forefrontagent 2025. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {socialIcons.map(icon => (
                <a key={icon.name} href="#" aria-label={icon.name} className="opacity-60 hover:opacity-100 transition-opacity">
                  <Image src={icon.src} alt={icon.name} width={20} height={20} />
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-xs text-[#b3b3b3]">
            <button className="flex items-center gap-1 hover:text-white">
              <Globe className="w-4 h-4" />
              <span>EN</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {legalLinks.map(link => (
              <a href={link.href} key={link.name} className="hover:text-white">{link.name}</a>
            ))}
            <a href="mailto:support@forefrontagent.com" className="hover:text-white">support@forefrontagent.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}