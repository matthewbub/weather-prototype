'use client';
import React, { useState } from 'react';

export const AddNewFeedModal = () => {
	return (
		<div className='primaryBg px-4 py-10 border border-indigo-700 space-y-6'>
			<div>
				<h3 className='text-lg font-bold'>Add New Location</h3>
				<p className='text-sm'>Search and select a new location to add to your feed.</p>
			</div>
			<AddNewFeedForm />
		</div>
	);
}

interface Field {
	label: string;
	placeholder: string;
	type: string;
	defaultValue: string;
	maxLength?: number;
	name: string;
}

interface Fields {
	[key: string]: Field;
}

const fields: Fields = {
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

export const AddNewFeedForm = () => {
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(false);

	const handleCityChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setLoading(true);

		const searchResultsData = await fetch('/api/location-auto-complete', {
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

		const searchResultsData = await fetch('/api/location-auto-complete', {
			method: 'POST',
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

	return (
		<div className='flex flex-col space-y-6'>
			<div className='grid grid-cols-12 gap-4'>
				<div className='flex flex-col space-y-1.5 col-span-12 md:col-span-8'>
					<label className='label' htmlFor={fields.cityName.name}>
						<span>{fields.cityName.label}</span>
					</label>
					<input
						type={fields.cityName.type}
						name={fields.cityName.name}
						placeholder={fields.cityName.placeholder}
						className='input'
						onChange={handleCityChange}
					/>
				</div>
				<div className='col-span-12 md:col-span-1 h-full flex flex-col justify-center items-center md:pt-4'>
					<span className='whitespace-nowrap'>or by</span>
				</div>
				<div className='flex flex-col space-y-1.5 col-span-12 md:col-span-3'>
					<label className='label' htmlFor={fields.zipCode.name}>
						<span>{fields.zipCode.label}</span>
					</label>
					<input
						type={fields.zipCode.type}
						name={fields.zipCode.name}
						placeholder={fields.zipCode.placeholder}
						className='input'
						onChange={handleZipChange}
					/>
				</div>
			</div>

			<div>
				<h2 className='text-lg font-bold'>Search Results</h2>

				<AddressResults 
					loading={loading} 
					searchResults={searchResults} 
				/>

			</div>

			<button
				// onClick={handleAddName} 
				className='primaryBtn whitespace-nowrap'
				disabled
			>
				Add Name
			</button>

		</div>
	);
};

interface SearchResultsTypes {
	formatted: string;
	lon: string;
	lat: string;
}

export const AddressResults = ({ loading, searchResults }: {
	loading: boolean; 
	searchResults: SearchResultsTypes[]
}) => {
	const hasResults = searchResults && searchResults.length > 0;
	const isEmpty = !loading && searchResults && searchResults.length === 0;

	const renderLoading = () => (
		<p className='text-sm'>Loading</p>
	);

	const renderSearchResults = () => (
		<div className='grid grid-cols-2 gap-4 mt-6'>
			{searchResults.slice(0, 6).map((result: SearchResultsTypes, index: number) => (
				<div key={index} className='flex flex-col space-y-2.5 col-span-2 md:col-span-1'>
					<button className='secondaryBtn flex-col flex'>
						{result?.formatted}
					</button>
				</div>
			))}
		</div>
	);

	const renderEmpty = () => (
		<div>
			<p className='text-white'>No results found. We'll display what we find here.</p>
		</div>
	);

	const renderInitialMessage = () => (
		<p className='text-sm'>Select a location to add to your feed.</p>
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

export const AddNewFeed = () => {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div>
			<button onClick={openModal} className='secondaryBtn'>{!isOpen ? 'Add New Location' : 'Collapse'}</button>

			{isOpen && <AddNewFeedModal />}
		</div>
	);
};
