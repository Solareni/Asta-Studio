import { create } from "zustand";

interface AppStore {
	theme: "light" | "dark";
	setTheme: (theme: "light" | "dark") => void;
	toggleTheme: () => void;

	searchSeleted: boolean;
	setSearchSeleted: (seleted: boolean) => void;

	thinkingSeleted: boolean;
	setThinkingSeleted: (seleted: boolean) => void;
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
}));

export default useAppStore;