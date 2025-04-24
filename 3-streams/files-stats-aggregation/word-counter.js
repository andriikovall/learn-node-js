export function countWords(text, keywords = []) {
  if (!text || typeof text !== "string") {
    return { totalWords: 0, counts: {} };
  }

  const result = {
    totalWords: 0,
    counts: Object.fromEntries(keywords.map((kw) => [kw, 0])),
  };

  const words = text
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  result.totalWords = words.length;

  for (const word of words) {
    for (const keyword of keywords) {
      if (word === keyword.toLowerCase()) {
        result.counts[keyword]++;
      }
    }
  }

  return result;
}
