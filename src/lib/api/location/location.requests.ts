import { supabase } from "@/utils/supabase";
import { skirtFailedResponse, bypassOkResponse, failResponse, okResponse } from "@/utils/response";
import { fetchOpenWeatherApiWithCoordinates } from "@/utils/openWeather";

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

	const { data: favorites, error: favoritesError } = await supabase
		.from('weatherapp_feed_locations_by_user_favorites')
		.select(`
				*,
				geolocations:location!inner(*)
			`)
		.eq('user', id);

	if (favoritesError) {
		return skirtFailedResponse(favoritesError.message)
	}

	const geolocationIds = favorites.map(favorite => favorite.geolocations.location);
	const { data: cityInfos, error: cityInfosError } = await supabase
		.from('geolocations')
		.select('*')
		.in('id', geolocationIds);

	if (cityInfosError) {
		return skirtFailedResponse(cityInfosError.message);
	}

	// Merge the city information back into the favorites based on the geolocation ID
	const mergedFavorites = favorites.map(favorite => ({
		...favorite,
		city_info: cityInfos.find(info => info.id === favorite.geolocations.location)
	}));


	return bypassOkResponse({ locations: userSelected, favorites: mergedFavorites });
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
			const weatherData = await fetchOpenWeatherApiWithCoordinates(lat.toString(), lon.toString());
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
		const weatherData = await fetchOpenWeatherApiWithCoordinates(lat.toString(), lon.toString());
		return bypassOkResponse({
			formatted: formatted,
			...weatherData
		})
	} catch (error) {
		return skirtFailedResponse(`Failed to fetch weather for location (${lat}, ${lon}):`);
	}
}

export interface SanitizedUserTypes {
	data?: {
		user: {
			id: string;
		}
	}
}

export const handleBatchedWeatherByLocations = async (sanitizedUser: SanitizedUserTypes) => {
	const getUserSelectedGeoLocations = await querySupabaseForUserSelectedLocations(
		sanitizedUser.data?.user.id as string
	);

	if (getUserSelectedGeoLocations.error) {
		return failResponse(getUserSelectedGeoLocations.message)
	}

	const userSelectedGeoLocations = getUserSelectedGeoLocations?.data;

	const weatherDataForAllLocations = await queryOpenWeatherApiForUsersLocations(
		userSelectedGeoLocations?.locations
	)
	if (weatherDataForAllLocations?.error) {
		return failResponse(weatherDataForAllLocations.message);
	}

	return okResponse({
		locations: userSelectedGeoLocations?.locations,
		weather: weatherDataForAllLocations?.data,
		favorites: userSelectedGeoLocations?.favorites,
	});
}
