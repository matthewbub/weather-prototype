const openWeatherApiKey = process.env.OPEN_WEATHER_API_KEY;

// https://openweathermap.org/api/one-call-3#current
export const fetchOpenWeatherApiWithCoordinates = async (
	lat: string,
	lon: string,
) => {
	if (!openWeatherApiKey) {
		throw new Error("Missing OPEN_WEATHER_API_KEY");
	}

	if (!lat || !lon) {
		throw new Error("Missing lat or lon");
	}

	const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=imperial`;

	const weatherData = await fetch(url);
	const parsedWeatherData = await weatherData.json();

	return parsedWeatherData;
};
