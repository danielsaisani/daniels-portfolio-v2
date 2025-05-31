"use client";

import { getTweet } from 'react-tweet/api';
import { useState, useEffect, Suspense } from 'react';
import {
  TweetSkeleton,
  EmbeddedTweet,
  TweetNotFound,
  type Tweet, // Consolidate type import
  type TweetProps,
} from 'react-tweet';
import './tweet.css';

// TweetContentInternal now handles its own data fetching and state
const TweetContentInternal = ({ id, components, onError, ...props }: TweetProps) => {
  // Use Tweet | null for state, mapping undefined from getTweet to null
  const [tweet, setTweet] = useState<Tweet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

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
      .then((fetchedTweet) => {
        // If fetchedTweet is undefined (not found by API), set state to null
        setTweet(fetchedTweet || null);
      })
      .catch((err) => {
        console.error(`Failed to fetch tweet ${id}:`, err);
        if (onError) {
          onError(err);
        }
        setError(err);
        setTweet(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id, onError]);

  if (isLoading) {
    return <TweetSkeleton {...props} />;
  }

  if (error || !tweet) { // If error exists or tweet is null
    const NotFound = components?.TweetNotFound || TweetNotFound;
    return <NotFound />;
  }

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
