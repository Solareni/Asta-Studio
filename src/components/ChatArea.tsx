import Markdown from "./Markdown";
import { useTranslation } from "react-i18next";
import { ChatItem } from "./types";
import { memo, useEffect, useRef } from "react";
import { TableVirtuoso } from "react-virtuoso";

const Header = () => {
	const roles = ["user", "assistant"];
	return (
		<div className="bg-gray-200 dark:bg-gray-700 flex items-center p-2 border-b border-gray-200 dark:border-gray-700 h-12">
			{roles.map((role) => (
				<img
					key={role}
					className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
					src={
						role === "user"
							? "https://dummyimage.com/256x256/363536/ffffff&text=U"
							: "https://dummyimage.com/256x256/354ea1/ffffff&text=A"
					}
					alt={role}
				/>
			))}
		</div>
	);
};

const ChatArea = ({ chatHistory }: { chatHistory: ChatItem[] }) => {
	const { t } = useTranslation();

	return (
		<div className="flex-1 min-h-0 overflow-hidden relative">
			{chatHistory.length > 0 ? (
				<TableVirtuoso
					data={chatHistory}
					itemContent={(_, message) => <ChatItemRow message={message} />}
					fixedHeaderContent={() => <Header />}
				/>
			) : (
				<div className="flex h-full items-center justify-center">
					<p className="text-slate-500">{t("chat.welcome")}</p>
				</div>
			)}
		</div>
	);
};

const ChatItemRow = memo(({ message }: { message: ChatItem }) => {
	return (
		<div
			className={`p-2 text-gray-600 dark:text-gray-300 ${
				message.role === "assistant" ? " dark:bg-gray-900 bg-gray-200" : ""
			}`}
		>
			<div className="flex items-start">
				<img
					className="mr-2 flex h-6 w-6 rounded-full sm:mr-4"
					src={
						message.role === "user"
							? "https://dummyimage.com/256x256/363536/ffffff&text=U"
							: "https://dummyimage.com/256x256/354ea1/ffffff&text=A"
					}
					alt={message.role}
				/>
				<div className="flex-1">
					<Markdown message={message} />
				</div>
			</div>
		</div>
	);
});

const MemoChatItemRow = ChatItemRow;

export default ChatArea;
