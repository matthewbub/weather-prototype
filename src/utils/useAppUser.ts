import { auth } from "@clerk/nextjs";
import { validateOrCreateUser } from "./validateOrCreateUser";

export const useAppUserOnServer = async () => {
	const currentSession = auth();
	// TODO: Make this dynamic
	const provider = "clerk";
	const sanitizedUser = await validateOrCreateUser(currentSession, provider);

	if (sanitizedUser.error || sanitizedUser.data === null) {
		return {
			error: true,
			message: sanitizedUser.message,
			data: null,
		};
	}

	return {
		error: false,
		message: "User validated.",
		data: sanitizedUser.data,
	};
};
