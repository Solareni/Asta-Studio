import { useState, useEffect, memo } from "react";
import { useTranslation } from "react-i18next";
import { type } from "@tauri-apps/plugin-os";
import { Virtuoso } from "react-virtuoso";
import {
	LuAtom,
	LuSun,
	LuMoon,
	LuUser,
	LuSettings,
	LuAudioLines,
	LuMessageCircleMore,
	LuImage,
	LuCirclePlus,
	LuChevronsLeft,
	LuChevronsRight,
} from "react-icons/lu";
import { Link, NavLink, Outlet } from "react-router-dom";
import { items } from "./mock";
import useAppStore from "./appStore";

// 定义聊天项的类型
interface ChatItem {
	title: string;
	date: string;
	id: string;
	type: "chat" | "audio" | "image";
}
const TitleRow = memo(({ item }: { item: ChatItem }) => {
	const getTypeIcon = () => {
		switch (item.type) {
			case "audio":
				return <LuAudioLines className="w-5 h-5 text-blue-500" />;
			case "image":
				return <LuImage className="w-5 h-5 text-blue-500" />;
			case "chat":
			default:
				return <LuMessageCircleMore className="w-5 h-5 text-blue-500" />;
		}
	};

	return (
		<NavLink
			to={`/chat/${item.id}`}
			key={`chat-${item.id}`}
			className={({
				isActive,
			}) => `flex w-full items-center gap-2 rounded-[20px] px-2 py-3 text-left transition-colors duration-200 
					${
						isActive
							? "bg-slate-200/90 text-slate-900 dark:bg-slate-700/90 dark:text-white"
							: "hover:bg-slate-100 dark:hover:bg-slate-800/70"
					}`}
		>
			<div className="flex-none">{getTypeIcon()}</div>

			<h1 className="text-sm font-medium capitalize truncate text-gray-900 dark:text-white flex-1">
				{item.title}
			</h1>
		</NavLink>
	);
});

const SidebarSimple = () => {
	const { theme, toggleTheme, sidebarVisible, setSidebarVisible } =
		useAppStore();

	return (
		<div className="w-12 bg-white border-r border-gray-200 dark:border-gray-700 dark:bg-gray-800 flex flex-col h-screen py-4 shadow-md">
			{/* 固定顶部区域 */}
			<div className="flex flex-col flex-none">
				{/* 项目标志 */}
				<div className="mb-4 px-3 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<LuAtom className="w-6 h-6 text-blue-500" />
					</div>
				</div>
				<Link to="/chat" className="nav-item mb-2">
					<LuCirclePlus className="nav-icon" />
				</Link>
			</div>

			{/* 可滚动的聊天历史记录区域 */}
			<div className="flex-1 min-h-0 border-t border-gray-200 dark:border-gray-700"></div>

			{/* 固定底部导航区域 */}
			<div className="flex-none pt-2 flex flex-col gap-2 border-t border-gray-200 dark:border-gray-700">
				<div className="nav-item">
					<LuChevronsRight
						onClick={() => setSidebarVisible(!sidebarVisible)}
						className="nav-icon"
					/>
				</div>
				<button onClick={toggleTheme} className="nav-item">
					{theme === "dark" ? (
						<>
							<LuSun className="nav-icon" />
						</>
					) : (
						<>
							<LuMoon className="nav-icon" />
						</>
					)}
				</button>

				<Link to="/user" className="nav-item">
					<LuUser className="nav-icon" />
				</Link>
				<Link to="/settings" className="nav-item">
					<LuSettings className="nav-icon" />
				</Link>
			</div>
		</div>
	);
};

const Siderbar = () => {
	const { theme, toggleTheme, sidebarVisible, setSidebarVisible } =
		useAppStore();
	const { t } = useTranslation();
	const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
	// 添加错误处理，在纯Bun环境中优雅降级
	let osType = "windows";
	try {
		osType = type() || "windows";
	} catch (error) {
		console.log("Unable to detect OS type, defaulting to windows:", error);
	}
	useEffect(() => {
		// 从本地存储中获取聊天历史记录
		setChatHistory(items as ChatItem[]);
	}, []);

	return (
		<div className="w-48 bg-white border-r border-gray-200 dark:border-gray-700 dark:bg-gray-800 flex flex-col h-screen py-4 shadow-md">
			{/* 固定顶部区域 */}
			<div className="flex flex-col flex-none">
				{/* 项目标志 */}
				<div className="mb-4 px-3 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<LuAtom className="w-6 h-6 text-blue-500" />
						<span className="text-lg font-semibold text-gray-900 dark:text-white">
							Asta
						</span>
					</div>
					{osType !== "macos" && (
						<LuChevronsLeft
							onClick={() => setSidebarVisible(!sidebarVisible)}
							className="w-5 h-5 text-gray-500 dark:text-gray-400"
						/>
					)}
				</div>
				<Link to="/chat" className="nav-item mb-2">
					<LuCirclePlus className="nav-icon" />
					<span className="nav-text">{t("new_chat")}</span>
				</Link>
			</div>

			{/* 可滚动的聊天历史记录区域 */}
			<div className="flex-1 min-h-0 border-t border-gray-200 dark:border-gray-700">
				<Virtuoso
					className="h-full overflow-auto"
					data={items}
					itemContent={(_, item) => <TitleRow item={item} />}
				/>
			</div>

			{/* 固定底部导航区域 */}
			<div className="flex-none pt-2 flex flex-col gap-2 border-t border-gray-200 dark:border-gray-700">
				<button onClick={toggleTheme} className="nav-item">
					{theme === "dark" ? (
						<>
							<LuSun className="nav-icon" />
							<span className="nav-text">{t("theme.light")}</span>
						</>
					) : (
						<>
							<LuMoon className="nav-icon" />
							<span className="nav-text">{t("theme.dark")}</span>
						</>
					)}
				</button>
				<Link to="/user" className="nav-item">
					<LuUser className="nav-icon" />
					<span className="nav-text">{t("user")}</span>
				</Link>
				<Link to="/settings" className="nav-item">
					<LuSettings className="nav-icon" />
					<span className="nav-text">{t("settings")}</span>
				</Link>
			</div>
		</div>
	);
};

function Layout() {
	const { theme, sidebarVisible, initialize } = useAppStore();

	useEffect(() => {
		const cleanup = initialize();

		return () => {
			cleanup();
		};
	}, []);
	// 添加错误处理，在纯Bun环境中优雅降级
	let osType = "windows";
	try {
		osType = type() || "windows";
	} catch (error) {
		console.log("Unable to detect OS type, defaulting to windows:", error);
	}
	return (
		<div className={theme === "light" ? "" : "dark"}>
			<div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
				{/* 侧边栏 */}
				{sidebarVisible && <Siderbar />}
				{osType !== "macos" && !sidebarVisible && <SidebarSimple />}

				{/* 主要内容区域 */}
				<div className="flex-1 bg-white dark:bg-gray-800">
					<Outlet />
				</div>
			</div>
		</div>
	);
}

export default Layout;
