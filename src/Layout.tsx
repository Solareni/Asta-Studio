import { useTheme } from "./ThemeContext";
import {
	LuAtom,
	LuSun,
	LuMoon,
	LuUser,
	LuSettings,
	LuAudioLines,
	LuMessageCircleMore,
	LuLibraryBig,
} from "react-icons/lu";
import { Link, Outlet } from "react-router-dom";
const iconClassName =
	"w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer";
function Layout() {
	const { theme, toggleTheme } = useTheme();
	return (
		<div className={theme === "light" ? "" : "dark"}>
			<div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
				{/* 侧边栏 */}
				<div className="w-10 bg-white dark:bg-gray-800 flex flex-col items-center py-4 shadow-md">
					{/* 项目标志 */}
					<div className="mb-8">
						<LuAtom className="w-6 h-6 text-blue-500" />
					</div>
					<div className="flex flex-col gap-6">
						<Link to="/chat_page">
							<LuMessageCircleMore className={iconClassName} />
						</Link>
						<Link to="/audio">
							<LuAudioLines className={iconClassName} />
						</Link>
						<Link to="/library">
							<LuLibraryBig className={iconClassName} />
						</Link>
					</div>

					{/* 导航图标 */}
					<div className="mt-auto flex flex-col gap-6">
						<button onClick={toggleTheme}>
							{theme === "dark" ? (
								<LuSun className={iconClassName} />
							) : (
								<LuMoon className={iconClassName} />
							)}
						</button>
						<Link to="/user">
							<LuUser className={iconClassName} />
						</Link>
						<Link to="/settings">
							<LuSettings className={iconClassName} />
						</Link>
					</div>
				</div>

				{/* 主要内容区域 */}
				<div className="flex-1 p-6 bg-white dark:bg-gray-800">
					<Outlet />
				</div>
			</div>
		</div>
	);
}

export default Layout;
