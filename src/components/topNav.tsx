import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export const TopNavWithAuth = () => {
	return (
		<nav className="my-8 w-full flex flex-col md:flex-row md:items-center md:justify-between">
			<div className="border-b border-white pb-4 md:pb-0 md:border-none">
				<h1 className="text-xl font-black whitespace-nowrap">Family Feed</h1>
				<span className="text-sm whitespace-nowrap">
					Privacy focused & family first
				</span>
			</div>
			<ul className="w-full flex space-x-1.5 items-center justify-end mt-12 md:mt-0">
				<li>
					<a href="/" className="secondaryBtn">
						Home
					</a>
				</li>
				<li>
					<a href="/feeds" className="secondaryBtn">
						My Feeds
					</a>
				</li>
				<SignedIn>
					<li>
						<UserButton />
					</li>
				</SignedIn>
				<SignedOut>
					<li>
						<SignInButton>
							<a href="/sign-in" className="secondaryBtn">
								Sign in
							</a>
						</SignInButton>
					</li>
				</SignedOut>
			</ul>
		</nav>
	);
};
