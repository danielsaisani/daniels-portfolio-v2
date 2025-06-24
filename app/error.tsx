'use client';

import { useEffect } from 'react';

export default function Error({
  error,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <p>Whoops! Something went wrong, I'm working on it!</p>
    </div>
  );
}
