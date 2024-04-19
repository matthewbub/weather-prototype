import { currentUser } from "@clerk/nextjs";
import { TopNavWithAuth } from "@/components/topNav";
import { MainFeed } from "@/components/MainFeed/MainFeed";
import { FeedsLifecycleWrapper } from "@/components/FeedsLifecycleWrapper";
import BasicCalendarV2 from "@/components/Calendar/examples/BasicCalendarV2";
import { ViewMoreOfMyLocations } from "@/components/ViewMoreOfMyLocations";

export default async function Home() {
	const user = await currentUser();

	if (!user) {
		return (
			// TODO redirect to log in
			<div>Not signed in</div>
		);
	}

	return (
		<FeedsLifecycleWrapper>
			<div className="pageMargin">
				<TopNavWithAuth />
				<div className="grid grid-cols-12 gap-8 md:gap-12">
					<div className="col-span-9">
						<MainFeed />
					</div>
					<div className="col-span-3">
						<div className="mb-8">
							<BasicCalendarV2 />
						</div>
						<ViewMoreOfMyLocations />
					</div>
				</div>
			</div>
		</FeedsLifecycleWrapper>
	);
}
