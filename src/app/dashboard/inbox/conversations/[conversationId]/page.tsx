"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { User, Send, Bot, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    id: number;
    role: string;
    text: string;
    createdAt: string;
}

interface ConversationData {
    conversation: {
        id: number;
        sessionId: string;
        createdAt: string;
    };
    messages: Message[];
}

export default function ConversationPage() {
    const params = useParams();
    const conversationId = params.conversationId;
    const [data, setData] = useState<ConversationData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (conversationId) {
            fetchConversation();
        }
    }, [conversationId]);

    useEffect(() => {
        scrollToBottom();
    }, [data?.messages]);

    const fetchConversation = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("bearer_token");
            const res = await fetch(`/api/conversations/${conversationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (error) {
            console.error("Failed to fetch conversation", error);
        } finally {
            setIsLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        // Optimistic update
        const tempMessage: Message = {
            id: Date.now(),
            role: "assistant", // Operator acts as assistant
            text: newMessage,
            createdAt: new Date().toISOString(),
        };

        setData(prev => prev ? {
            ...prev,
            messages: [...prev.messages, tempMessage]
        } : null);

        setNewMessage("");

        // TODO: Implement actual API call to send message
        // await fetch(...)
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="h-full flex items-center justify-center text-gray-500">
                Conversation not found
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900">Visitor #{data.conversation.id}</h2>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>Started {new Date(data.conversation.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                {data.messages.map((msg) => {
                    const isVisitor = msg.role === "user";
                    return (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex gap-3 max-w-3xl",
                                isVisitor ? "mr-auto" : "ml-auto flex-row-reverse"
                            )}
                        >
                            <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                                isVisitor ? "bg-gray-200 text-gray-600" : "bg-blue-600 text-white"
                            )}>
                                {isVisitor ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </div>

                            <div className={cn(
                                "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                                isVisitor
                                    ? "bg-white text-gray-900 rounded-tl-none"
                                    : "bg-blue-600 text-white rounded-tr-none"
                            )}>
                                {msg.text}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your reply..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
