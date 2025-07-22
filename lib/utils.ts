import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractTweetIds(content: string): string[] {
  const tweetMatches = content.match(/<StaticTweet\sid="[0-9]+"\s\/>/g) || [];
  return tweetMatches
    .map((tweet) => {
      const idMatch = tweet.match(/[0-9]+/g);
      return idMatch ? idMatch[0] : null;
    })
    .filter((id): id is string => id !== null);
}
