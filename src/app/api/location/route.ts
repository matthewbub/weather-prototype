// https://nextjs.org/docs/app/api-reference/functions/next-response#json
import { NextResponse } from "next/server";
import Joi from 'joi';
import { supabase } from "@/utils/supabase";

export async function GET(request: Request) {
	return NextResponse.json({
		error: false,
	});
}

export async function POST(request: Request) {
	const requestData = await request.json()

	// Ensure no nefarious data is being sent
	const schema = Joi.object({
		lat: Joi.number().required(),
		lon: Joi.number().required(),
		formatted: Joi.string().required(),
	});

	const { error } = schema.validate(requestData);

	if (error) {
		// manually verified this works :)
		return NextResponse.json({
			error: true,
			message: error.details[0].message,
		});
	}

	const { lat, lon, formatted } = requestData;
	const { data: insertData, error: insertError } = await supabase
		.from("geolocations")
		.insert([{ lat, lon, formatted }])
		.select();

	if (insertError) {
		return NextResponse.json({
			error: true,
			message: insertError.message,
		});
	}

	return NextResponse.json({
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