import { supabase } from "@/utils/supabase";
import { skirtFailedResponse, bypassOkResponse } from "@/utils/response";
import { fetchOpenWeatherApi } from "@/utils/openWeather";

export const querySupabaseForUserSelectedLocations = async (id: string, lastRecord?: string) => {
	const { data: userSelected, error: userSelectedGeoLocationsError } = await supabase
		.from('weatherapp_feed_locations_by_user')
		.select(`
			id,
			geolocations:location!inner(*)
		`, { count: 'exact' })
		.eq('user', id)
		.order('created_at', { ascending: false })

		if (userSelectedGeoLocationsError) {
			return skirtFailedResponse(userSelectedGeoLocationsError.message)
		}
	
		if (!userSelected || userSelected.length === 0) {
			return skirtFailedResponse("No locations found for this user.");
		}

		return bypassOkResponse(userSelected)
}

interface LocationTypes {
	geolocations: {
		lat: number;
		lon: number;
		formatted: string;
	}
}

export const queryOpenWeatherApiForUsersLocations = async (locations: LocationTypes[]) => {
	const weatherDataForAllLocations: any = [];

	for (const location of locations) {
		const { lat, lon, formatted } = location.geolocations;
		try {
			const weatherData = await fetchOpenWeatherApi(lat.toString(), lon.toString());
			weatherDataForAllLocations.push({
				formatted: formatted, 
				...weatherData,
				...location
			});
		} catch (error) {
			return skirtFailedResponse(`Failed to fetch weather for location (${lat}, ${lon}):`);
		}
	}

	return bypassOkResponse(weatherDataForAllLocations);
}


export const queryOpenWeatherApiForSingleLocation = async (lat: number, lon: number, formatted: string) => {	
	try {
		const weatherData = await fetchOpenWeatherApi(lat.toString(), lon.toString());
		return bypassOkResponse({
			formatted: formatted, 
			...weatherData
		})
	} catch (error) {
		return skirtFailedResponse(`Failed to fetch weather for location (${lat}, ${lon}):`);
	}
}