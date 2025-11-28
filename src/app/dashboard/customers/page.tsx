"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Users, Search, Download, Mail, Phone, Calendar } from "lucide-react";

interface BotType {
    id: number;
    name: string;
}

interface Lead {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    source: string;
    createdAt: string;
}

export default function CustomersPage() {
    const { data: session } = useSession();
    const [bots, setBots] = useState<BotType[]>([]);
    const [selectedBot, setSelectedBot] = useState<BotType | null>(null);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (session?.user) {
            fetchBots();
        }
    }, [session]);

    useEffect(() => {
        if (selectedBot) {
            fetchLeads();
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

    const fetchLeads = async () => {
        if (!selectedBot) return;
        setIsLoading(true);
        try {
            const token = localStorage.getItem("bearer_token");
            const res = await fetch(`/api/bots/${selectedBot.id}/leads`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setLeads(data);
        } catch (error) {
            console.error("Failed to fetch leads", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone?.includes(searchQuery)
    );

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#001B38] mb-2">Customers</h1>
                    <p className="text-gray-600">View and manage leads captured by your AI agent</p>
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

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <Download className="h-4 w-4" />
                        Export CSV
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Contact Info</th>
                                <th className="px-6 py-4">Source</th>
                                <th className="px-6 py-4">Date Added</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Users className="h-12 w-12 text-gray-300 mb-3" />
                                            <p className="font-medium">No customers found</p>
                                            <p className="text-xs text-gray-400 mt-1">Leads captured by your bot will appear here</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                    {lead.name.charAt(0).toUpperCase()}
                                                </div>
                                                {lead.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                {lead.email && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Mail className="h-3 w-3" />
                                                        {lead.email}
                                                    </div>
                                                )}
                                                {lead.phone && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Phone className="h-3 w-3" />
                                                        {lead.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {lead.source}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(lead.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
