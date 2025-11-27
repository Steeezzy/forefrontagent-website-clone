import ChatWindow from "@/components/widget/ChatWindow";
import { db } from "@/db";
import { bots } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ botId: string }>;
}

export default async function WidgetPage({ params }: PageProps) {
    const { botId } = await params;
    const id = parseInt(botId);

    if (isNaN(id)) return notFound();

    const bot = await db.query.bots.findFirst({
        where: eq(bots.id, id),
    });

    if (!bot) return notFound();

    // Parse settings safely
    let settings: any = {};
    try {
        settings = JSON.parse(bot.settings as string);
    } catch (e) {
        settings = {};
    }

    return (
        <div className="h-screen w-screen bg-transparent p-0 m-0 overflow-hidden">
            <ChatWindow
                botId={botId}
                botName={bot.name}
                primaryColor={settings.primaryColor || "#2563eb"}
            />
        </div>
    );
}
