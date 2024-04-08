'use client';

import React, { useEffect } from "react";
import {globalStore} from '@/store';

export const FeedsLifecycleWrapper = ({ children }: { children: React.ReactElement }) => {
	const setLocations = globalStore((state) => state.setLocations);

	useEffect(() => {
		async function setLocationsIntoGlobalState () {
			const locationData = await fetch('/api/location');
			const parsedLocationData = await locationData.json();

			if (parsedLocationData.error) {
				alert('something went wrong')
			}

			// This sets the users specified locations into a global state
			// to later be accessed throughout the app
			// All rerenders occur here
			setLocations(parsedLocationData?.data);
		}

		setLocationsIntoGlobalState();
	}, []);

	return (
		<>
			{children}
		</>
	)
}