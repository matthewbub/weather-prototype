import { currentUser } from '@clerk/nextjs';
import { TopNavWithAuth } from '@/components/topNav';
import { MainFeed } from "@/components/MainFeed/MainFeed";
import { LocationLookup } from "@/components/LocationLookup";
import { FeedsLifecycleWrapper } from "@/components/FeedsLifecycleWrapper";

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
				<div className="w-full grid grid-cols-12">
					<div className="md:col-span-3 col-span-12"></div>
					<div className="md:col-span-6 col-span-12">
						<div className='flex justify-end w-full'>
							<LocationLookup />
						</div>
						<MainFeed />
					</div>
				</div>
			</div>
		</FeedsLifecycleWrapper>
	);
}

