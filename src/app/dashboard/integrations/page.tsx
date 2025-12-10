"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Search, ExternalLink, MessageSquare, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface BotType {
    id: number;
    name: string;
}

const CATEGORIES = [
    "All integrations",
    "BI & analytics",
    "Communication channels",
    "CRM",
    "E-commerce",
    "Marketing automation",
    "Rating & reviews",
    "Customer support"
];

const INTEGRATIONS = [
    {
        name: "Shopify",
        description: "Connect your Shopify store to automatically install the Tsukai chat widget and sync product data.",
        icon: "https://cdn.iconscout.com/icon/free/png-256/free-shopify-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-6-pack-logos-icons-3030000.png",
        category: "E-commerce",
        featured: true
    },
    {
        name: "Agile CRM",
        description: "Integrate Tidio with Agile CRM and create new contacts straight from the conversation on Tidio.",
        icon: "https://cdn.iconscout.com/icon/free/png-256/free-agile-crm-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-1-pack-logos-icons-3029858.png",
        category: "CRM"
    },
    {
        name: "Zendesk Sell",
        description: "Integrate Tidio with Zendesk Sell and create new leads straight from the conversation on Tidio.",
        icon: "https://cdn.iconscout.com/icon/free/png-256/free-zendesk-logo-icon-download-in-svg-png-gif-file-formats--brand-development-tools-pack-logos-icons-226528.png",
        category: "CRM"
    },
    {
        name: "Zapier",
        description: "Connect Tidio with over 1000 apps using Zapier. With this integration, you can make sure every valuable contact will be sent to your CRM, or any other tool...",
        icon: "https://cdn.iconscout.com/icon/free/png-256/free-zapier-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-7-pack-logos-icons-3030018.png",
        category: "Marketing automation"
    },
    {
        name: "Google Analytics",
        description: "Thanks to integration with Google Analytics you will be able to easily follow events such as \"started chat\", \"finished chat\" in your Analytics panel.",
        icon: "https://cdn.iconscout.com/icon/free/png-256/free-google-analytics-logo-icon-download-in-svg-png-gif-file-formats--brand-development-tools-pack-logos-icons-226109.png",
        category: "BI & analytics"
    },
    {
        name: "Pipedrive",
        description: "Integrate Tidio with Pipedrive and create new deals straight from the conversation on Tidio.",
        icon: "https://cdn.iconscout.com/icon/free/png-256/free-pipedrive-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-5-pack-logos-icons-3029968.png",
        category: "CRM"
    },
    {
        name: "Zendesk",
        description: "Integration with Zendesk allows you to easily create new tickets, directly from the chat window. Simply click on \"create a ticket\" during your conversation.",
        icon: "https://cdn.iconscout.com/icon/free/png-256/free-zendesk-logo-icon-download-in-svg-png-gif-file-formats--brand-development-tools-pack-logos-icons-226528.png",
        category: "Customer support"
    },
    {
        name: "Klaviyo",
        description: "Connect Tidio with Klaviyo and automatically add new subscribers from the pre-chat survey to your mailing list in Klaviyo.",
        icon: "https://cdn.iconscout.com/icon/free/png-256/free-klaviyo-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-4-pack-logos-icons-3029928.png",
        category: "Marketing automation"
    },
    {
        name: "Mailchimp",
        description: "Connect Tidio with Mailchimp and automatically add new subscribers to your mailing list in Mailchimp",
        icon: "https://cdn.iconscout.com/icon/free/png-256/free-mailchimp-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-4-pack-logos-icons-3029948.png",
        category: "Marketing automation"
    },
    {
        name: "Judge.me",
        description: "Connect Judge.me to Tidio to collect more reviews and build trust with your customers.",
        icon: "https://cdn.iconscout.com/icon/free/png-256/free-judge-me-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-4-pack-logos-icons-3029924.png",
        category: "Rating & reviews"
    },
    {
        name: "ActiveCampaign",
        description: "Connect Tidio with ActiveCampaign and automatically add new subscribers to your mailing list in ActiveCampaign",
        icon: "https://cdn.iconscout.com/icon/free/png-256/free-active-campaign-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-1-pack-logos-icons-3029854.png",
        category: "Marketing automation"
    },
    {
        name: "Omnisend",
        description: "Connect Tidio with Omnisend and automatically add new subscribers to your mailing list in Omnisend",
        icon: "https://cdn.iconscout.com/icon/free/png-256/free-omnisend-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-5-pack-logos-icons-3029958.png",
        category: "Marketing automation"
    },
    {
        name: "MailerLite",
        description: "Connect Tidio with MailerLite and automatically add new subscribers to your mailing list in MailerLite",
        icon: "https://cdn.iconscout.com/icon/free/png-256/free-mailerlite-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-4-pack-logos-icons-3029949.png",
        category: "Marketing automation"
    }
];

export default function IntegrationsPage() {
    const { data: session } = useSession();
    const [activeCategory, setActiveCategory] = useState("All integrations");
    const [searchQuery, setSearchQuery] = useState("");

    // Shopify Modal State
    const [isShopifyModalOpen, setIsShopifyModalOpen] = useState(false);
    const [shopUrl, setShopUrl] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);

    const filteredIntegrations = INTEGRATIONS.filter(integration => {
        const matchesCategory = activeCategory === "All integrations" || integration.category === activeCategory;
        const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleConnect = (integrationName: string) => {
        if (integrationName === "Shopify") {
            setIsShopifyModalOpen(true);
        } else {
            toast.info(`${integrationName} integration coming soon!`);
        }
    };

    const handleShopifySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsConnecting(true);

        // Redirect to OAuth login
        const cleanShopUrl = shopUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
        window.location.href = `/api/auth/shopify?shop=${cleanShopUrl}`;
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-[#001B38]">Integrations</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center text-[10px] font-bold text-blue-600">5</div>
                        <span>days left in your full-featured trial</span>
                    </div>
                </div>
                <button className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Upgrade
                </button>
            </div>

            <div className="flex gap-8">
                {/* Sidebar Navigation */}
                <div className="w-64 flex-shrink-0">
                    <div className="mb-6">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Categories</h3>
                        <nav className="space-y-1">
                            {CATEGORIES.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeCategory === category
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </nav>

                        <div className="mt-8 pt-4 border-t border-gray-200">
                            <button className="w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg flex items-center justify-between">
                                My integrations
                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">1</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-[#001B38]">All integrations</h2>
                                <p className="text-gray-500 text-sm mt-1">View your installed integrations and stay up to date with any feature updates.</p>
                            </div>
                            <div className="relative w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search for integration"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredIntegrations.map((integration) => (
                                <div
                                    key={integration.name}
                                    onClick={() => handleConnect(integration.name)}
                                    className={`border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer group h-full flex flex-col ${integration.name === 'Shopify' ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                                >
                                    <div className="w-12 h-12 mb-4">
                                        <img src={integration.icon} alt={integration.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-[#001B38]">{integration.name}</h3>
                                        {integration.name === 'Shopify' && (
                                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">RECOMMENDED</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-4 flex-1">
                                        {integration.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer CTA */}
                    <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-between border border-gray-200">
                        <div>
                            <h3 className="text-lg font-bold text-[#001B38] mb-2">Can't find what you need?</h3>
                            <p className="text-sm text-gray-600">
                                Visit our OpenAPI documentation to learn about Tidio API capabilities. You can also submit your request and influence which integration we will develop next.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                            <button className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors text-sm">
                                Submit a request
                            </button>
                            <button className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors text-sm">
                                Build your own integration
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                        <Link href="#" className="hover:underline flex items-center gap-1">
                            Developer portal <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Shopify Connection Modal */}
            {isShopifyModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsShopifyModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-[#95BF47]/10 rounded-lg flex items-center justify-center">
                                <img
                                    src="https://cdn.iconscout.com/icon/free/png-256/free-shopify-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-6-pack-logos-icons-3030000.png"
                                    alt="Shopify"
                                    className="w-6 h-6"
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#001B38]">Connect Shopify</h3>
                                <p className="text-sm text-gray-500">Install Tsukai on your store</p>
                            </div>
                        </div>

                        <form onSubmit={handleShopifySubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Shop URL
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        placeholder="your-store.myshopify.com"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        value={shopUrl}
                                        onChange={(e) => setShopUrl(e.target.value)}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Enter your myshopify.com domain</p>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isConnecting}
                                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isConnecting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Connecting...
                                        </>
                                    ) : (
                                        "Connect Store"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Chat Widget Button (Visual only) */}
            <div className="fixed bottom-6 right-6">
                <button className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors">
                    <MessageSquare className="w-7 h-7" />
                </button>
            </div>
        </div>
    );
}
