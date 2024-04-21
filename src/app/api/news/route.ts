import { failResponse, okResponse } from "@/utils/response";

type NewsApiResponse = {
	status: string;
	totalResults: number;
	articles: any[];
}

function removeRedactedArticles(articles: any) {
	return articles.filter((article: any) => article.title !== "[Removed]");
}

function removeImagelessArticles(articles: any) {
	return articles.filter((article: any) => article.urlToImage !== null);
}

export async function GET() {
	const url = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=' + process.env.NEWS_API;
	const newsData = await fetch(url)
	
	const parsedData: NewsApiResponse = await newsData.json();
	if (parsedData.status !== "ok") {
		return failResponse("Something wen't wrong. Please try again later.");
	}

	parsedData.articles = removeRedactedArticles(parsedData.articles);
	parsedData.articles = removeImagelessArticles(parsedData.articles);

	return okResponse(parsedData);
}
