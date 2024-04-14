'use client';

import { globalStore } from '@/store';
import { formatUnixTimestampToEasyRead, getCurrentTimeInTimezone } from '@/utils/dates';
import { weatherImages } from '@/lib/constants/weather';
import { StarIcon } from '@/components/icons';

const WeatherCard = ({
	city,
	state,
	imgHref,
	formatted,
	timezone,
	sunrise,
	sunset,
	temp,
	feelsLike,
	weatherTitle,
	weatherDescription
}: {
	city: string;
	state: string;
	imgHref: string;
	formatted: string;
	timezone: string;
	sunrise: number;
	sunset: number;
	temp: number;
	feelsLike: number;
	weatherTitle: string;
	weatherDescription: string;
}) => {
	return (
		<div className='space-y-6'>
			<div className='w-full flex justify-between'>
				<div className='flex'>
					<img
						className='h-[80px] w-[80px] object-cover'
						src={`https://azhrbvulmwgxcijoaenn.supabase.co/storage/v1/object/public/weatherapp/${weatherImages[imgHref]}color.png`}
						alt={weatherDescription}
					/>
					<div className='flex flex-col pl-8'>
						<span className='text-4xl font-bold text-gray-200 mb-4'>{`${Math.round(temp)}°F`}</span>
						<p className='inline-block text-sm text-gray-500'>{`${city}, ${state}`}</p>
						<span className="text-gray-500 text-sm">{getCurrentTimeInTimezone(timezone)}</span>
					</div>
				</div>
				<div className='flex align-top'>
					<StarIcon className='h-8 w-8 hover:stroke-yellow-500 hover:fill-yellow-500 cursor-pointer' />
				</div>
			</div>

		</div>
	)
}

const WeatherCard24Hr = ({
	imgHref,
	timezone,
	temp,
	weatherTitle,
	weatherDescription,
	timeWillBe,
}: {
	imgHref: string;
	timezone: string;
	temp: string;
	weatherTitle: string;
	weatherDescription: string;
	timeWillBe: number;
}) => {

	return (
		<div className='grid grid-cols-12 gap-4 py-4'>
			<div className='w-full col-span-2'>
				<img
					className='h-[40px] w-[40px] object-cover'
					src={`https://openweathermap.org/img/wn/${imgHref}.png`}
					alt={weatherDescription}
				/>
			</div>
			<div className='col-span-10 flex flex-col space-x-1.5 items-end'>
				<span className="text-gray-200 font-bold text-lg">
					{formatUnixTimestampToEasyRead(timeWillBe, timezone)}
				</span>
				<div className='flex space-x-1.5 mt-2'>
					<span className="text-gray-500 text-sm">{Math.round(temp as any as number)}{'°F'}</span>
					<span className="text-gray-500 text-sm">{weatherTitle}</span>
				</div>
			</div>
		</div>
	)
}

const WeatherSkeletonLoader = () => (
	<>
		{/* Yeah this could be cooler but also shut up my copilot was turned off */}
		{[1, 2, 3, 4, 5].map((id) => (
			<li key={id} className='col-span-12 md:col-span-4 border border-gray-800 rounded bg-gray-900 flex flex-col p-4'>
				<div className='w-full mb-4 pl-4'>
					<div className='rounded-2xl h-[60px] w-[60px] bg-gray-800 animate-pulse'></div>
				</div>
				<div>
					<span className='rounded-2xl w-[150px] h-[20px] block bg-gray-800 animate-pulse'></span>
				</div>
			</li>
		))}
	</>
)

const LoadMoreResultsButton = () => (
	<li className='col-span-12 md:col-span-6 lg:col-span-4 border border-dashed border-gray-800 rounded bg-gray-900 flex flex-col p-4 justify-center items-center'>
		<button className='inline-block text-sm mx-auto'>Load More Results</button>
	</li>
)

interface WeatherFromAPI {
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

interface HourlyConditions {
	dt: number;
	temp: string;
	weather: {
		main: string;
		icon: string;
		description: string;
		id: string;
	}[]
}

export function MainFeed() {
	const locations = globalStore((state) => state.locations);
	const weather = globalStore((state) => state.weather);
	console.log(weather)
	return (
		<div>
			<div className='mb-8'>
				<h2 className='text-2xl font-bold'>{'My Feed'}</h2>
			</div>
			<div className='mb-4'>
				<h3 className='text-lg font-bold'>{'Current Weather'}</h3>
			</div>
			<ul className='gap-6 w-full grid grid-cols-12'>
				{/* Loading */}
				{!weather || weather.length === 0 && <WeatherSkeletonLoader />}

				{weather && weather.map((currentWeatherConditions: WeatherFromAPI) => {
					return (
						<li key={currentWeatherConditions.id} className='col-span-12 md:col-span-6 lg:col-span-4 border border-gray-800 rounded bg-gray-900 flex flex-col p-4'>
							<WeatherCard
								formatted={currentWeatherConditions.geolocations.formatted}
								city={currentWeatherConditions.geolocations.city}
								state={currentWeatherConditions.geolocations.state}
								timezone={currentWeatherConditions?.timezone}
								sunrise={currentWeatherConditions.current.sunrise}
								sunset={currentWeatherConditions.current.sunset}
								temp={currentWeatherConditions.current.temp}
								feelsLike={currentWeatherConditions.current.feels_like}
								weatherTitle={currentWeatherConditions.current.weather[0].main}
								imgHref={currentWeatherConditions.current.weather[0].id}
								weatherDescription={currentWeatherConditions.current.weather[0].description}
							/>
						</li>
					)
				})}
				{weather && weather.length !== 0 && <LoadMoreResultsButton />}
			</ul>

			<div className='mt-16 mb-4'>
				<h3 className='text-lg font-bold'>{'Over the next 24 hours'}</h3>
			</div>
			<ul className='gap-6 space-y-4 w-full grid grid-cols-12'>
				{/* Loading */}
				{!weather || weather.length === 0 && <WeatherSkeletonLoader />}

				{weather && weather.map((currentWeatherConditions: WeatherFromAPI) => {
					return (
						<li key={currentWeatherConditions.id} className='col-span-12 md:col-span-6 lg:col-span-4 border border-gray-800 rounded bg-gray-900 flex flex-col p-4 my-4'>
							<h3 className='text-sm font-bold text-gray-200'>{currentWeatherConditions.geolocations.formatted}</h3>
							{currentWeatherConditions.hourly && currentWeatherConditions.hourly.slice(0, 24).map((conditionByHour: HourlyConditions) => (
								<WeatherCard24Hr
									timeWillBe={conditionByHour.dt}
									timezone={currentWeatherConditions?.timezone}
									temp={conditionByHour.temp}
									weatherTitle={conditionByHour.weather[0].main}
									imgHref={conditionByHour.weather[0].icon}
									weatherDescription={conditionByHour.weather[0].description}
								/>
							))}
						</li>
					)
				})}

				{weather && weather.length !== 0 && <LoadMoreResultsButton />}
			</ul>

		</div>
	)
}