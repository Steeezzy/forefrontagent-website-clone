"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, ExternalLink, CircleHelp, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function InstallationPage() {
    const [isChecking, setIsChecking] = useState(false);

    const handleCheckActivation = () => {
        setIsChecking(true);
        // Simulate checking
        setTimeout(() => {
            setIsChecking(false);
        }, 3000);
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-[#001B38]">Settings</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center text-[10px] font-bold text-blue-600">5</div>
                        <span>days left in your full-featured trial</span>
                    </div>
                </div>
                <button className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Upgrade
                </button>
            </div>

            <div className="flex gap-8">
                {/* Sidebar Navigation (Mock) */}
                <div className="w-64 flex-shrink-0">
                    <div className="mb-6">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Channels</h3>
                        <nav className="space-y-1">
                            <Link href="#" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                                <MessageSquare className="w-4 h-4" /> Live Chat
                            </Link>
                            <Link href="#" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 ml-6">
                                Appearance
                            </Link>
                            <Link href="#" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg ml-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>
                                Installation
                            </Link>
                            <Link href="#" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 ml-6">
                                Chat page
                            </Link>
                            <Link href="#" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 ml-6">
                                Translations
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">
                            The widget is currently not visible to your customers. Follow the steps below to enable Tidio live chat for your visitors.
                        </p>
                    </div>

                    <h2 className="text-xl font-bold text-[#001B38] mb-6">Installation</h2>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        {/* Step 1 */}
                        <div className="flex gap-4 mb-10">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                                1
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">
                                    To make the Tidio live chat visible for your visitors, you need to turn it on in Shopify theme editor and save changes.
                                </h3>
                                <button className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors text-sm">
                                    Go to Shopify Theme Editor
                                </button>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                                2
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">
                                    Visit your website <span className="font-bold">testforefront.myshopify.com</span> to check if the widget is there. This step is required to activate the widget.
                                </h3>
                                <div className="space-y-4">
                                    <button
                                        onClick={handleCheckActivation}
                                        className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors text-sm"
                                    >
                                        Go to your website
                                    </button>

                                    <div className="flex items-center gap-3">
                                        {isChecking ? (
                                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-blue-200"></div>
                                        )}
                                        <span className="text-sm text-gray-500">checking widget activation</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-200 flex items-center gap-4 text-sm text-gray-500">
                        <span>Need more help?</span>
                        <Link href="#" className="text-blue-600 hover:underline flex items-center gap-1">
                            Visit our Help Center <ExternalLink className="w-3 h-3" />
                        </Link>
                        <Link href="#" className="text-blue-600 hover:underline">
                            Chat with us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
