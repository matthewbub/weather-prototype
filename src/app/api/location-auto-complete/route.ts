// https://nextjs.org/docs/app/api-reference/functions/next-response#json
import { NextResponse } from "next/server";

const baseUrl = 'https://api.geoapify.com/v1/geocode/autocomplete'
interface LocationTypes {
	formatted: string;
	lon: string;
	lat: string;
}

export async function POST(request: Request) {
	const requestData = await request.json()
	const { cityName, postcode, type } = requestData;
	
	switch (type) {
		case 'city':
			try {
				const cityResponse = await fetch(`${baseUrl}?text=${cityName}&type=city&format=json&apiKey=${process.env.GEOAPIFY_KEY}`);
				const data = await cityResponse.json();
				
				// remove items that aren't in the US
				const collection = data?.results.filter((item: { country_code: string }) => item.country_code === 'us');

				const processedCollection = collection.map(({ lat, lon, formatted }: LocationTypes) => ({
					lat,
					lon,
					formatted,
				}));
				
				return NextResponse.json({ error: false, data: processedCollection });
			} catch (e) {
				return NextResponse.json({ error: true, data: e })
			}
		case 'postcode':
			try {
				const postcodeResponse = await fetch(`${baseUrl}?text=${postcode}&type=postcode&format=json&apiKey=${process.env.GEOAPIFY_KEY}`);
				const data = await postcodeResponse.json();

				// remove items that aren't in the US
				const collection = data?.results.filter((item: { country_code: string }) => item.country_code === 'us');

				const processedCollection = collection.map(({ lat, lon, formatted }: LocationTypes) => ({
					lat,
					lon,
					formatted,
				}));
				return NextResponse.json({ error: false, data: processedCollection })
			} catch (e) {
				return NextResponse.json({ error: true, data: e })
			}
		default:
			return NextResponse.json({ error: false, data: { message: "Something went wrong." } });
	}
}
