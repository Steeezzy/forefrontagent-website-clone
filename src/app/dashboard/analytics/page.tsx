"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { CircleHelp, ChartBar, TrendingUp } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

interface BotType {
    id: number;
    name: string;
}

export default function AnalyticsPage() {
    const { data: session } = useSession();
    const [bots, setBots] = useState<BotType[]>([]);
    const [selectedBot, setSelectedBot] = useState<BotType | null>(null);
    const [dateRange, setDateRange] = useState("01 Nov 2025 - 30 Nov 2025");

    useEffect(() => {
        if (session?.user) {
            fetchBots();
        }
    }, [session]);

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

    // Placeholder data for the chart
    const data = [
        { name: 'Nov 1', value: 0 },
        { name: 'Nov 5', value: 0 },
        { name: 'Nov 9', value: 0 },
        { name: 'Nov 13', value: 0 },
        { name: 'Nov 17', value: 0 },
        { name: 'Nov 21', value: 0 },
        { name: 'Nov 25', value: 0 },
        { name: 'Nov 29', value: 0 },
    ];

    return (
        <div className="p-8 max-w-[1600px] mx-auto bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-[#001B38]">Analytics</h1>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">Paid</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center text-[10px] font-bold text-blue-600">5</div>
                        <span>days left in your full-featured trial</span>
                    </div>
                    <button className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Upgrade
                    </button>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-bold text-[#001B38] mb-6">Overview</h2>

                <div className="mb-6">
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                        <span className="text-gray-500">📅</span> {dateRange}
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
                        <div className="p-6 relative group cursor-pointer hover:bg-gray-50 transition-colors border-b-2 border-blue-600">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-blue-600">Interactions</span>
                                <CircleHelp className="w-3 h-3 text-gray-400" />
                            </div>
                            <div className="text-3xl font-bold text-[#001B38]">0</div>
                        </div>

                        <div className="p-6 relative group cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-600">Tsukai AI Agent resolution rate</span>
                                <CircleHelp className="w-3 h-3 text-gray-400" />
                            </div>
                            <div className="text-3xl font-bold text-[#001B38]">0%</div>
                        </div>

                        <div className="p-6 relative group cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-600">Sales assisted</span>
                                <CircleHelp className="w-3 h-3 text-gray-400" />
                            </div>
                            <div className="text-3xl font-bold text-[#001B38]">0</div>
                        </div>

                        <div className="p-6 relative group cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-600">Leads acquired</span>
                                <CircleHelp className="w-3 h-3 text-gray-400" />
                            </div>
                            <div className="text-3xl font-bold text-[#001B38]">0</div>
                        </div>
                    </div>

                    {/* Chart Legend */}
                    <div className="px-6 py-4 flex items-center gap-6 border-b border-gray-50">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                            <span className="text-xs text-gray-500">Replied live conversations</span>
                            <CircleHelp className="w-3 h-3 text-gray-300" />
                            <span className="text-sm font-medium text-[#001B38] ml-1">0</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                            <span className="text-xs text-gray-500">Replied tickets</span>
                            <CircleHelp className="w-3 h-3 text-gray-300" />
                            <span className="text-sm font-medium text-[#001B38] ml-1">0</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                            <span className="text-xs text-gray-500">Flows interactions</span>
                            <CircleHelp className="w-3 h-3 text-gray-300" />
                            <span className="text-sm font-medium text-[#001B38] ml-1">0</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                            <span className="text-xs text-gray-500">Tsukai AI Agent conversations</span>
                            <CircleHelp className="w-3 h-3 text-gray-300" />
                            <span className="text-sm font-medium text-[#001B38] ml-1">0</span>
                        </div>

                        <div className="ml-auto flex items-center gap-2">
                            <button className="p-1.5 bg-blue-100 text-blue-600 rounded">
                                <ChartBar className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded">
                                <TrendingUp className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Chart Area */}
                    <div className="h-[400px] w-full p-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                                    domain={[0, 10]}
                                    ticks={[0, 2, 4, 6, 8, 10]}
                                />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    fill="#3b82f6"
                                    fillOpacity={0.1}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
