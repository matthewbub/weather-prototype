const labels = {
	heroText: "Our Loved One's Are Everywhere",
	heroDescription: "Create a daily weather and news feed specific to your preferred locations. Share with your friends and family.",
}

export function Hero() {
  return (
    <div className="text-center">

			<h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
				Our Loved One's Are Everywhere
			</h1>
			<p className="mt-6 text-lg leading-8 text-gray-300">
				Create a daily weather and news feed specific to your preferred locations. Share with your friends and family.
			</p>
			<div className="mt-10 flex items-center justify-center gap-x-6">
				<a
					href="/sign-up"
					className="primaryBtn"
				>
					Create a feed for free
				</a>
				<a href="/feeds" className="text-sm font-semibold leading-6 text-white">
					My feeds <span aria-hidden="true">→</span>
				</a>
			</div>
		</div>
  )
}
