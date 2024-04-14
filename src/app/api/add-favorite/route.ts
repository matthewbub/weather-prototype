import Joi from 'joi';
import { supabase } from "@/utils/supabase";
import { useAppUserOnServer } from "@/utils/useAppUser";
import { bypassOkResponse, failResponse, okResponse, skirtFailedResponse } from "@/utils/response";

// Ensure no nefarious data is being sent
const schema = Joi.object({
	formatted: Joi.string().required(),
	usersGeolocationId: Joi.string().required(),
});

const confirmLocationExistsForUser = async (id: string) => {
	const { data: location, error: locationError } = await supabase
		.from('weatherapp_feed_locations_by_user')
		.select(`id`)
		.eq('id', id)
		.single()

		if (locationError) {
			return skirtFailedResponse(locationError.message)
		}
	
		if (!location) {
			return skirtFailedResponse("No locations found for this user.");
		}

		return bypassOkResponse(location)
}

const addUsersFavoriteLocation = async (userSpecificLocationId: string, userId: string) => {
	const { data: location, error: locationError } = await supabase
		.from('weatherapp_feed_locations_by_user_favorites')
		.insert([{
			location: userSpecificLocationId,
			user: userId,
		}])
		.select()
		.single()

		if (locationError?.code === "23505") {
			return skirtFailedResponse("You probably meant to delete this entry.")
		}

		if (locationError) {
			return skirtFailedResponse(locationError.message)
		}

		return bypassOkResponse(location)
}

export async function POST(request: Request) {
	const requestData = await request.json()

	const { error: postValidationErrorForFavoriteLocation } = schema.validate(requestData);
	if (postValidationErrorForFavoriteLocation) {
		return failResponse("Invalid data provided. Please try again.");
	}

	const sanitizedUser = await useAppUserOnServer();
	const failedToAuthenticate = sanitizedUser.error || !sanitizedUser.data?.user.id;
	if (failedToAuthenticate) {
		return failResponse(sanitizedUser.message)
	}

	// validate that the location exists in the users opts; it totally should 
	// we need it as a relation to the new favorite location
	// We receive the weatherapp_feed_locations_by_user.id 
	// mapping 
	//			user.id -> weatherapp_feed_locations_by_user.user; 
	// 		 	weatherapp_feed_locations_by_user.id -> weatherapp_feed_locations_by_user_favorites.location
	const location =  await confirmLocationExistsForUser(requestData?.usersGeolocationId);
	if (location?.error) {
		return failResponse(location?.message);
	}
	
	// after validation, insert location into `weatherapp_feed_locations_by_user_favorites`
	// We're using `location?.data.id` but could also use `requestData?.usersGeolocationId`
	// `location?.data.id` feels safer because it's a validated id
	const newLocationFavorite = await addUsersFavoriteLocation(
		location?.data.id, 
		sanitizedUser.data?.user.id as string
	);
	if (newLocationFavorite?.error) {
		return failResponse(newLocationFavorite?.message);
	}

	return okResponse(newLocationFavorite?.data);
}
