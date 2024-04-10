'use client';

import { globalStore } from '@/store';

export function MainFeed() {
	const locations = globalStore((state) => state.locations);

	return (
		<div>
			<div className='mb-4'>
				<h3 className='text-lg font-bold'>My Feed</h3>
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
				}) => (
					<li key={place.id} className='col-span-4 border border-gray-800 rounded bg-gray-900 flex flex-col p-4'>
						<div>
							<p className='inline-block text-sm'>{place.geolocations.formatted}</p>
						</div>
						<div className='w-full mt-6'>
							<img className='mx-auto h-[60px]' src={'https://azhrbvulmwgxcijoaenn.supabase.co/storage/v1/object/public/weatherapp/cloudy_foggy_night__color.png'} />
						</div>
					</li>
				))}
				{locations && locations.length !== 0 && (
					<li className='col-span-4 border border-dashed border-gray-800 rounded bg-gray-900 flex flex-col p-4 justify-center items-center'>
						<p className='inline-block text-sm mx-auto'>Load More Results</p>
					</li>
				)}
			</ul>

		</div>
	)
}