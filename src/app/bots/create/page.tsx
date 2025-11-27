"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Bot } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CreateBotPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    language: "en",
    tone: "friendly",
    timezone: "UTC",
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const token = localStorage.getItem("bearer_token");
      
      // Note: We need user ID from the session. For now, using a placeholder.
      // In a real app, you'd get this from the session or make an API call to get the current user ID
      const response = await fetch("/api/bots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          domain: formData.domain || null,
          ownerId: 1, // TODO: Get from session/API
          settings: {
            language: formData.language,
            tone: formData.tone,
            timezone: formData.timezone,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create bot");
      }

      const newBot = await response.json();
      toast.success("Bot created successfully!");
      router.push(`/bots/${newBot.id}`);
    } catch (error) {
      toast.error("Failed to create bot. Please try again.");
      console.error(error);
      setIsCreating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
          <Link
            href="/bots"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Bots
          </Link>
          <h1 className="text-3xl font-bold text-[#001B38] mb-2">Create New Bot</h1>
          <p className="text-gray-600">Set up your AI customer service agent</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Bot className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Bot Configuration</h2>
                <p className="text-sm text-gray-600">Configure your bot's basic settings</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bot Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Bot Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Customer Support Bot"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5FD885] focus:border-transparent outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Choose a descriptive name for your bot
                </p>
              </div>

              {/* Domain */}
              <div>
                <label htmlFor="domain" className="block text-sm font-semibold text-gray-700 mb-2">
                  Domain (Optional)
                </label>
                <input
                  type="text"
                  id="domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  placeholder="e.g., example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5FD885] focus:border-transparent outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  The domain where this bot will be deployed
                </p>
              </div>

              {/* Language */}
              <div>
                <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5FD885] focus:border-transparent outline-none"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="pt">Portuguese</option>
                </select>
              </div>

              {/* Tone */}
              <div>
                <label htmlFor="tone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tone of Voice
                </label>
                <select
                  id="tone"
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5FD885] focus:border-transparent outline-none"
                >
                  <option value="friendly">Friendly</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                </select>
              </div>

              {/* Timezone */}
              <div>
                <label htmlFor="timezone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5FD885] focus:border-transparent outline-none"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New York (EST)</option>
                  <option value="America/Chicago">America/Chicago (CST)</option>
                  <option value="America/Denver">America/Denver (MST)</option>
                  <option value="America/Los_Angeles">America/Los Angeles (PST)</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Europe/Paris">Europe/Paris</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <Link
                  href="/bots"
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-[#5FD885] text-[#001B38] px-6 py-3 rounded-lg font-semibold hover:bg-[#4CD964] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? "Creating..." : "Create Bot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
