import { create } from 'zustand';

interface GlobalStoreTypes {
	locations: any;
	setLocations: any;
	weather: any;
	setWeather: any;
	favorites: any;
	setFavorites: (favorites: any) => void;
}

export const globalStore = create<GlobalStoreTypes>((set) => ({
	locations: [],
	setLocations: (locations: any[]) => set({ locations }),
	weather: [],
	setWeather: (weather: any) => set({ weather }),
	favorites: [],
	setFavorites: (favorites: any) => set({ favorites })
}));
