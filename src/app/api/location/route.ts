import { NextResponse } from "next/server";
import Joi from 'joi';
import { supabase } from "@/utils/supabase";
import { useAppUserOnServer } from "@/utils/useAppUser";
import { fetchOpenWeatherApi } from "@/utils/openWeather";
import { nwsWeatherAlertsByState } from "@/utils/nwsWeather"

interface PostResponseTypes {
	error: boolean;
	message: string;
	data: any | null;
}

function okResponse(data: any, msg?: string): NextResponse {
	return NextResponse.json<PostResponseTypes>({
		error: true,
		message: msg || "success",
		data: data,
	});
}

function failResponse(msg: string): NextResponse {
	return NextResponse.json<PostResponseTypes>({
		error: true,
		message: msg,
		data: null,
	});
}

function skirtFailedResponse(msg: string): PostResponseTypes {
	return {
		error: true,
		message: msg,
		data: null,
	}
}

export async function GET(request: Request) {
	// Get all locations the current user watches
	const sanitizedUser = await useAppUserOnServer();

	const failedToAuthenticate = sanitizedUser.error || !sanitizedUser.data?.user.id;
	if (failedToAuthenticate) {
		return failResponse(sanitizedUser.message)
	}

	const querySupabaseForUserSelectedLocations = async (id: string) => {
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

			return {
				error: false,
				message: "Data retrieved",
				data: userSelected
			}
	}

	const getUserSelectedGeoLocations = await querySupabaseForUserSelectedLocations(sanitizedUser.data?.user.id as string);

	if (getUserSelectedGeoLocations.error) {
		return failResponse(getUserSelectedGeoLocations.message)
	}

	const userSelectedGeoLocations = getUserSelectedGeoLocations?.data;
	// userSelectedGeoLocations[x].geolocations.lat
	// userSelectedGeoLocations[x].geolocations.lon



	// console.log()

	

	const data = await nwsWeatherAlertsByState()

	console.log(data);

	// Array to hold weather data for all locations
  const weatherDataForAllLocations = [];

  for (const location of userSelectedGeoLocations) {
    const { lat, lon } = location.geolocations;
    try {
      // const weatherData = await fetchOpenWeatherApi(lat, lon);
      // weatherDataForAllLocations.push(weatherData);      
    } catch (error) {
      console.error(`Failed to fetch weather for location (${lat}, ${lon}):`, error);
      
    }
  }

	// console.log(weatherDataForAllLocations);

	return okResponse(userSelectedGeoLocations);
}

// Ensure no nefarious data is being sent
const schema = Joi.object({
	lat: Joi.number().required(),
	lon: Joi.number().required(),
	formatted: Joi.string().required(),
});

export async function POST(request: Request) {
	const requestData = await request.json()
	const sanitizedUser = await useAppUserOnServer();

	const failedToAuthenticate = sanitizedUser.error || !sanitizedUser.data?.user.id;
	if (failedToAuthenticate) {
		return NextResponse.json<PostResponseTypes>({
			error: true,
			message: sanitizedUser.message,
			data: null,
		});
	}

	const { error: postValidationError } = schema.validate(requestData);

	if (postValidationError) {
		// manually verified this works :)
		return NextResponse.json<PostResponseTypes>({
			error: true,
			message: "Invalid data provided. Please try again.",
			data: null,
		});
	}

	const { lat, lon, formatted } = requestData;
	let locationData: {
		id: string;
		created_at: string;
		formatted: string;
		lat: number;
		lon: number;
	} | null = null;

	const { data: insertData, error: insertError } = await supabase
		.from("geolocations")
		.insert([{ lat, lon, formatted }])
		.select()
		.single();

	// "23505" is the error code for unique constraint violation
	// We have to let this slide to continue
	// There's no grantee that the user was the creator of the location & they need to be able to add it to their feed
	if (insertError && insertError.code !== "23505") {
		return NextResponse.json<PostResponseTypes>({
			error: true,
			message: insertError.message,
			data: null,
		});
	}

	// If the insert fails we need to fetch the location id
	if (insertError && insertError.code === "23505") {
		const { data: locationDataFromDb, error: locationError } = await supabase
			.from("geolocations")
			.select()
			.eq("formatted", formatted)
			.single();

		if (locationError) {
			return NextResponse.json<PostResponseTypes>({
				error: true,
				message: locationError.message,
				data: null,
			});
		}

		if (!locationDataFromDb) {
			return NextResponse.json<PostResponseTypes>({
				error: true,
				message: "Location not found, which is weird. Something went wrong.",
				data: null,
			});
		}

		// Update the insertData to the locationData
		locationData = locationDataFromDb;
	} else {
		locationData = insertData;
	}

	if (!locationData) {
		return NextResponse.json<PostResponseTypes>({
			error: true,
			message: "Location not found, which is weird. Something went wrong.",
			data: null,
		});
	}

	const { data: insertUserData, error: insertUserError } = await supabase
		.from("weatherapp_feed_locations_by_user")
		.insert([{
			location: locationData.id,
			user: sanitizedUser.data?.user.id,
		}])
		.select()
		.single();

	if (insertUserError && insertUserError.code !== "23505") {
		return NextResponse.json<PostResponseTypes>({
			error: true,
			message: insertUserError.message,
			data: null,
		});
	}

	if (insertUserError && insertUserError.code === "23505") {
		return NextResponse.json<PostResponseTypes>({
			error: true,
			message: "Location already in feed.",
			data: null,
		});
	}

	return NextResponse.json<PostResponseTypes>({
		error: false,
		message: "Successfully added location to database.",
		data: insertData,
	});
}

export async function HEAD(request: Request) { }

export async function PUT(request: Request) { }

export async function DELETE(request: Request) { }

export async function PATCH(request: Request) { }

// // If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
// export async function OPTIONS(request: Request) {}

// https://nextjs.org/docs/app/api-reference/functions/next-response#json