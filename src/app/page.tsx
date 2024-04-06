import Image from "next/image";
import { currentUser } from '@clerk/nextjs';

export default async function Home() {
	const user = await currentUser();
 
  if (!user) {
		return (
			<div>Not signed in</div>
		)
	};
 	
  return (
		<div className="flex items-center space-x-2">
			<img
				src={user.imageUrl}
				alt="Profile Picture"
				className="rounded-full h-16 w-16"
			/>
			<h1 className="text-white text-sm">{user.emailAddresses[0].emailAddress}</h1>	
		</div>
	);
}
