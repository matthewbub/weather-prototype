'use client';
import React, { useCallback, useRef } from 'react';
import { addressFieldMessages, locationLookupMessages, locationLookupApiUrls } from './LocationLookup.constants';
import { type SearchResultsTypes } from './LocationLookup.types';
import { store } from './LocationLookup.store';
import clsx from 'clsx';
import { AddIcon } from '@/components/icons';
import {globalStore} from '@/store';
import { debounce } from '@/utils/debounce';
import { useClickOutside } from '@/lib/hooks';

export const LocationLookupForm = () => {
	const searchResults = store((state) => state.searchResults);
	const loading = store((state) => state.loading);
	const setSearchResults = store((state) => state.setSearchResults);
	const setLoading = store((state) => state.setLoading);
	const setSelectedLocation = store((state) => state.setSelectedLocation);
	const selectedLocation = store((state) => state.selectedLocation);
	const setSelectedLocationToNull = store((state) => state.setSelectedLocationToNull);
	const setLocations = globalStore((state) => state.setLocations);
	
	const debouncedHandleCityChange = useCallback(debounce(async (e) => {
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
      setSearchResults(searchResults?.data);
    }
  }, 500), []);

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
			
			<div className='flex flex-col space-y-1.5 col-span-12 md:col-span-7'>
				<label className='label' htmlFor={addressFieldMessages.cityName.name}>
					<span>{addressFieldMessages.cityName.label}</span>
				</label>
				<input
					type={addressFieldMessages.cityName.type}
					name={addressFieldMessages.cityName.name}
					placeholder={addressFieldMessages.cityName.placeholder}
					className='input'
					onChange={debouncedHandleCityChange}
				/>
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
						'active border border-dashed border-blue-600': selectedLocation?.formatted === result.formatted
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
	const addLocationModalRef = useRef(null)
	
	const handleOpenModal = () => {
		setModalIsOpen(true);
	};
	const handleClickOutside = () => {
		setModalIsOpen(false)
	};
	
	useClickOutside(addLocationModalRef, handleClickOutside);

	return (
		<div className='w-full'>
			<div className='w-full flex justify-end'>
				<button onClick={handleOpenModal} className='secondaryBtn flex gap-x-3 items-center'>
					{!modalIsOpen 
						?	locationLookupMessages.en.lookupLocationAddButton 
						: locationLookupMessages.en.collapseLookupLocationAddButton}
					{!modalIsOpen
						? <AddIcon className='h-5 w-5'/>
						: <></>
					}
				</button>
			</div>

			{modalIsOpen && (
				<div 
					ref={addLocationModalRef} 
					className='rounded shadow-xl fixed z-10 top-0 left-0 right-0 bottom-0 m-auto h-fit sm:max-w-[500px] px-4 py-10 bg-gray-800 border border-gray-700 space-y-6'
				>
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