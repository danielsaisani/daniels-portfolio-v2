"use client"

import React, { useEffect, useState } from "react";
import { Card, Image } from "@nextui-org/react";
import { LottieAnimation } from "./components/Lottie";


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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center col-span-1 rounded-2xl hover:shadow-[0_10px_0_0] hover:shadow-primary hover:-translate-y-2 shadow-none duration-300">
          <Image
            className="rounded-2xl"
            src={'/static/selfies/daniel-on-amsterdam-stage.jpg'}
            alt={'me on stage'}
          />
        </div>
        <div className="flex items-center justify-center col-span-2 bg-light rounded-2xl hover:shadow-[0_10px_0_0] hover:shadow-tertiary hover:-translate-y-2 shadow-none duration-300">
          <LottieAnimation width={100} height={100} type={'building'} />
        </div>
        <div className="flex items-center justify-center col-span-3 bg-light rounded-2xl hover:shadow-[0_10px_0_0] hover:shadow-secondary hover:-translate-y-2 shadow-none duration-300 h-[10rem]">
          <LottieAnimation width={100} height={100} type={'building'} />
        </div>
        <div className="flex items-center justify-center col-span-1 bg-light rounded-2xl hover:shadow-[0_10px_0_0] hover:shadow-primary hover:-translate-y-2 shadow-none duration-300 h-[14rem]">
          <LottieAnimation width={100} height={100} type={'building'} />
        </div>
        <div className="flex items-center justify-center col-span-1 bg-light rounded-2xl hover:shadow-[0_10px_0_0] hover:shadow-secondary hover:-translate-y-2 shadow-none duration-300 h-[14rem]">
          <LottieAnimation width={100} height={100} type={'building'} />
        </div>
        <div className="flex items-center justify-center col-span-1 bg-light rounded-2xl hover:shadow-[0_10px_0_0] hover:shadow-tertiary hover:-translate-y-2 shadow-none duration-300 h-[14rem]">
          <LottieAnimation width={100} height={100} type={'building'} />
        </div>
      </div>
    </div>
  );
}