"use client";

import { getTweet } from 'react-tweet/api';
import { useState, useEffect, Suspense } from 'react';
import {
  TweetSkeleton,
  EmbeddedTweet,
  TweetNotFound,
  type Tweet as TweetData, // Renamed type import
  type TweetProps,
} from 'react-tweet';
import './tweet.css';

// TweetContentInternal now handles its own data fetching and state
const TweetContentInternal = ({ id, components, onError, ...props }: TweetProps) => {
  // Use TweetData | null for state
  const [tweet, setTweet] = useState<TweetData | null>(null);
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

  // When passing to EmbeddedTweet, it expects a prop named 'tweet' of type 'Tweet' (original name from library)
  // So, we pass the 'tweet' state variable which is of type TweetData (our alias for Tweet)
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
