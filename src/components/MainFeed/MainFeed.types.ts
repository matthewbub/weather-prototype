export interface WeatherFromAPI {
	id: string;
	timezone: string;
	geolocations: {
		id: string;
		lat: number;
		lon: number;
		formatted: string;
		city: string;
		state: string;
	};
	current: {
		id: string;
		sunrise: number;
		sunset: number;
		temp: number;
		feels_like: number;
		weather: {
			id: string;
			main: string;
			icon: string;
			description: string;
		}[]
	}
	hourly: {
		dt: number;
		temp: string;
		weather: {
			main: string;
			icon: string;
			description: string;
			id: string;
		}[]
	}
}

export interface HourlyConditions {
	dt: number;
	temp: string;
	weather: {
		main: string;
		icon: string;
		description: string;
		id: string;
	}[]
}
