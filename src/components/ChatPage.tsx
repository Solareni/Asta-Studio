import { useEffect, useRef, useState } from "react";
import { useDynamicHeight } from "../hooks/useDynamicHeight";
import { VirtualList } from "./shared/VirtualList";
import { messages } from "../mock";
import { ChatItem } from "./types";
import Markdown from "./Markdown";
import { LuLightbulb, LuSearch } from "react-icons/lu";
import useAppStore from "../appStore";
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
			className={`p-2 text-gray-600 dark:text-gray-300 ${
				message.role === "assistant" ? " dark:bg-gray-900 bg-gray-200" : ""
			}`}
		>
			<div className="font-bold mb-2">
				{message.role === "assistant" ? "AI" : "You"}
			</div>
			<Markdown message={message} />
		</div>
	);
};

const ChatInput = () => {
	const {
		searchSeleted,
		thinkingSeleted,
		setSearchSeleted,
		setThinkingSeleted,
	} = useAppStore();
	return (
		<div className="h-24 min-h-[96px] relative">
			<textarea
				placeholder="Type your message..."
				className="w-full h-full resize-none rounded-lg border border-gray-300 dark:border-gray-600 p-2 pb-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
				rows={3}
			/>
			<div className="absolute bottom-2 left-2 flex gap-2">
				<button
					className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
						searchSeleted
							? "text-blue-500 dark:text-blue-500"
							: "text-gray-700 dark:text-gray-100"
					}`}
					title="Search"
					onClick={() => setSearchSeleted(!searchSeleted)}
				>
					<LuSearch className="w-5 h-5" />
				</button>
				<button
					className={`p-2 rounded  hover:bg-gray-200 dark:hover:bg-gray-700 ${
						thinkingSeleted
							? "text-blue-500 dark:text-blue-500"
							: "text-gray-700 dark:text-gray-100"
					}`}
					title="Suggestions"
					onClick={() => setThinkingSeleted(!thinkingSeleted)}
				>
					<LuLightbulb className="w-5 h-5" />
				</button>
			</div>
		</div>
	);
};

const ChatPage = () => {
	const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);

	useEffect(() => {
		setChatHistory(messages as ChatItem[]);
	}, []);

	return (
		<div className="flex flex-col relative w-full h-screen p-2">
			<div className="flex-1 overflow-hidden mb-4">
				<VirtualList
					message={chatHistory}
					className="h-full"
					rowRenderer={renderChatItem}
				/>
			</div>
			<ChatInput />
		</div>
	);
};

export default ChatPage;
