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
	setSearchResults: (searchResults: SearchResultsTypes[]) => void;
	setLoading: (loading: boolean) => void;
	modalIsOpen: boolean;
	setModalIsOpen: (modalIsOpen: boolean) => void;
}