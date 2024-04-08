'use client';
import React from 'react';
import { addressFieldMessages, locationLookupMessages, locationLookupApiUrls } from './LocationLookup.constants';
import { type SearchResultsTypes } from './LocationLookup.types';
import { store } from './LocationLookup.store';
import clsx from 'clsx';
import { AddIcon } from '@/components/icons';
import {globalStore} from '@/store';

export const LocationLookupForm = () => {
	const searchResults = store((state) => state.searchResults);
	const loading = store((state) => state.loading);
	const setSearchResults = store((state) => state.setSearchResults);
	const setLoading = store((state) => state.setLoading);
	const setSelectedLocation = store((state) => state.setSelectedLocation);
	const selectedLocation = store((state) => state.selectedLocation);
	const setSelectedLocationToNull = store((state) => state.setSelectedLocationToNull);
	const setLocations = globalStore((state) => state.setLocations);
	
	const handleCityChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setLoading(true);

		const searchResultsData = await fetch(locationLookupApiUrls.autoComplete.url, {
			method: 'POST',
			body: JSON.stringify({
				type: 'city',
				cityName: value
			})
		});

		const searchResults = await searchResultsData.json();

		if (!searchResults?.error) {
			setLoading(false);
			setSearchResults(searchResults?.data)
		}
	}

	const handleZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setLoading(true);

		const searchResultsData = await fetch(locationLookupApiUrls.autoComplete.url, {
			method: locationLookupApiUrls.autoComplete.method,
			body: JSON.stringify({
				type: 'postcode',
				postcode: value
			})
		});

		const searchResults = await searchResultsData.json();

		if (!searchResults?.error) {
			setLoading(false);
			setSearchResults(searchResults?.data);
		}
	}

  const handleSelectLocation = (location: SearchResultsTypes) => {
		setSelectedLocation(location);
	}

	const handleAddLocationToFeed = async () => {
		// don't react if nothing is selected
		if (!selectedLocation) {
			return;
		}

		const addLocationData = await fetch(locationLookupApiUrls.addLocation.url, {
			method: locationLookupApiUrls.addLocation.method,
			body: JSON.stringify({ 
				formatted: selectedLocation.formatted, 
				lon: selectedLocation.lon, 
				lat: selectedLocation.lat 
			})
		});

		const addLocationResponse = await addLocationData.json();

		if (!addLocationResponse?.error) {
			// TODO do something with the response probably a toast message
		}

		setSelectedLocationToNull();

		// This was cp from `src/components/FeedsLifecycleWrapper.tsx`
		async function resetLocations () {
			// clear previous data
			setLocations([]);
	
			const locationData = await fetch('/api/location');
			const parsedLocationData = await locationData.json();
	
			if (parsedLocationData.error) {
				alert('something went wrong')
			}
	
			setLocations(parsedLocationData?.data);
		}
		resetLocations();
	}

	return (
		<div className='flex flex-col space-y-6'>
			<div className='grid grid-cols-12 gap-4'>
				<div className='flex flex-col space-y-1.5 col-span-12 md:col-span-8'>
					<label className='label' htmlFor={addressFieldMessages.cityName.name}>
						<span>{addressFieldMessages.cityName.label}</span>
					</label>
					<input
						type={addressFieldMessages.cityName.type}
						name={addressFieldMessages.cityName.name}
						placeholder={addressFieldMessages.cityName.placeholder}
						className='input'
						onChange={handleCityChange}
					/>
				</div>
				<div className='col-span-12 md:col-span-1 h-full flex flex-col justify-center items-center md:pt-4'>
					<span className='whitespace-nowrap'>{'or by'}</span>
				</div>
				<div className='flex flex-col space-y-1.5 col-span-12 md:col-span-3'>
					<label className='label' htmlFor={addressFieldMessages.zipCode.name}>
						<span>{addressFieldMessages.zipCode.label}</span>
					</label>
					<input
						type={addressFieldMessages.zipCode.type}
						name={addressFieldMessages.zipCode.name}
						placeholder={addressFieldMessages.zipCode.placeholder}
						className='input'
						onChange={handleZipChange}
					/>
				</div>
			</div>

			<div>
				<h2 className='text-lg font-bold'>{locationLookupMessages.en.locationLookupSearchResults}</h2>

				<AddressResults
					loading={loading}
					searchResults={searchResults}
					callback={handleSelectLocation}
				/>

			</div>

			<button
				onClick={handleAddLocationToFeed} 
				className='primaryBtn whitespace-nowrap disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-gray-700'
				disabled={!selectedLocation ? true : undefined}
			>
				{!selectedLocation 
					? locationLookupMessages.en.locationLookupSearchButtonDefault
					: locationLookupMessages.en.locationLookupSearchButton}
			</button>

		</div>
	);
};

export const AddressResults = ({ loading, searchResults, callback }: {
	loading: boolean;
	searchResults: SearchResultsTypes[];
	callback: (result: SearchResultsTypes) => void;
}) => {
	const selectedLocation = store((state) => state.selectedLocation);
	const hasResults = searchResults && searchResults.length > 0;
	const isEmpty = !loading && searchResults && searchResults.length === 0;
	
	const renderLoading = () => (
		<p className='text-sm'>{locationLookupMessages.en.loading}</p>
	);

	const renderSearchResults = () => (
		<div className='grid grid-cols-2 gap-4 mt-6'>
			{searchResults.slice(0, 6).map((result: SearchResultsTypes, index: number) => (
				<div key={index} className='flex flex-col space-y-2.5 col-span-2 md:col-span-1'>
					<button className={clsx('secondaryBtn flex-col flex', {
						'active border border-dashed border-indigo-600': selectedLocation?.formatted === result.formatted
					})} onClick={() => callback(result)}>
						{result?.formatted}
					</button>
				</div>
			))}
		</div>
	);

	const renderEmpty = () => (
		<div>
			<p className='text-white'>{locationLookupMessages.en.noResults}</p>
		</div>
	);

	const renderInitialMessage = () => (
		<p className='text-sm'>{locationLookupMessages.en.initial}</p>
	);

	if (loading) {
		return renderLoading();
	}

	if (!loading && hasResults) {
		return (
			<>
				{renderInitialMessage()}
				{renderSearchResults()}
			</>
		);
	}

	if (isEmpty) {
		return renderEmpty();
	}

	return null;
}

export const LocationLookup = () => {
	const modalIsOpen = store((state) => state.modalIsOpen);
	const setModalIsOpen = store((state) => state.setModalIsOpen);

	const toggleModal = () => {
		setModalIsOpen(!modalIsOpen);
	};

	return (
		<div>
			<button onClick={toggleModal} className='secondaryBtn flex gap-x-3 items-center'>
				{!modalIsOpen 
					?	locationLookupMessages.en.lookupLocationAddButton 
					: locationLookupMessages.en.collapseLookupLocationAddButton}
				{!modalIsOpen
					? <AddIcon className='h-5 w-5'/>
					: <></>
				}
			</button>

			{modalIsOpen && (
				<div className='primaryBg px-4 py-10 border border-indigo-700 space-y-6'>
					<div>
						<h3 className='text-lg font-bold'>{locationLookupMessages.en.lookupLocationTitle}</h3>
						<p className='text-sm'>{locationLookupMessages.en.lookupLocationDescription}</p>
					</div>
					<LocationLookupForm />
				</div>
			)}
		</div>
	);
};