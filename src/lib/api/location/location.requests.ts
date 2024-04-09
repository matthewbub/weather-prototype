import { supabase } from "@/utils/supabase";
import { skirtFailedResponse, bypassOkResponse } from "@/utils/response";
import { fetchOpenWeatherApi } from "@/utils/openWeather";

export const querySupabaseForUserSelectedLocations = async (id: string) => {
	const { data: userSelected, error: userSelectedGeoLocationsError } = await supabase
		.from('weatherapp_feed_locations_by_user')
		.select(`
			id,
			geolocations:location!inner(*)
		`)
		.eq('user', id)
		.limit(5)

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
	}
}

export const queryOpenWeatherApiForUsersLocations = async (locations: LocationTypes[]) => {
	const weatherDataForAllLocations: any = [];

	for (const location of locations) {
		const { lat, lon } = location.geolocations;
		try {
			const weatherData = await fetchOpenWeatherApi(lat.toString(), lon.toString());
			weatherDataForAllLocations.push(weatherData);
		} catch (error) {
			return skirtFailedResponse(`Failed to fetch weather for location (${lat}, ${lon}):`);
		}
	}

	return bypassOkResponse(weatherDataForAllLocations);
}