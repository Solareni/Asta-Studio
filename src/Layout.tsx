import { useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";
import { VirtualList } from "./components/shared/VirtualList";
import { useDynamicHeight } from "./hooks/useDynamicHeight";
import {
	LuAtom,
	LuSun,
	LuMoon,
	LuUser,
	LuSettings,
	LuAudioLines,
	LuMessageCircleMore,
	LuLibraryBig,
	LuCirclePlus,
} from "react-icons/lu";
import { Link, NavLink, Outlet } from "react-router-dom";
import { items } from "./mock";

// 定义聊天项的类型
interface ChatItem {
	title: string;
	date: string;
	id: string;
}
const ChatRow = ({
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
	const item = data.items[index];
	const rowRef = useDynamicHeight<HTMLAnchorElement>(index, data, item);
	return (
		<NavLink
			ref={rowRef}
			to={`/chat/${item.id}`}
			key={`chat-${item.id}`}
			style={{ ...style, height: "auto" }}
			className={({
				isActive,
			}) => `flex w-full flex-col gap-y-2 rounded-lg px-3 py-2 text-left transition-colors duration-200 focus:outline-none
					${
						isActive
							? "bg-slate-200 dark:bg-slate-800"
							: "hover:bg-slate-200 dark:hover:bg-slate-800"
					}`}
		>
			<h1 className="text-sm font-medium capitalize text-slate-700 dark:text-slate-200 truncate">
				{item.title}
			</h1>
			<p className="text-xs text-slate-500 dark:text-slate-400">{item.date}</p>
		</NavLink>
	);
};

const Siderbar = () => {
	const { theme, toggleTheme } = useTheme();

	const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);

	useEffect(() => {
		// 从本地存储中获取聊天历史记录
		setChatHistory(items);
	}, []);

	return (
		<div className="w-36 bg-white dark:bg-gray-800 flex flex-col h-screen py-4 shadow-md">
			{/* 固定顶部区域 */}
			<div className="flex flex-col flex-none">
				{/* 项目标志 */}
				<div className="mb-4 px-3 flex items-center gap-3">
					<LuAtom className="w-6 h-6 text-blue-500" />
					<span className="text-lg font-semibold text-gray-900 dark:text-white">
						AI Chat
					</span>
				</div>
				<Link to="/chat" className="nav-item mb-2">
					<LuCirclePlus className="nav-icon" />
					<span className="nav-text">New Chat</span>
				</Link>
			</div>

			{/* 可滚动的聊天历史记录区域 */}
			<div className="flex-1 min-h-0">
				<VirtualList
					className="h-full overflow-auto"
					rowRenderer={ChatRow}
					message={chatHistory}
				/>
			</div>

			{/* 固定底部导航区域 */}
			<div className="flex-none pt-2 flex flex-col gap-2 border-t border-gray-200 dark:border-gray-700">
				<button onClick={toggleTheme} className="nav-item">
					{theme === "dark" ? (
						<>
							<LuSun className="nav-icon" />
							<span className="nav-text">Light Mode</span>
						</>
					) : (
						<>
							<LuMoon className="nav-icon" />
							<span className="nav-text">Dark Mode</span>
						</>
					)}
				</button>
				<Link to="/user" className="nav-item">
					<LuUser className="nav-icon" />
					<span className="nav-text">Profile</span>
				</Link>
				<Link to="/settings" className="nav-item">
					<LuSettings className="nav-icon" />
					<span className="nav-text">Settings</span>
				</Link>
			</div>
		</div>
	);
};

function Layout() {
	const { theme } = useTheme();
	return (
		<div className={theme === "light" ? "" : "dark"}>
			<div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
				{/* 侧边栏 */}
				<Siderbar />

				{/* 主要内容区域 */}
				<div className="flex-1 bg-white dark:bg-gray-800">
					<Outlet />
				</div>
			</div>
		</div>
	);
}

export default Layout;
