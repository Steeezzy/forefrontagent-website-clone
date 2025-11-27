"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Bot, MessageSquare, BarChart3, Settings } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001B38] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-8">
          <h1 className="text-3xl font-bold text-[#001B38] mb-2">
            Welcome back, {session.user.name || "User"}!
          </h1>
          <p className="text-gray-600">
            Manage your AI customer service platform
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">0</p>
            <p className="text-sm text-gray-600">Active Bots</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">0</p>
            <p className="text-sm text-gray-600">Conversations</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">This Month</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">0</p>
            <p className="text-sm text-gray-600">Messages</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Settings className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">Status</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">Free</p>
            <p className="text-sm text-gray-600">Plan</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-[#001B38] mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/bots/create"
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#5FD885] hover:bg-gray-50 transition-all group"
            >
              <div className="p-3 bg-[#5FD885] rounded-lg mb-3 group-hover:scale-110 transition-transform">
                <Bot className="h-6 w-6 text-[#001B38]" />
              </div>
              <p className="font-semibold text-gray-900">Create New Bot</p>
              <p className="text-sm text-gray-600 text-center mt-1">
                Set up your AI assistant
              </p>
            </Link>

            <Link
              href="/conversations"
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#5FD885] hover:bg-gray-50 transition-all group"
            >
              <div className="p-3 bg-blue-500 rounded-lg mb-3 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900">View Conversations</p>
              <p className="text-sm text-gray-600 text-center mt-1">
                Monitor customer interactions
              </p>
            </Link>

            <Link
              href="/settings"
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#5FD885] hover:bg-gray-50 transition-all group"
            >
              <div className="p-3 bg-purple-500 rounded-lg mb-3 group-hover:scale-110 transition-transform">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900">Settings</p>
              <p className="text-sm text-gray-600 text-center mt-1">
                Configure your account
              </p>
            </Link>
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-8 bg-gradient-to-br from-[#001B38] to-[#002B4F] rounded-xl shadow-sm p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Getting Started with Forefrontagent</h2>
          <p className="text-gray-300 mb-6">
            Follow these steps to set up your AI-powered customer service platform
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#5FD885] text-[#001B38] rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Create Your First Bot</h3>
                <p className="text-sm text-gray-300">
                  Set up an AI agent to handle customer inquiries
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#5FD885] text-[#001B38] rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Add Knowledge Base</h3>
                <p className="text-sm text-gray-300">
                  Upload FAQs and documents for your bot to learn from
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#5FD885] text-[#001B38] rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Embed Widget</h3>
                <p className="text-sm text-gray-300">
                  Add the chat widget to your website and start helping customers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
