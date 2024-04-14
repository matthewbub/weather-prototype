'use client';

import React, { useEffect } from "react";
import {globalStore} from '@/store';

export const FeedsLifecycleWrapper = ({ children }: { children: React.ReactElement }) => {
	const setLocations = globalStore((state) => state.setLocations);
	const setWeather = globalStore((state) => state.setWeather);
	const setFavorites  = globalStore((state) => state.setFavorites);
	
	async function setLocationsIntoGlobalState () {
		setLocations([]);
		setWeather([]);
		setFavorites([]);

		const locationData = await fetch('/api/location',  { cache: 'no-store' });
		const parsedLocationData = await locationData.json();

		if (parsedLocationData.error) {
			// TODO handle this message better
			alert('something went wrong' + parsedLocationData.message)
		}

		// This sets the users specified locations into a global state
		// to later be accessed throughout the app
		setLocations(parsedLocationData?.data?.locations);
		setWeather(parsedLocationData?.data?.weather);
		setFavorites(parsedLocationData?.data?.favorites);
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