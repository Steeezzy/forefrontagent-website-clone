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
    Globe,
    Mail,
    HelpCircle,
    Database,
    ShoppingBag,
    ArrowUpRight,
    ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import ChatWindow from "@/components/widget/ChatWindow";
import Link from "next/link";

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
    const [activeTab, setActiveTab] = useState<"hub" | "knowledge" | "personality" | "playground">("hub");

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
                <p className="text-gray-600 mb-4">Create a bot to get started with Tsukai AI.</p>
                {/* Add link to create bot */}
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1600px] mx-auto bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#001B38] mb-1">Tsukai AI Agent</h1>
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-blue-600 text-sm font-medium flex items-center gap-1">
                        <ArrowUpRight className="w-4 h-4" />
                        View full analytics
                    </button>
                    <button className="bg-[#5FD885] text-[#001B38] px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#4ecb74] transition-colors">
                        Upgrade
                    </button>
                </div>
            </div>

            {/* Navigation Tabs (Simulated Sidebar for now) */}
            <div className="flex gap-1 bg-gray-200/50 p-1 rounded-lg w-fit mb-8">
                <button
                    onClick={() => setActiveTab("hub")}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "hub" ? "bg-white text-[#001B38] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                    Hub
                </button>
                <button
                    onClick={() => setActiveTab("knowledge")}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "knowledge" ? "bg-white text-[#001B38] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                    Knowledge
                </button>
                <button
                    onClick={() => setActiveTab("personality")}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "personality" ? "bg-white text-[#001B38] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                    Configure
                </button>
                <button
                    onClick={() => setActiveTab("playground")}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "playground" ? "bg-white text-[#001B38] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                    Playground
                </button>
            </div>

            {activeTab === "hub" && (
                <div className="space-y-8">
                    {/* Performance */}
                    <div>
                        <h2 className="text-lg font-bold text-[#001B38] mb-4">Performance</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-6">
                                    <h3 className="font-semibold text-gray-700">Live conversations</h3>
                                    <HelpCircle className="w-4 h-4 text-gray-400" />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">All conversations</p>
                                        <p className="text-2xl font-bold text-[#001B38]">—</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Resolved</p>
                                        <p className="text-2xl font-bold text-[#001B38]">—</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Resolution rate</p>
                                        <p className="text-2xl font-bold text-[#001B38]">—</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-6">
                                    <h3 className="font-semibold text-gray-700">Emails</h3>
                                    <HelpCircle className="w-4 h-4 text-gray-400" />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">All emails</p>
                                        <p className="text-2xl font-bold text-[#001B38]">—</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Resolution rate</p>
                                        <p className="text-2xl font-bold text-[#001B38]">—</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">First-answer rate</p>
                                        <p className="text-2xl font-bold text-[#001B38]">—</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Settings Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-[#001B38]">Conversations limit: 0 / 50</span>
                                    <HelpCircle className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                            <button className="text-blue-600 text-sm font-medium hover:underline">Upgrade</button>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-[#001B38]">Tsukai responds on:</span>
                                <div className="flex gap-2 text-gray-400">
                                    <MessageSquare className="w-5 h-5" />
                                    <Mail className="w-5 h-5" />
                                </div>
                            </div>
                            <button onClick={() => setActiveTab("personality")} className="text-blue-600 text-sm font-medium hover:underline">Configure</button>
                        </div>
                    </div>

                    {/* Knowledge */}
                    <div>
                        <h2 className="text-lg font-bold text-[#001B38] mb-4">Knowledge</h2>

                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="24" cy="24" r="20" stroke="#E5E7EB" strokeWidth="4" fill="none" />
                                        <circle cx="24" cy="24" r="20" stroke="#E5E7EB" strokeWidth="4" fill="none" strokeDasharray="125.6" strokeDashoffset="100" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-[#001B38]">We're gathering knowledge score data</h3>
                                        <HelpCircle className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <p className="text-sm text-gray-500">The score will appear once Tsukai encounters questions it can't answer. Check back soon!</p>
                                </div>
                            </div>
                            <button onClick={() => setActiveTab("knowledge")} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-100 transition-colors">
                                Add knowledge
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <HelpCircle className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#001B38]">Suggestions</h3>
                                        <p className="text-sm text-gray-500">Knowledge to add from unanswered questions and past Inbox conversations</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-[#001B38]">0 questions to review</span>
                                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Manage</button>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Globe className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#001B38]">Website URL</h3>
                                        <p className="text-sm text-gray-500">Content imported from URLs, like knowledge bases or websites</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-[#001B38]">{knowledge.filter(k => k.sourceType === 'url').length} page</span>
                                    <button onClick={() => setActiveTab("knowledge")} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Manage</button>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <FileText className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#001B38]">Q&A</h3>
                                        <p className="text-sm text-gray-500">Questions and answers content</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-[#001B38]">0 questions and answers</span>
                                    <button onClick={() => setActiveTab("knowledge")} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Manage</button>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <Database className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-[#001B38]">Product database</h3>
                                            <span className="bg-[#5FD885] text-[#001B38] text-[10px] font-bold px-1.5 py-0.5 rounded">BETA</span>
                                        </div>
                                        <p className="text-sm text-gray-500">Content from your products used for product recommendation</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-[#001B38]">0 products</span>
                                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Manage</button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link href="#" className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline">
                                <BookOpen className="w-4 h-4" />
                                How to effectively add data sources
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Knowledge Base Tab */}
            {activeTab === "knowledge" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] p-6">
                    <ChatWindow
                        botId={selectedBot.id.toString()}
                        botName={selectedBot.name}
                    />
                </div>
            )}

        </div>
    );
}
