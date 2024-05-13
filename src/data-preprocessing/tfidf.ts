interface Keyword {
	word: string;
	occurrences: number;
	word_count: number;
	documents_containing_word: number;
}

interface Website {
	// Define your Website structure here
}

interface WebsiteKeywords {
    [websiteId: number]: [Keyword[], Website];
}

async function getTfIdfScores(
	documentCount: number,
	lemmatizedQuery: string[],
	websiteKeywords: WebsiteKeywords
): Promise<[number, Website][]> {
	const queryTermTfs: Map<string, number> = new Map();
	const queryWordOccurrences: Map<string, number> = new Map();

	lemmatizedQuery.forEach((word) => {
		queryWordOccurrences.set(
			word,
			(queryWordOccurrences.get(word) || 0) + 1
		);
	});

	lemmatizedQuery.forEach((word) => {
		const tf =
			(queryWordOccurrences.get(word) as number) / lemmatizedQuery.length;
		queryTermTfs.set(word, tf);
	});

	const websiteSimilarities: [number, Website][] = [];

	for (const [_, [keywords, website]] of Object.entries(websiteKeywords)) {
		let queryVectorSum = 0;
		let documentVectorSum = 0;
		let dotProduct = 0;

		keywords.forEach((keyword) => {
			const tf = keyword.occurrences / keyword.word_count;
			const idf = 1 + documentCount / keyword.documents_containing_word;
			const tfIdf = tf * Math.log(idf);

			const queryTfIdf =
				(queryTermTfs.get(keyword.word) as number) * Math.log(idf);
			queryVectorSum += Math.pow(queryTfIdf, 2);
			documentVectorSum += Math.pow(tfIdf, 2);

			dotProduct += queryTfIdf * tfIdf;
		});

		const queryVector = Math.sqrt(queryVectorSum);
		const documentVector = Math.sqrt(documentVectorSum);
		const similarity = dotProduct / (queryVector * documentVector);
		websiteSimilarities.push([similarity, website]);
	}

	return websiteSimilarities;
}
