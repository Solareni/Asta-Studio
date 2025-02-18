import { useEffect, useRef, useState } from "react";
import { useDynamicHeight } from "../hooks/useDynamicHeight";
import { VirtualList } from "./shared/VirtualList";
import { messages } from "../mock";
import { ChatItem } from "./types";
import Markdown from "./Markdown";
const renderChatItem = ({
    index,
    style,
    data,
}: {
    index: number;
    style: React.CSSProperties;
    data: {
        items: ChatItem[];
        setSize: (index: number, size: number) => void;
    };
}) => {
    const { items } = data;
    const message = items[index];
    const rowRef = useDynamicHeight<HTMLDivElement>(index, data, message);
    return (
        <div
            style={{ ...style, height: "auto" }}
            ref={rowRef}
            className={`p-2 text-gray-600 dark:text-gray-300 ${message.role === "assistant" ? " dark:bg-gray-900 bg-gray-200" : ""}`}
        >
            <div className="font-bold mb-2">
                {message.role === "assistant" ? "AI" : "You"}
            </div>
            <Markdown message={message} />
        </div>
    );
};
const ChatPage = () => {
	const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
	const [inputMessage, setInputMessage] = useState("");

	useEffect(() => {
		setChatHistory(messages as ChatItem[]);
	}, []);

	const handleSendMessage = () => {
		if (!inputMessage.trim()) return;
		
		const newMessage: ChatItem = {
			role: "user",
			content: inputMessage.trim()
		};
		
		setChatHistory(prev => [...prev, newMessage]);
		setInputMessage("");
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	return (
		<div className="flex flex-col relative w-full h-screen">
			<div className="flex-1 overflow-hidden">
				<VirtualList
					message={chatHistory}
					className="h-[calc(100vh-80px)] overflow-y-auto"
					rowRenderer={renderChatItem}
				/>
			</div>
			<div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 flex gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
				<textarea
					value={inputMessage}
					onChange={(e) => setInputMessage(e.target.value)}
					onKeyDown={handleKeyPress}
					placeholder="Type your message..."
					className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
					rows={1}
				/>
				<button
					onClick={handleSendMessage}
					className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
					disabled={!inputMessage.trim()}
				>
					Send
				</button>
			</div>
		</div>
	);
};

export default ChatPage;
