"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { User, MessageSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Conversation {
    id: number;
    sessionId: string | null;
    createdAt: string;
    lastMessage?: string; // We might need to fetch this or derive it
}

interface ConversationListProps {
    botId: number;
}

export function ConversationList({ botId }: ConversationListProps) {
    const params = useParams();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (botId) {
            fetchConversations();
        }
    }, [botId]);

    const fetchConversations = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("bearer_token");
            const res = await fetch(`/api/bots/${botId}/conversations?limit=50`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setConversations(data);
        } catch (error) {
            console.error("Failed to fetch conversations", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-80 border-r border-gray-200 h-full flex flex-col bg-white">
            <div className="p-4 border-b border-gray-100">
                <h2 className="font-bold text-lg text-gray-900">Inbox</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="p-4 text-center text-gray-500">Loading...</div>
                ) : conversations.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No conversations yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {conversations.map((conv) => {
                            const isActive = Number(params.conversationId) === conv.id;
                            return (
                                <Link
                                    key={conv.id}
                                    href={`/dashboard/inbox/conversations/${conv.id}`}
                                    className={cn(
                                        "block p-4 hover:bg-gray-50 transition-colors",
                                        isActive && "bg-blue-50 hover:bg-blue-50"
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            <User className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <p className="font-medium text-gray-900 truncate">
                                                    Visitor #{conv.id}
                                                </p>
                                                <span className="text-xs text-gray-400 flex-shrink-0">
                                                    {new Date(conv.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate">
                                                {conv.sessionId ? `Session: ${conv.sessionId}` : "No session ID"}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
