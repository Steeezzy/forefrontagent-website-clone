"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bot,
  MessageSquare,
  BarChart3,
  Settings,
  Users,
  Workflow,
  Mail,
  Globe,
  PlusCircle,
  AlertCircle,
  CheckCircle,
  MessageCircle,
  Ticket
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("interactions");

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#001B38]">Dashboard</h1>
          <div className="flex items-center gap-4">
            {/* Add header actions if needed */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Setup Banner */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="#E5E7EB"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="#5FD885"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="125.6"
                      strokeDashoffset="62.8" // 50% progress
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">3/6</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#001B38]">Finalize your Forefront setup</h3>
                  <p className="text-sm text-gray-500">Let's get you setup to delight your customers. It's super easy and only takes a few minutes.</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors text-sm">
                Complete onboarding
              </button>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-bold text-[#001B38] mb-4">Quick actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/dashboard/inbox" className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition-colors flex items-start gap-3 group">
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                    <MessageCircle className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#001B38]">Live conversations</h3>
                    <p className="text-sm text-blue-600">0 unassigned</p>
                  </div>
                </Link>

                <Link href="/dashboard/tickets" className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition-colors flex items-start gap-3 group">
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                    <Ticket className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#001B38]">Tickets</h3>
                    <p className="text-sm text-blue-600">0 unassigned</p>
                  </div>
                </Link>

                <Link href="/dashboard/ai-hub" className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition-colors flex items-start gap-3 group">
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                    <Bot className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#001B38]">Tsukai AI Agent</h3>
                    <p className="text-sm text-blue-600">0 unanswered questions</p>
                  </div>
                </Link>

                <Link href="/dashboard/flows" className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition-colors flex items-start gap-3 group">
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                    <Workflow className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#001B38]">Flows</h3>
                    <p className="text-sm text-blue-600">1 active Flow</p>
                  </div>
                </Link>

                <Link href="/dashboard/visitors" className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition-colors flex items-start gap-3 group md:col-span-2">
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                    <Users className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#001B38]">Live visitors</h3>
                    <p className="text-sm text-blue-600">0 live visitors on your site</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Performance */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-[#001B38]">Performance</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-md border border-gray-200">
                  <span>01 Nov 2025 - 30 Nov 2025</span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex border-b border-gray-200 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("interactions")}
                    className={cn(
                      "flex-1 py-4 px-6 text-left min-w-[200px] border-b-2 transition-colors",
                      activeTab === "interactions" ? "border-blue-600 bg-blue-50/30" : "border-transparent hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      Interactions <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold">?</span>
                    </div>
                    <div className="text-2xl font-bold text-[#001B38]">0</div>
                  </button>

                  <button
                    onClick={() => setActiveTab("resolution")}
                    className={cn(
                      "flex-1 py-4 px-6 text-left min-w-[200px] border-b-2 transition-colors",
                      activeTab === "resolution" ? "border-blue-600 bg-blue-50/30" : "border-transparent hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      Tsukai AI Agent resolution rate <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold">?</span>
                    </div>
                    <div className="text-2xl font-bold text-[#001B38]">0%</div>
                  </button>

                  <button
                    onClick={() => setActiveTab("sales")}
                    className={cn(
                      "flex-1 py-4 px-6 text-left min-w-[200px] border-b-2 transition-colors",
                      activeTab === "sales" ? "border-blue-600 bg-blue-50/30" : "border-transparent hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      Sales assisted <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold">?</span>
                    </div>
                    <div className="text-2xl font-bold text-[#001B38]">0</div>
                  </button>

                  <button
                    onClick={() => setActiveTab("leads")}
                    className={cn(
                      "flex-1 py-4 px-6 text-left min-w-[200px] border-b-2 transition-colors",
                      activeTab === "leads" ? "border-blue-600 bg-blue-50/30" : "border-transparent hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      Leads acquired <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold">?</span>
                    </div>
                    <div className="text-2xl font-bold text-[#001B38]">0</div>
                  </button>
                </div>

                <div className="p-6 h-[300px] flex items-center justify-center relative">
                  {/* Chart Placeholder - Horizontal Lines */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-full h-px bg-gray-100"></div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="absolute top-6 left-6 flex gap-6">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      Replied live conversations
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      Replied tickets
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      Flows interactions
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                      Tsukai AI Agent conversations
                    </div>
                  </div>

                  <div className="text-gray-400 text-sm">No data available for this period</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-8">

            {/* Project Status */}
            <div>
              <h2 className="text-lg font-bold text-[#001B38] mb-4">Project status</h2>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">

                <div className="flex gap-3">
                  <div className="mt-1">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#001B38]">Chat Widget</h3>
                    <p className="text-sm text-gray-500 mb-1">Chat Widget is not installed</p>
                    <Link href="/settings/installation" className="text-sm text-blue-600 hover:underline">Install Chat Widget</Link>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-1">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#001B38]">Mailbox</h3>
                    <Link href="/settings/mailbox" className="text-sm text-blue-600 hover:underline">Connect your mailbox</Link>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-1">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#001B38]">Domains</h3>
                    <Link href="/settings/domains" className="text-sm text-blue-600 hover:underline">Connect domain</Link>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Add a channel:</span>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 cursor-pointer">
                        <MessageCircle className="w-3 h-3" />
                      </div>
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 cursor-pointer">
                        <Bot className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Current Usage */}
            <div>
              <h2 className="text-lg font-bold text-[#001B38] mb-4">Current usage</h2>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-[#001B38]">Customer service</h3>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Free trial</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold text-[#001B38]">0</span>
                    <span className="text-gray-400">/ ∞</span>
                  </div>
                  <Link href="/settings/installation" className="text-sm text-blue-600 hover:underline">Install Chat Widget to see this</Link>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-[#001B38]">Tsukai AI Agent</h3>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Free trial</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold text-[#001B38]">0</span>
                    <span className="text-gray-400">/ 50</span>
                  </div>
                  <p className="text-xs text-gray-500">50 Tsukai AI Agent conversations (lifetime)</p>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-[#001B38]">Flows</h3>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Free trial</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold text-[#001B38]">0</span>
                    <span className="text-gray-400">/ ∞</span>
                  </div>
                  <p className="text-xs text-gray-500">Unlimited visitors reached</p>
                  <p className="text-xs text-gray-400">Limited to 100 monthly after the trial</p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
