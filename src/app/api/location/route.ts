import { NextResponse } from "next/server";
import Joi from "joi";
import { supabase } from "@/utils/supabase";
import { useAppUserOnServer } from "@/utils/useAppUser";
import { failResponse } from "@/utils/response";
import {
	SanitizedUserTypes,
	handleBatchedWeatherByLocations,
} from "@/lib/api/location/location.requests";

interface PostResponseTypes {
	error: boolean;
	message: string;
	data: any | null;
}

export async function GET() {
	// Get all locations the current user watches
	const sanitizedUser = await useAppUserOnServer();
	const failedToAuthenticate =
		sanitizedUser.error || !sanitizedUser.data?.user.id;
	if (failedToAuthenticate) {
		return failResponse(sanitizedUser.message);
	}
	return handleBatchedWeatherByLocations(
		sanitizedUser as unknown as SanitizedUserTypes,
	);
}

// Ensure no nefarious data is being sent
const schema = Joi.object({
	lat: Joi.number().required(),
	lon: Joi.number().required(),
	formatted: Joi.string().required(),
	city: Joi.string(),
	state: Joi.string(),
	county: Joi.string(),
});

export async function POST(request: Request) {
	const requestData = await request.json();
	const sanitizedUser = await useAppUserOnServer();

	const failedToAuthenticate =
		sanitizedUser.error || !sanitizedUser.data?.user.id;
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

	const { lat, lon, formatted, city, state, county } = requestData;
	let locationData: {
		id: string;
		created_at: string;
		formatted: string;
		lat: number;
		lon: number;
		city: string;
		state: string;
		county: string;
	} | null = null;

	const { data: insertData, error: insertError } = await supabase
		.from("geolocations")
		.insert([
			{
				lat,
				lon,
				formatted,
				city,
				state,
				county,
			},
		])
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
		.insert([
			{
				location: locationData.id,
				user: sanitizedUser.data?.user.id,
			},
		])
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

export async function HEAD(request: Request) {}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

// // If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
// export async function OPTIONS(request: Request) {}

// https://nextjs.org/docs/app/api-reference/functions/next-response#json
