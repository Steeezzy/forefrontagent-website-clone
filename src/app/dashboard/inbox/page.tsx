import { MessageSquare } from "lucide-react";

export default function InboxPage() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Select a conversation</h3>
            <p className="text-sm max-w-xs text-center mt-2">
                Choose a conversation from the list to view messages and reply to visitors.
            </p>
        </div>
    );
}
