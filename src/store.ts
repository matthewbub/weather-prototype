import { create } from 'zustand';

interface GlobalStoreTypes {
	locations: any;
	setLocations: any
}

export const globalStore = create<GlobalStoreTypes>((set) => ({
	locations: [],
	setLocations: (locations: any[]) => set({ locations }),
}));