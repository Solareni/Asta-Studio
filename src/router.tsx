import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import ChatPage from "./components/ChatPage";
import SettingsPage from "./components/Settings";
import AudioPage from "./components/AudioPage";
import LibraryPage from "./components/LibraryPage";

const UserPage = () => {
	return <div>UserPage</div>;
};

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{ index: true, element: <ChatPage /> },
			{
                path: "chat/:id?",
                element: <ChatPage />,
            },
            {
                path: "chat/:id",
                element: <ChatPage />,
            },
			{
				path: "audio",
				element: <AudioPage />,
			},
			{
				path: "library",
				element: <LibraryPage />,
			},
			{
				path: "user",
				element: <UserPage />,
			},

			{
				path: "settings",
				element: <SettingsPage />,
			},
		],
	},
]);

export default router;