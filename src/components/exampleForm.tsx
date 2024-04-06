'use client';
import React, { useState } from 'react';

export const ExampleForm = () => {
	const [userInfo, setUserInfo] = useState({
		username: '',
		firstName: '',
		lastName: '',
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUserInfo({
			...userInfo,
			[name]: value,
		});
	};

	const handleAddName = () => {
		console.log(userInfo);
		
		setUserInfo({
			username: '',
			firstName: '',
			lastName: '',
		});
	};

	return (
		<div>
			<input
				type="text"
				name="username"
				placeholder="Username"
				value={userInfo.username}
				onChange={handleInputChange}
			/>
			<input
				type="text"
				name="firstName"
				placeholder="First Name"
				value={userInfo.firstName}
				onChange={handleInputChange}
			/>
			<input
				type="text"
				name="lastName"
				placeholder="Last Name"
				value={userInfo.lastName}
				onChange={handleInputChange}
			/>
			<button onClick={handleAddName} className='primaryBtn'>Add Name</button>

		</div>
	);
};