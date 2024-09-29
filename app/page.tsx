"use client"

import React, { useEffect, useState } from "react";
import { Card, Image } from "@nextui-org/react";

import Lottie from 'lottie-react';

const LottieAnimation = ({ width, height }) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/construction.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading Lottie animation:', error));
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


export default function Page() {
  const [displayedText, setDisplayedText] = useState('');
  const [typingSpeed] = useState(50);
  const [text] = useState("hello hello! I'm Daniel 👾");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let timer;
    if (displayedText.length < text.length) {
      timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, typingSpeed);
    } else {
      setIsTypingComplete(true);
    }
    return () => clearTimeout(timer);
  }, [displayedText, text, typingSpeed]);

  return (
    <div className={'flex flex-col gap-4 animate-fadeIn h-[100rem]'}>
      <h1 className="font-semibold text-2xl tracking-tighter inline-flex items-center">
        {displayedText}
        {true && (
          <span className="w-[2px] h-[1.2em] bg-white ml-[2px] animate-caret"></span>
        )}
      </h1>
      <p className="">
        full-stack software engineer, ex SWE @ YC W21 and comp sci grad @ King's College London
      </p>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <Image
            className={'rounded-2xl hover:shadow-[0_10px_0_0] hover:shadow-primary hover:-translate-y-2 shadow-none duration-300'}
            src={'/static/selfies/daniel-on-amsterdam-stage.jpg'}
            alt={'me on stage'}
            width={340}
            height={280}
          />
        </div>
        <div className="flex items-center justify-center col-span-2 bg-light rounded-2xl hover:shadow-[0_10px_0_0] hover:shadow-tertiary hover:-translate-y-2 shadow-none duration-300">
          <LottieAnimation width={100} height={100} />
        </div>
        <div className="flex items-center justify-center col-span-3 bg-light rounded-2xl hover:shadow-[0_10px_0_0] hover:shadow-secondary hover:-translate-y-2 shadow-none duration-300 h-[10rem]">
          <LottieAnimation width={100} height={100} />
        </div>
        <div className="flex items-center justify-center col-span-1 bg-light rounded-2xl hover:shadow-[0_10px_0_0] hover:shadow-primary hover:-translate-y-2 shadow-none duration-300 h-[14rem]">
          <LottieAnimation width={100} height={100} />
        </div>
        <div className="flex items-center justify-center col-span-1 bg-light rounded-2xl hover:shadow-[0_10px_0_0] hover:shadow-secondary hover:-translate-y-2 shadow-none duration-300 h-[14rem]">
          <LottieAnimation width={100} height={100} />
        </div>
        <div className="flex items-center justify-center col-span-1 bg-light rounded-2xl hover:shadow-[0_10px_0_0] hover:shadow-tertiary hover:-translate-y-2 shadow-none duration-300 h-[14rem]">
          <LottieAnimation width={100} height={100} />
        </div>
      </div>
    </div>
  );
}