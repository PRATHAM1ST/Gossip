const lemmatizedMap: any = require("./lemmatizedMap.json");
// const stopWords: any = require("./stopwords-all.json");

export function lemmatize(word: string): string {
	return lemmatizedMap[word] || word;
}

// export function removeStopWords(words: string[]): string[] {
//     const englishStopWords = stopWords["en"];
// 	return words.filter((word) => !englishStopWords.includes(word));
// }

export function removePunctuation(text: string): string {
	return text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");
}

export function removeHTMLTags(text: string): string {
	return text.replace(/<[^>]*>/g, "");
}

export function dataCleaning(text: string): string {
	text = removeHTMLTags(text);
	text = removePunctuation(text);
	const words = text.split(" ");
	const cleanedWords = words.map((word) => lemmatize(word.toLowerCase()));
	return cleanedWords.join(" ");
}
