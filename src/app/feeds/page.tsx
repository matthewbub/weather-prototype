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
				<LocationLookup />
				<BasicCalendarV2 />
				<MainFeed />
			</div>
		</FeedsLifecycleWrapper>
	);
}

