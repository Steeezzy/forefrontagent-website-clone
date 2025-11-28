"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { ConversationList } from "@/components/inbox/ConversationList";

interface BotType {
    id: number;
    name: string;
}

export default function InboxLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session } = useSession();
    const [bots, setBots] = useState<BotType[]>([]);
    const [selectedBot, setSelectedBot] = useState<BotType | null>(null);

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

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* Sidebar for Conversations */}
            <div className="w-80 border-r border-gray-200 flex flex-col bg-white flex-shrink-0">
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="font-bold text-lg text-gray-900">Inbox</h2>
                    </div>

                    {/* Bot Selector */}
                    <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm font-medium"
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

                <div className="flex-1 overflow-hidden">
                    {selectedBot && <ConversationList botId={selectedBot.id} />}
                </div>
            </div>

            {/* Main Content (Chat) */}
            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                {children}
            </div>
        </div>
    );
}
