import { useEffect, useState } from "react";
import { messages } from "../mock";
import { useParams } from "react-router-dom";
import ChatArea from "./ChatArea";
import ChatInput from "./ChatInput";
import { OpenAiHandler } from "../api/providers/openai";
import options from "../env";
import { ChatItem } from "./types";
const ChatPage = () => {
	const { id } = useParams();
	const [chatHistory, setChatHistory] = useState<
		ChatItem[]
	>([]);

	useEffect(() => {
		if (id) {
			setChatHistory(messages);
		} else {
			setChatHistory([]);
		}
	}, [id]);

	const handler = new OpenAiHandler(options);

	const onSend = (message: string) => {
		const updatedHistory: ChatItem[] = [
			...chatHistory,
			{ role: "user", content: message },
		];
		setChatHistory(updatedHistory);

		const listen = async () => {
			let fullResponse = "";
			const stream = await handler.createMessage(
				"You are a helpful assistant.",
				updatedHistory
			);
			for await (const chunk of stream) {
				if (chunk.type === "text" || chunk.type === "reasoning") {
					fullResponse += chunk.text;
					const updatedResonse:ChatItem = {
						role: "assistant",
						content: fullResponse,
					};
					const newChatHistory: ChatItem[] = [
						...updatedHistory,
						updatedResonse,
					];
					setChatHistory(newChatHistory);
				}
			}
			return fullResponse;
		};

		listen().then((fullResponse) => {
			console.log("Assistant response complete");
		});
	};

	return (
		<div className="flex h-full w-full flex-col items-center relative">
			<div className="absolute inset-0 flex flex-col w-full mx-auto px-4">
				<ChatArea chatHistory={chatHistory} />
				<ChatInput onSend={onSend} />
			</div>
		</div>
	);
};

export default ChatPage;
