"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import {
    Bot,
    BookOpen,
    MessageSquare,
    Settings,
    Plus,
    Trash2,
    Save,
    Upload,
    FileText,
    Globe
} from "lucide-react";
import { toast } from "sonner";
import ChatWindow from "@/components/widget/ChatWindow";

interface BotType {
    id: number;
    name: string;
    domain: string | null;
    settings: any;
}

interface KnowledgeItem {
    id: number;
    sourceType: string;
    sourceUrl: string | null;
    createdAt: string;
}

export default function AIHubPage() {
    const { data: session } = useSession();
    const [bots, setBots] = useState<BotType[]>([]);
    const [selectedBot, setSelectedBot] = useState<BotType | null>(null);
    const [activeTab, setActiveTab] = useState<"knowledge" | "personality" | "playground">("knowledge");

    // Knowledge Base State
    const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // Personality State
    const [systemPrompt, setSystemPrompt] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (session?.user) {
            fetchBots();
        }
    }, [session]);

    useEffect(() => {
        if (selectedBot) {
            fetchKnowledge();
            setSystemPrompt(selectedBot.settings?.system_prompt || "");
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
                setSelectedBot(data[0]); // Default to first bot
            }
        } catch (error) {
            console.error("Failed to fetch bots", error);
        }
    };

    const fetchKnowledge = async () => {
        if (!selectedBot) return;
        try {
            const token = localStorage.getItem("bearer_token");
            const res = await fetch(`/api/bots/${selectedBot.id}/knowledge`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setKnowledge(data);
        } catch (error) {
            console.error("Failed to fetch knowledge", error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedBot || !e.target.files?.[0]) return;

        setIsUploading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
            const token = localStorage.getItem("bearer_token");
            const res = await fetch(`/api/bots/${selectedBot.id}/knowledge/upload`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (!res.ok) throw new Error("Upload failed");

            toast.success("File uploaded successfully");
            fetchKnowledge();
        } catch (error) {
            toast.error("Failed to upload file");
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteKnowledge = async (id: number) => {
        if (!selectedBot) return;
        try {
            const token = localStorage.getItem("bearer_token");
            await fetch(`/api/bots/${selectedBot.id}/knowledge?id=${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Knowledge deleted");
            fetchKnowledge();
        } catch (error) {
            toast.error("Failed to delete knowledge");
        }
    };

    const handleSavePersonality = async () => {
        if (!selectedBot) return;
        setIsSaving(true);
        try {
            const token = localStorage.getItem("bearer_token");
            const updatedSettings = { ...selectedBot.settings, system_prompt: systemPrompt };

            const res = await fetch(`/api/bots?id=${selectedBot.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ settings: updatedSettings })
            });

            if (!res.ok) throw new Error("Update failed");

            // Update local state
            setSelectedBot(prev => prev ? { ...prev, settings: updatedSettings } : null);
            setBots(prev => prev.map(b => b.id === selectedBot.id ? { ...b, settings: updatedSettings } : b));

            toast.success("Personality saved");
        } catch (error) {
            toast.error("Failed to save personality");
        } finally {
            setIsSaving(false);
        }
    };

    if (!selectedBot && bots.length === 0) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold mb-4">No Bots Found</h2>
                <p className="text-gray-600 mb-4">Create a bot to get started with Lyro AI.</p>
                {/* Add link to create bot */}
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#001B38] mb-2">Lyro AI Hub</h1>
                    <p className="text-gray-600">Manage your AI agent's knowledge and personality</p>
                </div>

                {/* Bot Selector */}
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

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-8">
                <button
                    onClick={() => setActiveTab("knowledge")}
                    className={`pb-4 px-2 font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === "knowledge"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <BookOpen className="h-4 w-4" />
                    Knowledge Base
                </button>
                <button
                    onClick={() => setActiveTab("personality")}
                    className={`pb-4 px-2 font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === "personality"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <Settings className="h-4 w-4" />
                    Personality
                </button>
                <button
                    onClick={() => setActiveTab("playground")}
                    className={`pb-4 px-2 font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === "playground"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <MessageSquare className="h-4 w-4" />
                    Playground
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[500px]">

                {/* Knowledge Base Tab */}
                {activeTab === "knowledge" && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Knowledge Sources</h3>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    disabled={isUploading}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isUploading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <Upload className="h-4 w-4" />
                                    )}
                                    Upload File
                                </label>
                            </div>
                        </div>

                        {knowledge.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">No knowledge added yet</p>
                                <p className="text-sm text-gray-400 mt-1">Upload PDF, TXT, or MD files to train your bot</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {knowledge.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 rounded-lg">
                                                {item.sourceType === 'url' ? <Globe className="h-5 w-5 text-blue-500" /> : <FileText className="h-5 w-5 text-blue-500" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{item.sourceUrl || "Uploaded File"}</p>
                                                <p className="text-xs text-gray-500">Added on {new Date(item.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteKnowledge(item.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Personality Tab */}
                {activeTab === "personality" && (
                    <div className="p-6">
                        <div className="max-w-3xl">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">System Prompt</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Define how your AI agent should behave, its tone of voice, and any specific instructions it should follow.
                            </p>
                            <textarea
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm mb-4"
                                placeholder="You are a helpful customer support agent..."
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSavePersonality}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Playground Tab */}
                {activeTab === "playground" && selectedBot && (
                    <div className="h-[600px] p-6">
                        <ChatWindow
                            botId={selectedBot.id.toString()}
                            botName={selectedBot.name}
                        />
                    </div>
                )}

            </div>
        </div>
    );
}
