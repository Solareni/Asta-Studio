import { useEffect, useState, useRef } from "react";
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

	const [message, setMessage] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const getLineCount = () => {
		const textarea = textareaRef.current;
		if (!textarea) return 0;

		// Get the computed line height
		const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
		// Calculate actual lines (including wrapped lines)
		const lines = Math.floor(textarea.scrollHeight / lineHeight);
		return lines;
	};
	const adjustHeight = () => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const lineCount = getLineCount();
		console.log("Current lines:", lineCount);
		// Reset height to auto to get the correct scrollHeight
		textarea.style.height = "auto";

		const minHeight = 72; // min 3 lines (24px * 3)
		const newHeight = Math.max(textarea.scrollHeight, minHeight);
		textarea.style.height = `${newHeight}px`;
		textarea.style.paddingBottom = `24px`;
		// onHeightChange(newHeight);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter") {
			if (e.ctrlKey) {
				// Add new line
				const start = e.currentTarget.selectionStart;
				const end = e.currentTarget.selectionEnd;
				const value = e.currentTarget.value;
				const newValue =
					value.substring(0, start) + "\n" + value.substring(end);
				setMessage(newValue);

				// Force update in next tick to set cursor position after state update
				setTimeout(() => {
					if (textareaRef.current) {
						textareaRef.current.selectionStart = start + 1;
						textareaRef.current.selectionEnd = start + 1;
					}
				}, 0);

				e.preventDefault();
			} else if (!e.shiftKey) {
				// Submit message
				e.preventDefault();
				if (message.trim()) {
					// TODO: Handle message submission
					console.log("Submit message:", message);
					setMessage("");
					if (textareaRef.current) {
						textareaRef.current.style.height = "72px"; // Reset to 3 lines
						onHeightChange(72);
					}
				}
			}
		}
	};

	useEffect(() => {
		adjustHeight();
	}, [message]);

	return (
		<div className="h-auto relative">
			<textarea
				ref={textareaRef}
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				onKeyDown={handleKeyDown}
				rows={3}
				placeholder="Type your message... (Enter to send, Ctrl+Enter for new line)"
				className="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-600 p-2 pb-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 min-h-[72px]"
				style={{ height: "72px", maxHeight: `${window.innerHeight / 3}px` }}
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
					className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
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
