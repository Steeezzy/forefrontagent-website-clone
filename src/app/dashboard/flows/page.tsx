"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Zap, Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface BotType {
    id: number;
    name: string;
}

interface Flow {
    id: number;
    name: string;
    createdAt: string;
    nodes: any;
}

export default function FlowsPage() {
    const { data: session } = useSession();
    const [bots, setBots] = useState<BotType[]>([]);
    const [selectedBot, setSelectedBot] = useState<BotType | null>(null);
    const [flows, setFlows] = useState<Flow[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session?.user) {
            fetchBots();
        }
    }, [session]);

    useEffect(() => {
        if (selectedBot) {
            fetchFlows();
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

    const fetchFlows = async () => {
        if (!selectedBot) return;
        setIsLoading(true);
        try {
            const token = localStorage.getItem("bearer_token");
            const res = await fetch(`/api/bots/${selectedBot.id}/flows`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setFlows(data);
        } catch (error) {
            console.error("Failed to fetch flows", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteFlow = async (id: number) => {
        if (!selectedBot) return;
        try {
            const token = localStorage.getItem("bearer_token");
            await fetch(`/api/bots/${selectedBot.id}/flows?id=${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Flow deleted");
            fetchFlows();
        } catch (error) {
            toast.error("Failed to delete flow");
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#001B38] mb-2">Flows</h1>
                    <p className="text-gray-600">Automate conversations with visual workflows</p>
                </div>

                <div className="flex items-center gap-4">
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

                    <Link
                        href={selectedBot ? `/bots/${selectedBot.id}/flows/create` : "#"}
                        className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm ${!selectedBot ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Plus className="h-4 w-4" />
                        Create Flow
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading flows...</p>
                </div>
            ) : flows.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No flows created yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Create your first flow to automate responses to common customer questions.
                    </p>
                    <Link
                        href={selectedBot ? `/bots/${selectedBot.id}/flows/create` : "#"}
                        className={`inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ${!selectedBot ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Plus className="h-5 w-5" />
                        Create First Flow
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {flows.map((flow) => (
                        <div key={flow.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => handleDeleteFlow(flow.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{flow.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Created on {new Date(flow.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                    Active
                                </span>
                                <Link
                                    href={`/bots/${selectedBot?.id}/flows/${flow.id}`}
                                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                >
                                    Edit <Edit className="h-3 w-3" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
