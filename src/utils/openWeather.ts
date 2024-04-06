const openWeatherApiKey = process.env.OPENWEATHERMAP_API_KEY;

// https://openweathermap.org/api/one-call-3#current
const formatOpenWeatherUrl = async (lat: string, lon: string) => {
	if (!openWeatherApiKey) {
		throw new Error('Missing OPENWEATHERMAP_API_KEY');
	}

	if (!lat || !lon) {
		throw new Error('Missing lat or lon');
	}

	return `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}`;
}
