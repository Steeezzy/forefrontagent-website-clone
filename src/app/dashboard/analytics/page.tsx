"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { BarChart3, TrendingUp, MessageSquare, DollarSign, Zap } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from "recharts";

interface BotType {
    id: number;
    name: string;
}

interface UsageRecord {
    date: string;
    tokens: number;
    cost: string;
}

interface UsageData {
    records: UsageRecord[];
    totals: {
        totalTokens: number;
        totalCost: string;
    };
}

export default function AnalyticsPage() {
    const { data: session } = useSession();
    const [bots, setBots] = useState<BotType[]>([]);
    const [selectedBot, setSelectedBot] = useState<BotType | null>(null);
    const [usageData, setUsageData] = useState<UsageData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session?.user) {
            fetchBots();
        }
    }, [session]);

    useEffect(() => {
        if (selectedBot) {
            fetchUsage();
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

    const fetchUsage = async () => {
        if (!selectedBot) return;
        setIsLoading(true);
        try {
            const token = localStorage.getItem("bearer_token");
            const res = await fetch(`/api/bots/${selectedBot.id}/usage?limit=30`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setUsageData(data);
        } catch (error) {
            console.error("Failed to fetch usage", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Process data for charts (reverse to show chronological order)
    const chartData = usageData?.records ? [...usageData.records].reverse() : [];

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#001B38] mb-2">Analytics</h1>
                    <p className="text-gray-600">Monitor your AI agent's performance and usage</p>
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Zap className="h-6 w-6 text-blue-600" />
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> +12%
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                        {usageData?.totals.totalTokens.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-gray-600">Total Tokens Used</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                        ${parseFloat(usageData?.totals.totalCost || "0").toFixed(4)}
                    </p>
                    <p className="text-sm text-gray-600">Estimated Cost</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <MessageSquare className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                        {/* Placeholder for conversation count if not available in usage */}
                        -
                    </p>
                    <p className="text-sm text-gray-600">Total Conversations</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Token Usage Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Token Usage (Last 30 Days)</h3>
                    <div className="h-[300px] w-full">
                        {isLoading ? (
                            <div className="h-full flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                        tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="tokens"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorTokens)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <BarChart3 className="h-12 w-12 mb-2 opacity-20" />
                                <p>No data available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cost Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Daily Cost (Last 30 Days)</h3>
                    <div className="h-[300px] w-full">
                        {isLoading ? (
                            <div className="h-full flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            </div>
                        ) : chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                        tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value: any) => [`$${value}`, "Cost"]}
                                    />
                                    <Bar
                                        dataKey="cost"
                                        fill="#22c55e"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <BarChart3 className="h-12 w-12 mb-2 opacity-20" />
                                <p>No data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
