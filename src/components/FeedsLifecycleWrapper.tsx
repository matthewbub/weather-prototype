'use client';

import React, { useEffect } from "react";
import {globalStore} from '@/store';

export const FeedsLifecycleWrapper = ({ children }: { children: React.ReactElement }) => {
	const setLocations = globalStore((state) => state.setLocations);
	const setWeather = globalStore((state) => state.setWeather)
	
	async function setLocationsIntoGlobalState () {
		// clear previous data
		setLocations([]);
		setWeather({});

		const locationData = await fetch('/api/location');
		const parsedLocationData = await locationData.json();

		if (parsedLocationData.error) {
			alert('something went wrong' + parsedLocationData.message)
		}

		console.log('FeedsLifecycleWrapper in useEffect on mount', {LOG: parsedLocationData?.data});

		// This sets the users specified locations into a global state
		// to later be accessed throughout the app
		setLocations(parsedLocationData?.data?.locations);
		setWeather(parsedLocationData?.data?.weather);
	}

	const initialRender = () => {
		setLocationsIntoGlobalState();
	}

	useEffect(initialRender, []);

	return (
		<>
			{children}
		</>
	)
}