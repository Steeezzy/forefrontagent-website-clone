'use client';

import { useEffect } from 'react';

export default function WidgetDemoPage() {
    useEffect(() => {
        // Dynamically load the widget script
        const script = document.createElement('script');
        script.src = '/tsukai-widget.js';
        script.async = true;

        // Configure widget via data attributes
        script.setAttribute('data-bot-id', '1');
        script.setAttribute('data-primary-color', '#2563eb'); // Blue-600
        script.setAttribute('data-greeting', 'Hello! I am the Tsukai demo bot. Ask me anything!');
        script.setAttribute('data-api-endpoint', '/api/chat');

        document.body.appendChild(script);

        return () => {
            // Cleanup
            document.body.removeChild(script);
            const widget = document.querySelector('.tsukai-widget-container');
            if (widget) widget.remove();
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">Tsukai Widget Demo</h1>
                    <p className="text-gray-500">
                        This page demonstrates how the chat widget looks and behaves on a client website.
                    </p>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-blue-900 mb-2">How to Embed</h2>
                    <p className="text-blue-700 mb-4">
                        Add this code to your website's <code>&lt;body&gt;</code> tag:
                    </p>
                    <pre className="bg-white border border-blue-200 rounded-lg p-4 overflow-x-auto text-sm text-gray-800">
                        {`<script 
  src="https://your-domain.com/tsukai-widget.js"
  data-bot-id="YOUR_BOT_ID"
  data-primary-color="#2563eb"
  data-greeting="Hi! How can I help?"
></script>`}
                    </pre>
                </div>

                <div className="prose prose-gray max-w-none">
                    <h3>Test Instructions</h3>
                    <ol>
                        <li>Look for the <strong>blue chat bubble</strong> in the bottom-right corner.</li>
                        <li>Click it to open the chat window.</li>
                        <li>Type a message (e.g., "Hello") and press Enter.</li>
                        <li>The bot should respond using the Google AI backend.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
