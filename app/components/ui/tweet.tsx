"use client"; // Add this line

import { getTweet } from 'react-tweet/api';
import { useState, useEffect, Suspense } from 'react'; // Added useState, useEffect
import {
  TweetSkeleton,
  EmbeddedTweet,
  TweetNotFound,
  type TweetProps,
} from 'react-tweet';
import './tweet.css';

// Define a type for the tweet object if not fully covered by TweetProps or if TweetProps is complex
// react-tweet's TweetProps often implies the structure of the 'tweet' object itself,
// but for clarity, we can use 'any' or a more specific type from the library if available.
// For now, we'll assume `Tweet` type is implicitly part of what `getTweet` returns.
// Let's use the type from the library if possible, or define one.
// `getTweet` returns Promise<Tweet | undefined>. `Tweet` type is from 'react-tweet'
import type { Tweet } from 'react-tweet';

// TweetContentInternal now handles its own data fetching and state
const TweetContentInternal = ({ id, components, onError, ...props }: TweetProps) => {
  const [tweet, setTweet] = useState<Tweet | undefined | null>(null); // Can be Tweet, undefined, or null if error/not found
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setError(new Error("Tweet ID is missing."));
      setTweet(null); // Ensure tweet state is cleared
      return;
    }

    setIsLoading(true);
    setTweet(null); // Reset tweet state on new ID
    setError(null); // Reset error state

    getTweet(id)
      .then((fetchedTweet) => {
        setTweet(fetchedTweet); // fetchedTweet can be Tweet or undefined
      })
      .catch((err) => {
        console.error(`Failed to fetch tweet ${id}:`, err);
        if (onError) {
          onError(err); // Call original onError if provided
        }
        setError(err);
        setTweet(null); // Ensure tweet is null on error
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id, onError]); // `onError` can be part of dependencies if it's stable or memoized

  if (isLoading) {
    return <TweetSkeleton {...props} />;
  }

  // If there was an error, or if tweet is explicitly null (after error) or undefined (from getTweet)
  if (error || !tweet) {
    const NotFound = components?.TweetNotFound || TweetNotFound;
    // Pass the caught error to NotFound if it expects an error prop
    // TweetNotFound from react-tweet typically doesn't take an error prop in its default usage.
    // It's usually rendered when the tweet data itself is null/undefined.
    return <NotFound />;
  }

  return <EmbeddedTweet tweet={tweet} components={components} {...props} />;
};

// ReactTweet is the main component that uses TweetContentInternal
export const ReactTweet = (props: TweetProps) => {
  // Pass all props to TweetContentInternal
  return <TweetContentInternal {...props} />;
};

// TweetComponent remains the wrapper that CustomMDX uses
// It's no longer async
export function TweetComponent({ id }: { id: string }) {
  return (
    <div className="tweet my-6">
      <div className={`flex justify-center`}>
        {/* Suspense remains useful here if ReactTweet or TweetContentInternal were to use useSuspenseQuery or similar */}
        {/* For now, with useEffect fetching, TweetContentInternal handles its own skeleton. */}
        {/* We can remove Suspense if TweetSkeleton is exclusively handled by TweetContentInternal */}
        {/* <Suspense fallback={<TweetSkeleton />}>  */}
        <ReactTweet id={id} />
        {/* </Suspense> */}
      </div>
    </div>
  );
}
