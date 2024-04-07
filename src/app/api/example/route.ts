import { NextResponse } from "next/server";

export async function GET(request: Request) {
	return NextResponse.json({
		error: false,
	});
}

export async function POST(request: Request) {
	const requestData = await request.json()
	console.log(requestData)
	return NextResponse.json({
		error: false,
	});
}

export async function HEAD(request: Request) {}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

// // If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
// export async function OPTIONS(request: Request) {}

// https://nextjs.org/docs/app/api-reference/functions/next-response#json