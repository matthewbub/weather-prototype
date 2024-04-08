'use client';

import {globalStore} from '@/store';
import Image from 'next/image';

export function MainFeed() {
	const locations = globalStore((state) => state.locations);

	return (
		<div>
			<div className='mb-4'>
				<h3 className='text-lg font-bold'>My Feed</h3>
			</div>
			<ul className='space-y-6'>
				{locations && locations.map((place: {
					id: string;
					geolocations: {
						id: string;
						lat: number;
						lon: number;
						formatted: string;
					}
				}) => (
					<li className='border border-gray-800 rounded bg-gray-900 flex flex-col items-center py-10'>
						<img className='h-[120px]' src={'https://azhrbvulmwgxcijoaenn.supabase.co/storage/v1/object/public/weatherapp/cloudy_foggy_night__color.png'} />
						<p className='mt-4 inline-block'>{place.geolocations.formatted}</p>
					</li>
				))}
			</ul>
			
		</div>
	)
}