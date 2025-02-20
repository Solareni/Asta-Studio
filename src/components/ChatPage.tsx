import { useEffect, useState, useRef } from "react";
import { useDynamicHeight } from "../hooks/useDynamicHeight";
import { VirtualList } from "./shared/VirtualList";
import { messages } from "../mock";
import { ChatItem } from "./types";
import Markdown from "./Markdown";
import { LuLightbulb, LuSearch } from "react-icons/lu";
import useAppStore from "../appStore";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
			<div className="flex items-start">
				<img
					className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
					src={
						message.role === "user"
							? "https://dummyimage.com/256x256/363536/ffffff&text=U"
							: "https://dummyimage.com/256x256/354ea1/ffffff&text=A"
					}
				/>
				<div className="flex-1">
					<Markdown message={message} />
				</div>
			</div>
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
	const [isFocused, setIsFocused] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const adjustHeight = () => {
		const textarea = textareaRef.current;
		if (!textarea) return;
		textarea.style.height = "auto";
		const minHeight = 72; // min 3 lines (24px * 3)
		const maxHeight = window.innerHeight / 3;
		const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
		textarea.style.height = `${newHeight}px`;
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter") {
			if (e.ctrlKey) {
				const start = e.currentTarget.selectionStart;
				const end = e.currentTarget.selectionEnd;
				const value = e.currentTarget.value;
				const newValue =
					value.substring(0, start) + "\n" + value.substring(end);
				setMessage(newValue);

				setTimeout(() => {
					if (textareaRef.current) {
						textareaRef.current.selectionStart = start + 1;
						textareaRef.current.selectionEnd = start + 1;
					}
				}, 0);

				e.preventDefault();
			} else if (!e.shiftKey) {
				e.preventDefault();
				if (message.trim()) {
					console.log("Submit message:", message);
					setMessage("");
					if (textareaRef.current) {
						textareaRef.current.style.height = "72px";
					}
				}
			}
		}
	};

	useEffect(() => {
		adjustHeight();
	}, [message]);

	return (
		<div ref={containerRef} className="relative w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
			<div 
				className={`relative rounded-lg border ${
					isFocused ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300 dark:border-gray-600'
				} transition-all duration-200`}
			>
				<textarea
					ref={textareaRef}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyDown={handleKeyDown}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					rows={3}
					placeholder="Type your message... (Enter to send, Ctrl+Enter for new line)"
					className="w-full resize-none rounded-t-lg border-0 p-2 focus:outline-none dark:bg-gray-800 dark:text-gray-200 min-h-[72px]"
					style={{ maxHeight: `${window.innerHeight / 3}px` }}
				/>
				<div className="flex gap-2 p-2 border-t-0">
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
		</div>
	);
};

const ChatArea = ({ chatHistory }: { chatHistory: ChatItem[] }) => {
	const { t } = useTranslation();

	return (
		<div className="flex-1 min-h-0 overflow-hidden relative">
			{chatHistory.length > 0 ? (
				<VirtualList
					message={chatHistory}
					className="absolute inset-0"
					rowRenderer={renderChatItem}
				/>
			) : (
				<div className="flex h-full items-center justify-center">
					<p className="text-slate-500">{t("chat.welcome")}</p>
				</div>
			)}
		</div>
	);
};

const ChatPage = () => {
	const { id } = useParams();
	const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);

	useEffect(() => {
		if (id) {
			setChatHistory(messages as ChatItem[]);
		} else {
			setChatHistory([]);
		}
	}, [id]);

	return (
		<div className="flex h-full w-full flex-col relative">
			<div className="absolute inset-0 flex flex-col">
				<ChatArea chatHistory={chatHistory} />
				<ChatInput />
			</div>
		</div>
	);
};

export default ChatPage;
