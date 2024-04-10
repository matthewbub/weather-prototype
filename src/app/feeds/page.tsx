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
				<LocationLookup />
				<MainFeed />
			</div>
		</FeedsLifecycleWrapper>
	);
}

