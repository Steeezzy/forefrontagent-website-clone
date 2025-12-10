"use client";

import {
    MessageSquare,
    CheckCircle,
    Ticket,
    MoreHorizontal,
    Search,
    Filter,
    Inbox,
    User,
    MessageCircle,
    Instagram,
    Facebook
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function InboxPage() {
    const [activeFolder, setActiveFolder] = useState("unassigned");

    return (
        <div className="flex h-[calc(100vh-64px)] bg-white">
            {/* Inbox Sidebar */}
            <div className="w-64 border-r border-gray-200 flex flex-col bg-gray-50/50">
                <div className="p-4">
                    <h2 className="text-lg font-bold text-[#001B38] mb-4 px-2">Inbox</h2>
                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveFolder("unassigned")}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                activeFolder === "unassigned" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:bg-gray-100"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Inbox className="w-4 h-4" />
                                <span>Unassigned</span>
                            </div>
                            <span className="text-xs font-semibold">0</span>
                        </button>

                        <button
                            onClick={() => setActiveFolder("my-open")}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                activeFolder === "my-open" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:bg-gray-100"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <User className="w-4 h-4" />
                                <span>My open</span>
                            </div>
                            <span className="text-xs font-semibold">0</span>
                        </button>

                        <button
                            onClick={() => setActiveFolder("solved")}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                activeFolder === "solved" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:bg-gray-100"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-4 h-4" />
                                <span>Solved</span>
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveFolder("tickets")}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                activeFolder === "tickets" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:bg-gray-100"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Ticket className="w-4 h-4" />
                                <span>Tickets</span>
                            </div>
                            <span className="text-xs font-semibold">0</span>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white">
                {/* Toolbar */}
                <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4 text-gray-400">
                        <Search className="w-4 h-4" />
                        <span className="text-sm">Search...</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Empty State */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-[#001B38] mb-2">No active conversations</h3>
                    <p className="text-gray-500 mb-6 max-w-sm">There are no active conversations in this folder.</p>
                    <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        Simulate a conversation
                    </button>
                </div>
            </div>

            {/* Right Sidebar - Integrations */}
            <div className="w-80 border-l border-gray-200 bg-gray-50/50 p-6 hidden xl:block">
                <div className="mb-6">
                    <h3 className="font-bold text-[#001B38] mb-2">Get started with integrations</h3>
                    <p className="text-sm text-gray-500">Connect your favorite tools to streamline your workflow.</p>
                </div>

                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#25D366] rounded-lg flex items-center justify-center text-white">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#001B38]">WhatsApp</h4>
                                    <p className="text-xs text-gray-500">Connect WhatsApp</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Connect
                        </button>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-lg flex items-center justify-center text-white">
                                    <Instagram className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#001B38]">Instagram</h4>
                                    <p className="text-xs text-gray-500">Connect Instagram</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Connect
                        </button>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#0084FF] rounded-lg flex items-center justify-center text-white">
                                    <Facebook className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#001B38]">Messenger</h4>
                                    <p className="text-xs text-gray-500">Connect Messenger</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Connect
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
