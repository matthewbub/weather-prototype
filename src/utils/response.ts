import { NextResponse } from "next/server";

interface PostResponseTypes {
	error: boolean;
	message: string;
	data: any | null;
}

export function okResponse(data: any, msg?: string): NextResponse {
	return NextResponse.json<PostResponseTypes>({
		error: false,
		message: msg || "success",
		data: data,
	});
}

export function bypassOkResponse(data: any, msg?: string): PostResponseTypes {
	return {
		error: false,
		message: msg || "success",
		data: data,
	};
}

export function failResponse(msg: string): NextResponse {
	return NextResponse.json<PostResponseTypes>({
		error: true,
		message: msg,
		data: null,
	});
}

export function skirtFailedResponse(msg: string): PostResponseTypes {
	return {
		error: true,
		message: msg,
		data: null,
	};
}
