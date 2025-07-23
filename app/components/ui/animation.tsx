"use client"

import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
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
    return null
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