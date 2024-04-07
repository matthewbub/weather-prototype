import { 
	type SearchResultsTypes, 
	type StoreTypes 
} from './LocationLookup.types';
import { create } from 'zustand';

export const store = create<StoreTypes>((set) => ({
	searchResults: [],
	loading: false,
	setSearchResults: (searchResults: SearchResultsTypes[]) => set({ searchResults }),
	setLoading: (loading: boolean) => set({ loading }),
	modalIsOpen: false,
	setModalIsOpen: (modalIsOpen: boolean) => set({ modalIsOpen }),
}));