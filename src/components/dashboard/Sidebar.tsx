"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    MessageSquare,
    Bot,
    Workflow,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Plug
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Inbox",
        href: "/dashboard/inbox", // Placeholder for now, or link to conversations
        icon: MessageSquare,
    },
    {
        title: "Lyro AI",
        href: "/dashboard/ai-hub",
        icon: Bot,
    },
    {
        title: "Flows",
        href: "/dashboard/flows",
        icon: Workflow,
    },
    {
        title: "Customers",
        href: "/dashboard/customers",
        icon: Users,
    },
    {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
    },
    {
        title: "Integrations",
        href: "/dashboard/integrations",
        icon: Plug,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/login");
    };

    return (
        <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0 z-50">
            <div className="p-6 border-b border-gray-100">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#001B38] rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        F
                    </div>
                    <span className="font-bold text-xl text-[#001B38]">Forefront</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600" : "text-gray-400")} />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 w-full transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
