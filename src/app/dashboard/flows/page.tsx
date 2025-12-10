"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Zap, Plus, Edit, Trash2, MoreHorizontal, ArrowRight, Bot, Play } from "lucide-react";
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
        <div className="p-8 max-w-[1600px] mx-auto bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#001B38] mb-1">Flows</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Active Bot:</span>
                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        Create from scratch
                    </Link>
                </div>
            </div>

            {/* Reduce Support Volume Banner */}
            <div className="bg-gradient-to-r from-[#E6F0FF] to-[#F0F7FF] rounded-xl border border-blue-100 p-6 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-sm">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#001B38] text-lg">Reduce your support volume</h3>
                        <p className="text-gray-600">Tsukai AI Bot solves up to 70% of customer questions. Set it up in minutes.</p>
                    </div>
                </div>
                <button className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    Use Tsukai AI Bot
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading flows...</p>
                </div>
            ) : flows.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center min-h-[500px]">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 relative">
                        <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-pulse"></div>
                        <Zap className="h-10 w-10 text-blue-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-[#001B38] mb-3">Welcome to Flows</h2>
                    <p className="text-gray-500 mb-8 max-w-lg text-center text-lg">
                        Automate your customer service and increase sales with custom workflows.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                        <Link
                            href={selectedBot ? `/bots/${selectedBot.id}/flows/create` : "#"}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm ${!selectedBot ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Plus className="h-5 w-5" />
                            Add Support Flow
                        </Link>
                        <Link
                            href={selectedBot ? `/bots/${selectedBot.id}/flows/create?type=sales` : "#"}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium ${!selectedBot ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Plus className="h-5 w-5" />
                            Add Sales Flow
                        </Link>
                    </div>

                    <div className="mt-12 opacity-50 pointer-events-none select-none">
                        {/* Abstract Flow Illustration */}
                        <div className="flex items-center gap-4">
                            <div className="w-32 h-20 bg-gray-100 rounded-lg border border-gray-200"></div>
                            <ArrowRight className="text-gray-300" />
                            <div className="w-32 h-20 bg-gray-100 rounded-lg border border-gray-200"></div>
                            <ArrowRight className="text-gray-300" />
                            <div className="w-32 h-20 bg-gray-100 rounded-lg border border-gray-200"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {flows.map((flow) => (
                        <div key={flow.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-600">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteFlow(flow.id);
                                        }}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-[#001B38] mb-1">{flow.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Created on {new Date(flow.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
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
