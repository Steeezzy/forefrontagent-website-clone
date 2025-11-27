"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Bot, MessageSquare, BookOpen, Zap, Settings, Copy, Check } from "lucide-react";
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

export default function BotDetailPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const params = useParams();
  const botId = params.id as string;
  
  const [bot, setBot] = useState<BotType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user && botId) {
      fetchBot();
    }
  }, [session, botId]);

  const fetchBot = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/bots?id=${botId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bot");
      }

      const data = await response.json();
      setBot(data);
    } catch (error) {
      toast.error("Failed to load bot");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyWidgetCode = () => {
    const widgetCode = `<script>
  (function(){
    window.FA=window.FA||{};
    FA.init=function(opts){
      const i=document.createElement('iframe');
      i.src=opts.host+'/widget/'+opts.botId;
      i.style.cssText='position:fixed;bottom:20px;right:20px;width:400px;height:600px;border:none;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.15);z-index:9999';
      document.body.appendChild(i);
    };
  })();
</script>
<script>
  FA.init({
    host: '${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}',
    botId: '${botId}'
  });
</script>`;
    
    navigator.clipboard.writeText(widgetCode);
    setCopied(true);
    toast.success("Widget code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001B38] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user || !bot) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-8">
          <Link
            href="/bots"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Bots
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-xl">
                <Bot className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#001B38] mb-1">{bot.name}</h1>
                <p className="text-gray-600">{bot.domain || "No domain configured"}</p>
              </div>
            </div>
            <Link
              href={`/bots/${botId}/settings`}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">0</p>
              <p className="text-sm text-gray-600">Total Conversations</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">0</p>
              <p className="text-sm text-gray-600">Knowledge Entries</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">0</p>
              <p className="text-sm text-gray-600">Active Flows</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">0</p>
              <p className="text-sm text-gray-600">Integrations</p>
            </div>
          </div>

          {/* Management Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Knowledge Base */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-bold text-gray-900">Knowledge Base</h2>
                </div>
                <Link
                  href={`/bots/${botId}/knowledge`}
                  className="text-sm font-semibold text-[#5FD885] hover:text-[#4CD964]"
                >
                  Manage →
                </Link>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Train your bot with FAQs, documents, and website content
              </p>
              <Link
                href={`/bots/${botId}/knowledge/add`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
              >
                <BookOpen className="h-4 w-4" />
                Add Knowledge
              </Link>
            </div>

            {/* Conversations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <h2 className="text-lg font-bold text-gray-900">Conversations</h2>
                </div>
                <Link
                  href={`/bots/${botId}/conversations`}
                  className="text-sm font-semibold text-[#5FD885] hover:text-[#4CD964]"
                >
                  View All →
                </Link>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Monitor and manage customer conversations in real-time
              </p>
              <div className="text-center py-8 text-gray-500">
                No conversations yet
              </div>
            </div>

            {/* Flows */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-orange-600" />
                  <h2 className="text-lg font-bold text-gray-900">Flows</h2>
                </div>
                <Link
                  href={`/bots/${botId}/flows`}
                  className="text-sm font-semibold text-[#5FD885] hover:text-[#4CD964]"
                >
                  Manage →
                </Link>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Create automated conversation flows for common scenarios
              </p>
              <Link
                href={`/bots/${botId}/flows/create`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium"
              >
                <Zap className="h-4 w-4" />
                Create Flow
              </Link>
            </div>
          </div>

          {/* Widget Installation */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#001B38] to-[#002B4F] rounded-xl shadow-sm p-6 text-white">
              <h2 className="text-lg font-bold mb-4">Widget Installation</h2>
              <p className="text-sm text-gray-300 mb-6">
                Add this code to your website to embed the chat widget
              </p>
              <div className="bg-black/30 rounded-lg p-4 mb-4 font-mono text-xs overflow-x-auto">
                <code className="text-green-400">
                  {`<script>\n  FA.init({\n    botId: '${botId}'\n  });\n</script>`}
                </code>
              </div>
              <button
                onClick={copyWidgetCode}
                className="w-full flex items-center justify-center gap-2 bg-[#5FD885] text-[#001B38] px-4 py-3 rounded-lg font-semibold hover:bg-[#4CD964] transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Code
                  </>
                )}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-3">Bot Settings</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span className="font-medium text-gray-900">
                    {bot.settings?.language || "English"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tone:</span>
                  <span className="font-medium text-gray-900">
                    {bot.settings?.tone || "Friendly"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timezone:</span>
                  <span className="font-medium text-gray-900">
                    {bot.settings?.timezone || "UTC"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(bot.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
