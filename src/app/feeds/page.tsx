import Image from "next/image";
import { currentUser } from '@clerk/nextjs';
import { Hero } from '@/components/hero';
import { TopNavWithAuth } from '@/components/topNav';

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
			<Hero />
		</div>
	);
}

