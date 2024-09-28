"use client"

import React, { useEffect, useState } from "react";
import { Image } from "@nextui-org/react";

export default function Page() {
  const [displayedText, setDisplayedText] = useState('');
  const [typingSpeed] = useState(50);
  const [text] = useState("hey there, i'm Daniel 👾");
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
    <div className={'animate-fadeIn'}>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter inline-flex items-center">
        {displayedText}
        {true && (
          <span className="w-[2px] h-[1.2em] bg-black dark:bg-white ml-[2px] animate-caret"></span>
        )}
      </h1>
      <p className="prose prose-neutral dark:prose-invert">
        full-stack software engineer @ terra YC W21 and comp sci grad from KCL
      </p>
      <div className="prose prose-neutral dark:prose-invert">
        <Image 
          className={'rounded-2xl hover:scale-[1.05] duration-200'} 
          src={'/static/selfies/daniel-on-amsterdam-stage.jpg'} 
          alt={'me on stage'} 
          width={200} 
          height={200} 
        />
      </div>
    </div>
  );
}