import { v4 as uuidv4 } from "uuid";
import QueryBuilder from "./queryBuilder";

async function crawler(words: string[]){
    const wordIndicies: Record<string, number> = {};
    const keywordIds: Record<string, string> = {};
    const wordPositions: number[] = [];
    const wordIds: string[] = [];
    
    let wordPos = 0;
    let keywordIdsLength = 0;
    
    
    words.forEach((word) => {
        if (wordIndicies[word]) wordIndicies[word]++;
        else wordIndicies[word] = 1;
    
        if (!keywordIds[word]) {
            keywordIds[word] = uuidv4();
            keywordIdsLength++;
        }
    
        wordIds.push(keywordIds[word]);
        wordPositions.push(++wordPos);
    });
    
    const websiteId = uuidv4();
    // Not really neccesary and quite unoptimised, but is fine for now. TODO: Fix this
    const websiteIdsBatch = words.map(() => websiteId);
    
    const wordIndiciesBatch = words.map((word) => wordIndicies[word]);
    
    try {
        await QueryBuilder.insert(
            "websites",
            ["id", "title", "description", "url", "word_count", "rank"],
            [websiteId, pageTitle, pageDescription, url, words.length, this.rank]
        );
    
        const { rows: keywordRows } = await QueryBuilder.insertManyOrUpdate(
            "keywords",
            ["id", "word", "documents_containing_word"],
            [
                Object.values(keywordIds),
                Object.keys(keywordIds),
                new Array<number>(keywordIdsLength).fill(1), // Ew
            ],
            ["UUID", "VARCHAR(45)", "BIGINT"],
            ["word"],
            "documents_containing_word = keywords.documents_containing_word + 1",
            ["word", "id"]
        );
    
        const updatedWordIdsMap: Record<string, string> = {};
    
        keywordRows.forEach(({ word, id }) => {
            updatedWordIdsMap[word] = id;
        });
    
        const updatedWordIds: string[] = [];
    
        words.forEach((word) => {
            updatedWordIds.push(updatedWordIdsMap[word]);
        });
    
        await QueryBuilder.insertMany(
            "website_keywords",
            ["keyword_id", "website_id", "occurrences", "position"],
            [updatedWordIds, websiteIdsBatch, wordIndiciesBatch, wordPositions],
            ["UUID", "UUID", "INT", "INT"]
        );
    
        console.log(`Succesfully crawled: ${url}`);
    } catch (e) {
        console.log(`[WARNING]: Failed to index: ${url}\n\n${e}`);
    }
}
