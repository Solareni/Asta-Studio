import { create } from "zustand";

interface AppStore {
	theme: "light" | "dark";
	setTheme: (theme: "light" | "dark") => void;
	toggleTheme: () => void;
}

const useAppStore = create<AppStore>((set) => ({
	theme: "light",
	setTheme: (theme) => set({ theme }),
	toggleTheme: () =>
		set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
}));

export default useAppStore;