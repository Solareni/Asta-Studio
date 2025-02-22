import { useEffect, useState } from "react";
import { messages } from "../mock";
import { ChatItem } from "./types";
import { useParams } from "react-router-dom";
import ChatArea from "./ChatArea";
import ChatInput from "./ChatInput";

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
		<div className="flex h-full w-full flex-col items-center relative">
			<div className="absolute inset-0 flex flex-col w-full mx-auto px-4">
				<ChatArea chatHistory={chatHistory} />
				<ChatInput />
			</div>
		</div>
	);
};

export default ChatPage;
