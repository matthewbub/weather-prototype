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
}

interface Fields {
	[key: string]: Field;
}

const fields: Fields = {
	cityName: {
		label: 'Search by City',
		placeholder: 'City Name',
		type: 'text',
		defaultValue: '',
	},
	zipCode: {
		label: 'Search by Zip Code',
		placeholder: 'Zip Code',
		type: 'number',
		defaultValue: '',
		maxLength: 5,
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
			}),
		})

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
			}),
		})
		const searchResults = await searchResultsData.json();

		if (!searchResults?.error) {
			setLoading(false);
			setSearchResults(searchResults?.data)
		}
	}

	return (
		<div className='flex flex-col space-y-6'>
			<div className='grid grid-cols-12 gap-4'>
				<div className='flex flex-col space-y-1.5 col-span-12 md:col-span-8'>
					<label className='label' htmlFor='cityName'>
						<span>City Name</span>
					</label>
					<input
						type="text"
						name="cityName"
						placeholder="City Name"
						className='input'
						onChange={handleCityChange}
					/>
				</div>
				<div className='col-span-12 md:col-span-1 h-full flex flex-col justify-center items-center md:pt-4'>
					<span className='whitespace-nowrap'>or by</span>
				</div>
				<div className='flex flex-col space-y-1.5 col-span-12 md:col-span-3'>
					<label className='label' htmlFor='zipCode'>
						<span>Zip Code (Postal Code)</span>
					</label>
					<input
						type="number"
						name="zipCode"
						placeholder="Zip Code"
						className='input'
						onChange={handleZipChange}
					/>
				</div>
			</div>

			<div>
				<h2 className='text-lg font-bold'>Search Results</h2>
				
				{!loading && searchResults && searchResults.length > 0 && (
					<p className='text-sm'>Select a location to add to your feed.</p>
				)}

				{loading && (
					<p className='text-sm'>Loading</p>
				)}

				{searchResults && searchResults.length > 0 && (
					<div className='grid grid-cols-2 gap-4 mt-6'>
						{searchResults.slice(0, 6).map((result: {formatted: string}, index) => (
							<div key={index} className='flex flex-col space-y-2.5 col-span-2 md:col-span-1'>
								<button className='secondaryBtn flex-col flex'>
									{result?.formatted}
								</button>
							</div>
						))}
					</div>
				)}

				{!loading && searchResults && searchResults.length === 0 && (
					<div>
						<p className='text-white'>No results found. We'll display what we find here.</p>
					</div>
				)}
				
			</div>

			<button
				// onClick={handleAddName} 
				className='primaryBtn whitespace-nowrap'
			>
				Add Name
			</button>

		</div>
	);
};

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