import { supabase } from "./supabase";

interface ValidateOrCreateUserResponse {
	error: boolean;
	message: string;
	data: {
		user: {
			id: string;
		};
	} | null;
}

// TODO how can we test this - it was manually tested already, all conditions were hit.
/**
 * @description
 * Use this function to work with the unique User ID.
 * This function is used to unify the user creation and validation process.
 * If you're looking for the UUID of the user, you can find it in the response data.
 */
export async function validateOrCreateUser(
	session: any,
	provider: string,
): Promise<ValidateOrCreateUserResponse> {
	if (!session || !session.sessionId) {
		return {
			error: true,
			message: "No session found.",
			data: null,
		};
	}

	const { data: user, error } = await supabase
		.from("users")
		.select()
		.eq("user_id", session.userId)
		.single();

	// Allow for the user to be created if the user is not found
	if (error && error.code !== "PGRST116") {
		return {
			error: true,
			message: error.message,
			data: null,
		};
	}

	if (!user) {
		const { data: insertData, error: insertError } = await supabase
			.from("users")
			.insert([{ user_id: session.userId, provider: provider }])
			.select()
			.single();

		if (insertError) {
			return {
				error: true,
				message: insertError.message,
				data: null,
			};
		}

		return {
			error: false,
			message: "User created.",
			data: {
				user: {
					id: insertData.id,
				},
			},
		};
	}

	return {
		error: false,
		message: "User validated.",
		data: {
			user: {
				id: user.id,
			},
		},
	};
}
