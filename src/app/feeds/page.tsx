import Image from "next/image";
import { currentUser } from '@clerk/nextjs';
import { Hero } from '@/components/hero';
import { TopNavWithAuth } from '@/components/topNav';
import { FeedList } from "@/components/feedList";
import { Feed } from "@/components/feed";
import { LocationLookup } from "@/components/LocationLookup";

export default async function Home() {
	const user = await currentUser();
 
  if (!user) {
		return (
			<div>Not signed in</div>
		)
	};
 	
  return (
		<div className="pageMargin">
			<TopNavWithAuth />
			<div className="w-full grid grid-cols-12">
				<div className="md:col-span-3 col-span-12">
					<FeedList />
				</div>
				<div className="md:col-span-9 col-span-12">
					<LocationLookup />
					<Feed />
				</div>
			</div>
		</div>
	);
}

