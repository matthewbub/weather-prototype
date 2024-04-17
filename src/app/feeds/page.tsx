import { currentUser } from '@clerk/nextjs';
import { TopNavWithAuth } from '@/components/topNav';
import { MainFeed } from "@/components/MainFeed/MainFeed";
import { LocationLookup } from "@/components/LocationLookup";
import { FeedsLifecycleWrapper } from "@/components/FeedsLifecycleWrapper";
import BasicCalendarV2 from '@/components/Calendar/examples/BasicCalendarV2';

export default async function Home() {
	const user = await currentUser();

	if (!user) {
		return (
			// TODO redirect to log in
			<div>Not signed in</div>
		)
	};

	return (
		<FeedsLifecycleWrapper>
			<div className="pageMargin">
				<TopNavWithAuth />				
				<div className='grid grid-cols-12 gap-8 md:gap-12'>
					<div className='col-span-2'>
						<div className='mb-4'>
							<h3 className='text-lg font-bold'>{'My locations'}</h3>
						</div>
						<ul>
								
						</ul>
					</div>
					<div className='col-span-7'>
						{/* <LocationLookup /> */}
						<MainFeed />
					</div>
					<div className='col-span-3'><BasicCalendarV2 /></div>
				</div>				
			</div>
		</FeedsLifecycleWrapper>
	);
}

