import { listen } from "@tauri-apps/api/event";
import { create } from "zustand";

interface AppStore {
	theme: "light" | "dark";
	setTheme: (theme: "light" | "dark") => void;
	toggleTheme: () => void;

	searchSeleted: boolean;
	setSearchSeleted: (seleted: boolean) => void;

	thinkingSeleted: boolean;
	setThinkingSeleted: (seleted: boolean) => void;

	sidebarVisible: boolean;
	setSidebarVisible: (visible: boolean) => void;

	initialize: () => () => void;
}

const useAppStore = create<AppStore>((set) => ({
	theme: "light",
	setTheme: (theme) => set({ theme }),
	toggleTheme: () =>
		set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
	searchSeleted: false,
	setSearchSeleted: (seleted) => set({ searchSeleted: seleted }),
	thinkingSeleted: false,
	setThinkingSeleted: (seleted) => set({ thinkingSeleted: seleted }),

	sidebarVisible: true,
	setSidebarVisible: (visible) => set({ sidebarVisible: visible }),

	initialize: () => {
		const unsubscribe = listen<string>("emit_event", (event) => {
			const payload = JSON.parse(event.payload);
			switch (payload.type) {
				case "sidebar_control":
					set((state) => ({ sidebarVisible: !state.sidebarVisible }));
					break;
				default:
					break;
			}
		});

		return () => {
			unsubscribe.then((unlisten) => unlisten());
		};
	}
}));

export default useAppStore;