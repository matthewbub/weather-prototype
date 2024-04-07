import { AddressInputFields } from './LocationLookup.types';

export const locationLookupApiUrls = {
	autoComplete: {
		url: '/api/location-auto-complete', 
		method: 'POST'
	},
	addLocation: {
		url: '/api/location',
		method: 'POST'
	}
}

export const addressFieldMessages: AddressInputFields = {
	cityName: {
		label: 'City',
		placeholder: 'City Name',
		type: 'text',
		defaultValue: '',
		name: 'cityName'
	},
	zipCode: {
		label: 'Zip Code (Postal Code)',
		placeholder: 'Zip Code',
		type: 'number',
		defaultValue: '',
		maxLength: 5,
		name: 'zipCode'
	},
}

export const locationLookupMessages = {
	en: {
		loading: 'Loading...',
		noResults: 'No results found. We\'ll display what we find here.',
		initial: 'Select a location to add to your feed.',
		lookupLocationAddButton: 'Add New Location',
		collapseLookupLocationAddButton: 'Collapse',
		lookupLocationTitle: 'Add New Location',
		lookupLocationDescription: 'Search and select a new location to add to your feed.',
		locationLookupSearchResults: 'Search Results',
		locationLookupSearchButtonDefault: 'Select a location above',
		locationLookupSearchButton: 'Add Location'
	}
}