'use client';

import { useEffect } from "react"
import { globalStore } from "@/store";
import { ExternalLinkIcon } from "./icons";
import clsx from "clsx";

export const TopNewsInUs = () => {
	const news = globalStore((state) => state.topNews);
	const setNews = globalStore((state) => state.setTopNews);

	useEffect(() => {
		const getNews = async () => {
			const news = await fetch('/api/news');
			const newsData = await news.json();

			if (newsData.error) {
				console.error('Error fetching news:', newsData.message);
				return;
			}

			setNews(newsData);
		}

		getNews();
	}, []);

	return (
		<div>
			<h2 className="text-3xl font-serif">Top News in the US</h2>
			<div className="mt-10 grid grid-cols-12 gap-4">
				{news.data.articles.map((article: {
					title: string;
					urlToImage: string;
					description: string;
					source: {
						name: string;
					};
					publishedAt: string;
					author: string;
				}) => (
					<div key={article.title} className={clsx(
						"col-span-12 md:col-span-6 lg:col-span-4",
						"border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white"
						)}>
						<img
							src={article.urlToImage}
							alt={article.title}
							className="aspect-video object-cover"
							height="200"
						/>
						<div className="p-4">
							<h2 className="text-2xl font-bold leading-tight mb-2 text-gray-800 font-serif">{article.title}<ExternalLinkIcon className="ml-0.5 pb-1"/></h2>
							<p className="text-gray-600 text-sm mb-4">{article.description}</p>
							<div className="flex justify-between items-center text-gray-500 text-xs">
								<p>{article.source.name}</p>
								<p>{new Date(article.publishedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
							</div>
							<p className="text-right text-gray-500 text-xs italic mt-2">{article.author}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

