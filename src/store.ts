import { create } from "zustand";

interface GlobalStoreTypes {
	locations: any;
	setLocations: (locations: any) => void;
	weather: any;
	setWeather: (weather: any) => void;
	favorites: any;
	setFavorites: (favorites: any) => void;
	topNews: {
		status: string;
		totalResults: number;
		data: {
			articles: any[];
		};
	};
	setTopNews: (topNews: any) => void;
}

export const globalStore = create<GlobalStoreTypes>((set) => ({
	locations: [],
	setLocations: (locations: any[]) => set({ locations }),
	weather: [],
	setWeather: (weather: any) => set({ weather }),
	favorites: [],
	setFavorites: (favorites: any) => set({ favorites }),
	topNews: {
		status: "",
		totalResults: 0,
		data: {
			articles: [],
		},
	},
	setTopNews: (topNews: any) => set({ topNews }),
}));
