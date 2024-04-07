export interface AddressInputField {
	label: string;
	placeholder: string;
	type: string;
	defaultValue: string;
	maxLength?: number;
	name: string;
}

export interface AddressInputFields {
	[key: string]: AddressInputField;
}

export interface SearchResultsTypes {
	formatted: string;
	lon: string;
	lat: string;
}

export interface StoreTypes {
	searchResults: SearchResultsTypes[];
	loading: boolean;
	modalIsOpen: boolean;
	selectedLocation: SearchResultsTypes | null;
	setSearchResults: (searchResults: SearchResultsTypes[]) => void;
	setLoading: (loading: boolean) => void;
	setModalIsOpen: (modalIsOpen: boolean) => void;
	setSelectedLocation: (selectedLocation: SearchResultsTypes) => void;
	setSelectedLocationToNull: () => void;
}