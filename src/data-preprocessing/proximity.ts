interface Keyword {
	word: string;
	position: number;
}

interface WebsiteKeywords {
	[websiteId: string]: [Keyword[], any];
}

function getProximities(
	lemmatizedQuery: string[],
	websiteKeywords: WebsiteKeywords
): number[] {
	const proximities: number[] = [];

	for (const [, [keywords]] of Object.entries(websiteKeywords)) {
		const proximity = getWebsiteProximity(lemmatizedQuery, keywords);
		proximities.push(proximity);
	}

	return proximities;
}

function getWebsiteProximity(
	lemmatizedQuery: string[],
	keywords: Keyword[]
): number {
	const clusters: Map<string, number>[] = [];
	let currentCluster: Map<string, number> = new Map();
	let totalFulfillment = 0;
	const wordPositions: number[] = [];

	for (let idx = 0; idx < keywords.length; idx++) {
		const keyword = keywords[idx];
		wordPositions.push(keyword.position);

		if (currentCluster.has(keyword.word)) {
			totalFulfillment += currentCluster.size / lemmatizedQuery.length;
			clusters.push(new Map(currentCluster));
			currentCluster.clear();
			currentCluster.set(keyword.word, keyword.position);
			continue;
		}

		currentCluster.set(keyword.word, keyword.position);
		if (idx === keywords.length - 1) {
			totalFulfillment += currentCluster.size / lemmatizedQuery.length;
			clusters.push(new Map(currentCluster));
		}
	}

    
	let fulfillment = 0;
	if (clusters.length !== 0) {
		fulfillment = totalFulfillment / clusters.length;
	}

	let totalDistance = 0;
	for (let i = 0; i < wordPositions.length - 1; i++) {
		const position = wordPositions[i];
		const nextPosition = wordPositions[i + 1];
		const distance = nextPosition - position - 1;
		if (distance > lemmatizedQuery.length) {
			continue;
		}
		totalDistance += distance;
	}

	let proximity = 0;
	if (clusters.length > 0) {
		proximity = 1 - totalDistance / keywords.length;
	}

	return proximity * fulfillment;
}
