"use client";

import { getTweet } from 'react-tweet/api'; // Ensure getTweet is imported
import { useState, useEffect, Suspense } from 'react';
import {
  TweetSkeleton,
  EmbeddedTweet,
  TweetNotFound,
  type TweetProps // Keep if used for props typing
  // Remove 'type Tweet as TweetData' or 'type Tweet' if it was explicitly imported for useState before
} from 'react-tweet';
import './tweet.css';

// Infer the type of the tweet data from the getTweet function
// This creates a type that matches exactly what getTweet returns (Tweet | undefined)
type InferredTweetDataFromGetTweet = Awaited<ReturnType<typeof getTweet>>;

// For useState, we typically want to store the Tweet object itself or null if not found/error.
// getTweet returns Tweet | undefined. So InferredTweetData will be Tweet | undefined.
// We can make our state explicitly Tweet | null.
type TweetState = Extract<InferredTweetDataFromGetTweet, object> | null;


const TweetContentInternal = ({ id, components, onError, ...props }: TweetProps) => {
  // Use the inferred type for state, coercing undefined to null.
  const [tweet, setTweet] = useState<TweetState>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // It's good practice to type error more specifically if possible, e.g., Error | null
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setError(new Error("Tweet ID is missing."));
      setTweet(null);
      return;
    }

    setIsLoading(true);
    setTweet(null);
    setError(null);

    getTweet(id)
      .then((fetchedTweet: InferredTweetDataFromGetTweet) => {
        // If fetchedTweet is undefined (not found by API), set state to null
        setTweet(fetchedTweet || null);
      })
      .catch((err) => {
        console.error(`Failed to fetch tweet ${id}:`, err);
        if (onError) {
          onError(err);
        }
        setError(err instanceof Error ? err : new Error('Failed to fetch tweet'));
        setTweet(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id, onError]);

  if (isLoading) {
    return <TweetSkeleton />;
  }

  if (error || !tweet) {
    const NotFound = components?.TweetNotFound || TweetNotFound;
    // Pass the error to NotFound if it's designed to accept one
    // The default TweetNotFound from 'react-tweet' doesn't typically use an error prop.
    // So, if 'error' is the primary reason for not found, that's fine.
    return <NotFound />;
  }

  // The type of 'tweet' here is Tweet (extracted from Tweet | undefined)
  // EmbeddedTweet expects 'Tweet' from 'react-tweet'
  return <EmbeddedTweet tweet={tweet} components={components} {...props} />;
};

export const ReactTweet = (props: TweetProps) => {
  return <TweetContentInternal {...props} />;
};

export function TweetComponent({ id }: { id: string }) {
  return (
    <div className="tweet my-6">
      <div className={`flex justify-center`}>
        <ReactTweet id={id} />
      </div>
    </div>
  );
}
