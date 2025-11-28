"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Plug, CheckCircle, Plus, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface BotType {
    id: number;
    name: string;
}

interface Integration {
    id: number;
    type: string;
    createdAt: string;
    config: any;
}

const AVAILABLE_INTEGRATIONS = [
    {
        type: "shopify",
        name: "Shopify",
        description: "Connect your Shopify store to sync products and orders.",
        icon: "https://cdn.iconscout.com/icon/free/png-256/free-shopify-logo-icon-download-in-svg-png-gif-file-formats--brand-social-media-card-technology-logos-icons-1721614.png?f=webp&w=256",
    },
    // Add more integrations here in the future (e.g., WordPress, Zapier)
];

export default function IntegrationsPage() {
    const { data: session } = useSession();
    const [bots, setBots] = useState<BotType[]>([]);
    const [selectedBot, setSelectedBot] = useState<BotType | null>(null);
    const [activeIntegrations, setActiveIntegrations] = useState<Integration[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session?.user) {
            fetchBots();
        }
    }, [session]);

    useEffect(() => {
        if (selectedBot) {
            fetchIntegrations();
        }
    }, [selectedBot]);

    const fetchBots = async () => {
        try {
            const token = localStorage.getItem("bearer_token");
            const res = await fetch("/api/bots?limit=100", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                setBots(data);
                setSelectedBot(data[0]);
            }
        } catch (error) {
            console.error("Failed to fetch bots", error);
        }
    };

    const fetchIntegrations = async () => {
        if (!selectedBot) return;
        setIsLoading(true);
        try {
            const token = localStorage.getItem("bearer_token");
            const res = await fetch(`/api/bots/${selectedBot.id}/integrations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setActiveIntegrations(data);
        } catch (error) {
            console.error("Failed to fetch integrations", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConnect = (type: string) => {
        if (type === "shopify") {
            // Redirect to Shopify auth endpoint
            window.location.href = "/api/integrations/shopify/auth";
        } else {
            toast.info("This integration is coming soon!");
        }
    };

    const handleDisconnect = async (id: number) => {
        if (!selectedBot) return;
        if (!confirm("Are you sure you want to disconnect this integration?")) return;

        try {
            const token = localStorage.getItem("bearer_token");
            await fetch(`/api/bots/${selectedBot.id}/integrations?id=${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Integration disconnected");
            fetchIntegrations();
        } catch (error) {
            toast.error("Failed to disconnect integration");
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#001B38] mb-2">Integrations</h1>
                    <p className="text-gray-600">Connect your AI agent to your favorite tools</p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Active Bot:</span>
                    <select
                        className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm font-medium"
                        value={selectedBot?.id}
                        onChange={(e) => {
                            const bot = bots.find(b => b.id === parseInt(e.target.value));
                            setSelectedBot(bot || null);
                        }}
                    >
                        {bots.map(bot => (
                            <option key={bot.id} value={bot.id}>{bot.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading integrations...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {AVAILABLE_INTEGRATIONS.map((integration) => {
                        const active = activeIntegrations.find(i => i.type === integration.type);

                        return (
                            <div key={integration.type} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="h-12 w-12 rounded-lg bg-gray-50 flex items-center justify-center p-2">
                                        <img src={integration.icon} alt={integration.name} className="h-full w-full object-contain" />
                                    </div>
                                    {active ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <CheckCircle className="h-3 w-3" />
                                            Connected
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                            Not Connected
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-2">{integration.name}</h3>
                                <p className="text-sm text-gray-500 mb-6 flex-1">{integration.description}</p>

                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    {active ? (
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs text-gray-500">
                                                Added on {new Date(active.createdAt).toLocaleDateString()}
                                            </div>
                                            <button
                                                onClick={() => handleDisconnect(active.id)}
                                                className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
                                            >
                                                <Trash2 className="h-4 w-4" /> Disconnect
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleConnect(integration.type)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Connect
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
