"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bot, Plus, Search, MoreVertical, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface BotType {
  id: number;
  name: string;
  domain: string | null;
  settings: any;
  createdAt: string;
  ownerId: number;
}

export default function BotsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [bots, setBots] = useState<BotType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchBots();
    }
  }, [session]);

  const fetchBots = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/bots", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bots");
      }

      const data = await response.json();
      setBots(data);
    } catch (error) {
      toast.error("Failed to load bots");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBot = async (botId: number) => {
    if (!confirm("Are you sure you want to delete this bot? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/bots?id=${botId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete bot");
      }

      toast.success("Bot deleted successfully");
      fetchBots();
    } catch (error) {
      toast.error("Failed to delete bot");
      console.error(error);
    }
  };

  const filteredBots = bots.filter(
    (bot) =>
      bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bot.domain && bot.domain.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isPending || (session?.user && isLoading)) {
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#001B38] mb-2">Your Bots</h1>
              <p className="text-gray-600">Manage your AI customer service agents</p>
            </div>
            <Link
              href="/bots/create"
              className="flex items-center gap-2 bg-[#5FD885] text-[#001B38] px-6 py-3 rounded-lg font-semibold hover:bg-[#4CD964] transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create New Bot
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search bots by name or domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5FD885] focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Bots Grid */}
        {filteredBots.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Bot className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {searchQuery ? "No bots found" : "No bots yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Create your first AI bot to start handling customer inquiries"}
              </p>
              {!searchQuery && (
                <Link
                  href="/bots/create"
                  className="inline-flex items-center gap-2 bg-[#5FD885] text-[#001B38] px-6 py-3 rounded-lg font-semibold hover:bg-[#4CD964] transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Create Your First Bot
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBots.map((bot) => (
              <div
                key={bot.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Bot className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/bots/${bot.id}/settings`}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Settings className="h-4 w-4 text-gray-600" />
                    </Link>
                    <button
                      onClick={() => handleDeleteBot(bot.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{bot.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {bot.domain || "No domain configured"}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    Created {new Date(bot.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/bots/${bot.id}`}
                    className="text-sm font-semibold text-[#5FD885] hover:text-[#4CD964]"
                  >
                    Manage →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
