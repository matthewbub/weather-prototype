export const nwsWeatherAlertsByState = async (state: string) => {
	const url = 'https://api.weather.gov/alerts/active?area=CA'
	
	const weatherData = await fetch(url, {
		headers: {
			'User-Agent': '(matthewbub.com, hey@matthewbub.com)',
			'Accept': 'application/geo+json'
		}
	});
	const parsedWeatherData = await weatherData.json();

	return parsedWeatherData;
}

// https://www.weather.gov/documentation/services-web-api