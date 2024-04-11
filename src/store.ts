import { create } from 'zustand';

interface GlobalStoreTypes {
	locations: any;
	setLocations: any;
	weather: any;
	setWeather: any;
}

export const globalStore = create<GlobalStoreTypes>((set) => ({
	locations: [],
	setLocations: (locations: any[]) => set({ locations }),
	weather: [],
	setWeather: (weather: any) => set({ weather })
}));

// Left off
// We should be able to array.filter((item) => formatted === item.formatted)
// to get the weather into the cards