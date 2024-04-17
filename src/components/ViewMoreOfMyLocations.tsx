export const ViewMoreOfMyLocations = () => {
	// const { data, error, isLoading } = useQuery('myLocations', () => {
	// 	return fetch('/api/my-locations').then(res => res.json());
	// });

	// if (isLoading) return <p>Loading...</p>;
	// if (error) return <p>Error: {error.message}</p>;

	return (
		<div>
			<div className='mb-4'>
				<h3 className='text-lg font-bold'>{'My locations'}</h3>
			</div>
			<ul>
				{/* {data.locations.map((location: any) => (
					<li key={location.id}>{location.name}</li>
				))} */}
			</ul>
		</div>
	);
}