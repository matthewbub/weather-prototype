import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { Hero } from "@/components/hero";
import { TopNavWithAuth } from "@/components/topNav";
import { Cobe } from "@/components/globe";
import { TopNewsInUs } from "@/components/News";

export default async function Home() {
	return (
		<div className="pageMargin w-full">
			<TopNavWithAuth />
			<TopNewsInUs />
		</div>
	);
}
