import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import ChatPage from "./components/ChatPage";



const AudioPage = () => {
	return <div>AudioPage</div>;
};

const LibraryPage = () => {
	return <div>LibraryPage</div>;
};

const UserPage = () => {
	return <div>UserPage</div>;
};

const SettingsPage = () => {
	return <div>SettingsPage</div>;
};

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{ index: true, element: <ChatPage /> },

			{
				path: "chat_page",
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