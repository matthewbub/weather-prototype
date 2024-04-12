'use client';

import { globalStore } from '@/store';
import { formatUnixTimestampToEasyRead, getCurrentTimeInTimezone } from '@/utils/dates';
import { kelvinToFahrenheit } from '@/utils/weather';
import { weatherImages } from '@/lib/constants/weather';
import Image from 'next/image';

const WeatherCard = ({
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
	imgHref: string;
	formatted: string;
	timezone: string;
	sunrise: number;
	sunset: number;
	temp: string;
	feelsLike: string;
	weatherTitle: string;
	weatherDescription: string;
}) => {
	return (
		<div className='space-y-6'>
			<div className='w-full'>
				<img
					className='h-[60px] w-[60px] object-cover'
					src={`https://azhrbvulmwgxcijoaenn.supabase.co/storage/v1/object/public/weatherapp/${weatherImages[imgHref]}color.png`}
					alt={weatherDescription}
				/>
			</div>
			<div>
				<p className='inline-block text-sm font-bold text-gray-200'>{formatted}</p>
			</div>
			<ul>
				<li className="grid grid-cols-2">
					<span className='font-bold text-gray-200 text-sm'>Currently:</span>
					<span className="text-gray-500 text-sm">{getCurrentTimeInTimezone(timezone)}</span>
				</li>
				<li className="grid grid-cols-2">
					<span className='font-bold text-gray-200 text-sm'>Timezone:</span>
					<span className="text-gray-500 text-sm">{timezone}</span>
				</li>
				<li className="grid grid-cols-2">
					<span className='font-bold text-gray-200 text-sm'>Sunrise:</span>
					<span className="text-gray-500 text-sm">{formatUnixTimestampToEasyRead(sunrise, timezone)}</span>
				</li>
				<li className="grid grid-cols-2">
					<span className='font-bold text-gray-200 text-sm'>Sunset:</span>
					<span className="text-gray-500 text-sm">{formatUnixTimestampToEasyRead(sunset, timezone)}</span>
				</li>
				<li className="grid grid-cols-2">
					<span className='font-bold text-gray-200 text-sm'>Temp:</span>
					<span className="text-gray-500 text-sm">{temp}{'°F'}</span>
				</li>
				<li className="grid grid-cols-2">
					<span className='font-bold text-gray-200 text-sm'>Feels Like:</span>
					<span className="text-gray-500 text-sm">{feelsLike}{'°F'}</span>
				</li>
				<li className="grid grid-cols-2">
					<span className='font-bold text-gray-200 text-sm'>Weather:</span>
					<span className="text-gray-500 text-sm">{weatherTitle}</span>
				</li>
			</ul>
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
					<span className="text-gray-500 text-sm">{Math.round(temp)}{'°F'}</span>
					<span className="text-gray-500 text-sm">{weatherTitle}</span>
				</div>
			</div>
		</div>
	)
}
export function MainFeed() {
	const locations = globalStore((state) => state.locations);
	const weather = globalStore((state) => state.weather);

	return (
		<div>
			<div className='mb-8'>
				<h2 className='text-2xl font-bold'>My Feed</h2>
			</div>

			<div className='mb-4'>
				<h3 className='text-lg font-bold'>Current Weather</h3>
			</div>
			<ul className='gap-6 w-full grid grid-cols-12'>
				{!locations || locations.length === 0 && (
					<>
						{/* Yeah this could be cooler but also shut up my copilot was turned off */}
						{[1, 2, 3, 4, 5].map((id) => (
							<li key={id} className='col-span-4 border border-gray-800 rounded bg-gray-900 flex flex-col p-4'>
								<div className='w-full mb-4 pl-4'>
									<div className='rounded-2xl h-[60px] w-[60px] bg-gray-800 animate-pulse'></div>
								</div>
								<div>
									<span className='rounded-2xl w-[150px] h-[20px] block bg-gray-800 animate-pulse'></span>
								</div>
							</li>
						))}
					</>
				)}

				{locations && locations.map((place: {
					id: string;
					geolocations: {
						id: string;
						lat: number;
						lon: number;
						formatted: string;
					}
				}) => {
					const location = weather.find((item: any) => place.geolocations.formatted === item.formatted);

					return (
						<li key={place.id} className='col-span-4 border border-gray-800 rounded bg-gray-900 flex flex-col p-4'>
							<WeatherCard
								formatted={place.geolocations.formatted}
								timezone={location.timezone}
								sunrise={location.current.sunrise}
								sunset={location.current.sunset}
								temp={location.current.temp}
								feelsLike={location.current.feels_like}
								weatherTitle={location.current.weather[0].main}
								imgHref={location.current.weather[0].id}
								weatherDescription={location.current.weather[0].description}
							/>
						</li>
					)
				})}
				{locations && locations.length !== 0 && (
					<li className='col-span-4 border border-dashed border-gray-800 rounded bg-gray-900 flex flex-col p-4 justify-center items-center'>
						<p className='inline-block text-sm mx-auto'>Load More Results</p>
					</li>
				)}
			</ul>

			<div className='mt-16 mb-4'>
				<h3 className='text-lg font-bold'>Over the next 24 hours</h3>
			</div>
			<ul className='gap-6 space-y-4 w-full grid grid-cols-12'>
				{!locations || locations.length === 0 && (
					<>
						{/* Yeah this could be cooler but also shut up my copilot was turned off */}
						{[1, 2, 3, 4, 5].map((id) => (
							<li key={id} className='col-span-4 border border-gray-800 rounded bg-gray-900 flex flex-col p-4'>
								<div className='w-full mb-4 pl-4'>
									<div className='rounded-2xl h-[60px] w-[60px] bg-gray-800 animate-pulse'></div>
								</div>
								<div>
									<span className='rounded-2xl w-[150px] h-[20px] block bg-gray-800 animate-pulse'></span>
								</div>
							</li>
						))}
					</>
				)}

				{locations && locations.map((place: {
					id: string;
					geolocations: {
						id: string;
						lat: number;
						lon: number;
						formatted: string;
					}
				}) => {
					const location = weather.find((item: any) => place.geolocations.formatted === item.formatted)
					const hours = location.hourly;

					return (
						<li key={place.id} className='col-span-4 border border-gray-800 rounded bg-gray-900 flex flex-col p-4 my-4'>
							<h3 className='text-sm font-bold text-gray-200'>{place.geolocations.formatted}</h3>
							{hours && hours.slice(0, 24).map((conditionByHour: {
								dt: number;
								temp: string;
								weather: {
									main: string;
									icon: string;
									description: string;
								}[]
							}) => (
								<>
									<WeatherCard24Hr
										timeWillBe={conditionByHour.dt}
										timezone={location.timezone}
										temp={conditionByHour.temp}
										weatherTitle={conditionByHour.weather[0].main}
										imgHref={conditionByHour.weather[0].icon}
										weatherDescription={conditionByHour.weather[0].description}
									/>
								</>
							))}
						</li>
					)
				})}
				{locations && locations.length !== 0 && (
					<li className='col-span-4 border border-dashed border-gray-800 rounded bg-gray-900 flex flex-col p-4 justify-center items-center'>
						<p className='inline-block text-sm mx-auto'>Load More Results</p>
					</li>
				)}
			</ul>

		</div>
	)
}