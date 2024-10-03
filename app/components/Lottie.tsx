"use client"

import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

interface LottieAnimationProps {
  width: number
  height: number
  type: 'writing' | 'building'
}

export const LottieAnimation = ({ width, height, type }: LottieAnimationProps) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    if (type == 'writing') {
      fetch('/writing.json')
        .then(response => response.json())
        .then(data => setAnimationData(data))
        .catch(error => console.error('Error loading Lottie animation:', error));
    }
    else {
      fetch('/construction.json')
        .then(response => response.json())
        .then(data => setAnimationData(data))
        .catch(error => console.error('Error loading Lottie animation:', error));
    }
  }, []);

  if (!animationData) {
    return <div>Loading animation...</div>;
  }

  return (
    <div style={{ width, height }}>
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
      />
    </div>
  );
};