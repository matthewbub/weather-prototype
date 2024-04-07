import Image from "next/image";
import { currentUser } from '@clerk/nextjs';
import { Hero } from '@/components/hero';
import { TopNavWithAuth } from '@/components/topNav';
import { Cobe } from "@/components/globe";

export default async function Home() {
	return (
		<div className="pageMargin w-full">
			<TopNavWithAuth />
			<div className="mt-40">
				<div className="relative">
					<div className="absolute -top-20 w-full flex justify-center">
						<Cobe />
					</div>
					<div className="primaryBg relative z-10 py-4 top-[200px] pb-20">
						<Hero />
					</div>
				</div>
			</div>
		</div>
	);
}

