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
					className='h-[60px]'
					src={`https://azhrbvulmwgxcijoaenn.supabase.co/storage/v1/object/public/weatherapp/${weatherImages[imgHref]}color.png`}
					alt={weatherDescription}
				/>
			</div>
			<div>
				<p className='inline-block text-sm font-bold text-gray-200'>{formatted}</p>
			</div>
			<ul>
				<li className="grid grid-cols-2">
					<span className='font-bold text-gray-200'>Currently:</span>
					<span className="text-gray-500">{getCurrentTimeInTimezone(timezone)}</span>
				</li>
				<li className="grid grid-cols-2">
					<span className='font-bold text-gray-200'>Timezone:</span>					
					<span className="text-gray-500">{timezone}</span>
				</li>
				<li className="grid grid-cols-2">
					<span className='font-bold text-gray-200'>Sunrise:</span>
					<span className="text-gray-500">{formatUnixTimestampToEasyRead(sunrise, timezone)}</span>
				</li>
				<li className="grid grid-cols-2">
					<span className='font-bold text-gray-200'>Sunset:</span>
					<span className="text-gray-500">{formatUnixTimestampToEasyRead(sunset, timezone)}</span>
				</li>
				<li className="grid grid-cols-2">
					<span className='font-bold text-gray-200'>Temp:</span>
					<span className="text-gray-500">{temp}{'°F'}</span>
				</li>
				<li className="grid grid-cols-2">
					<span className='font-bold text-gray-200'>Feels Like:</span>
					<span className="text-gray-500">{feelsLike}{'°F'}</span>
				</li>
				<li className="grid grid-cols-2">
					<span className='font-bold text-gray-200'>Weather:</span>
					<span className="text-gray-500">{weatherTitle}</span>
				</li>
			</ul>
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
						<li className='col-span-4 border border-gray-800 rounded bg-gray-900 flex flex-col p-4'>
							<div>
								<span className='w-[150px] h-[20px] block bg-gray-800 animate-pulse'></span>
							</div>
							<div className='w-full mt-6'>
								<img className='mx-auto h-[60px]' src={'https://azhrbvulmwgxcijoaenn.supabase.co/storage/v1/object/public/weatherapp/cloudy_foggy_night__color.png'} />
							</div>
						</li>
						<li className='col-span-4 border border-gray-800 rounded bg-gray-900 flex flex-col p-4'>
							<div>
								<span className='w-[150px] h-[20px] block bg-gray-800 animate-pulse'></span>
							</div>
							<div className='w-full mt-6'>
								<img className='mx-auto h-[60px]' src={'https://azhrbvulmwgxcijoaenn.supabase.co/storage/v1/object/public/weatherapp/cloudy_foggy_night__color.png'} />
							</div>
						</li>
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
					const location = weather.find((item) => place.geolocations.formatted === item.formatted);

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

		</div>
	)
}