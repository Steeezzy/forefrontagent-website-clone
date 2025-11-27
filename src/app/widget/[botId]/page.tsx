// src/app/widget/[botId]/page.tsx
// Minimal iframe chat client (polls /api/message synchronously).
// This is a simple starting point — replace polling with WebSocket for production.

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Message = { id?: string; role: "user" | "assistant"; text: string };

export default function WidgetPage({ params }: { params: Promise<{ botId: string }> }) {
    const { botId } = React.use(params);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const convRef = useRef<string | null>(null);

    async function sendMessage(text: string) {
        if (!text) return;
        setMessages((m) => [...m, { role: "user", text }]);
        setInput("");
        setTyping(true);
        const payload = { botId, conversationId: convRef.current, message: text };
        try {
            const res = await fetch("/api/message", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            const data = await res.json();
            if (data?.flow) {
                // handle flow result (not implemented here)
            }
            if (data?.text) {
                setMessages((m) => [...m, { role: "assistant", text: data.text }]);
            } else if (data?.action) {
                setMessages((m) => [...m, { role: "assistant", text: "Action completed: " + JSON.stringify(data.result || data) }]);
            } else if (data?.error) {
                setMessages((m) => [...m, { role: "assistant", text: "Error: " + data.error }]);
            }
            // if conversation id returned or set, store it
            if (!convRef.current && data?.conversationId) convRef.current = data.conversationId;
        } catch (err) {
            setMessages((m) => [...m, { role: "assistant", text: "Network error" }]);
            console.error(err);
        } finally {
            setTyping(false);
        }
    }

    return (
        <div style={{ fontFamily: "Inter, system-ui, sans-serif", width: 360, height: 560, display: "flex", flexDirection: "column", borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
            <div style={{ background: "#001B38", color: "white", padding: 12, fontWeight: 600 }}>ForefrontAgent</div>
            <div style={{ flex: 1, padding: 12, overflowY: "auto" }}>
                {messages.map((m, i) => (
                    <div key={i} style={{ margin: "8px 0", textAlign: m.role === "user" ? "right" : "left" }}>
                        <div style={{ display: "inline-block", padding: "8px 12px", borderRadius: 10, background: m.role === "user" ? "#5FD885" : "#f1f3f5", color: m.role === "user" ? "#002" : "#111" }}>{m.text}</div>
                    </div>
                ))}
                {typing && <div style={{ color: "#666" }}>Agent is typing...</div>}
            </div>
            <div style={{ padding: 8, borderTop: "1px solid #eee" }}>
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}>
                    <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." style={{ width: "calc(100% - 72px)", padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd" }} />
                    <button type="submit" style={{ marginLeft: 8, padding: "8px 12px", borderRadius: 8, background: "#001B38", color: "white", border: "none" }}>Send</button>
                </form>
            </div>
        </div>
    );
}
