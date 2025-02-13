"use client"

import React, { useEffect, useState } from "react";
import { Card, Image, Link } from "@nextui-org/react";
import { LottieAnimation } from "./components/ui/lottie";
import Project from "./components/ui/project";
import { ClickyCard } from "./components/ui/clicky-card";


export default function Page() {
  const [displayedText, setDisplayedText] = useState('');
  const [typingSpeed] = useState(50);
  const [text] = useState("hello hello! I'm Daniel 👾");
  const [fullStackText, setFullStackDisplayedText] = useState('');
  const [fullStackTextOriginal] = useState("full-stack software engineer, SWE @ YC W21 and comp sci grad @ King's College London");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isFullStackTypingComplete, setIsFullStackTypingComplete] = useState(false);

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

  useEffect(() => {
    let timer;
    if (fullStackText.length < fullStackTextOriginal.length && isTypingComplete) {
      timer = setTimeout(() => {
        setFullStackDisplayedText(fullStackTextOriginal.slice(0, fullStackText.length + 1));
      }, typingSpeed);
    } else if (fullStackText.length >= fullStackTextOriginal.length) {
      setIsFullStackTypingComplete(true);
    }
    return () => clearTimeout(timer);
  }, [fullStackText, fullStackTextOriginal, typingSpeed, isTypingComplete]);

  return (
    <div className={'flex flex-col gap-4 animate-fadeIn h-screen'}>
      <h1 className="font-semibold text-2xl tracking-tighter inline-flex items-center">
        {displayedText}
        {true && (
          <span className="w-[2px] h-[1.2em] bg-white ml-[2px] animate-caret"></span>
        )}
      </h1>
      <p className="tracking-tighter inline-flex items-center">
        {fullStackText}
        {true && (
          <span className="w-[1px] h-[1.2em] bg-white ml-[6px] animate-caret"></span>
        )}
      </p>
      <div className="">
      </div>
    </div>
  );
}
























// Removed temporarily
{/* <ClickyCard type={"primary"}>
          <Image
            className="rounded-2xl"
            src={'/static/selfies/daniel-on-amsterdam-stage.jpg'}
            alt={'me on stage'}
          />
        </ClickyCard>
        <ClickyCard type={"tertiary"}>
          <Link href={'https://www.tiktok.com/@clipscartel'} target={'_blank'}>
            <Image
              removeWrapper
              alt="tiktok incubator"
              className="z-0 w-full h-full object-cover rounded-3xl"
              src="/static/tiktok.png"
            />
          </Link>
        </ClickyCard>
        <ClickyCard type={"secondary"}>
          <Link href={'https://github.com/DxnielKS/path-finder'} target={'_blank'}>
            <Image
              removeWrapper
              alt="path finder"
              className="z-0 w-full h-full object-cover rounded-3xl"
              src="/static/path-finder.gif"
            />
          </Link>
        </ClickyCard>
        <ClickyCard type="primary">
          <Project projectPicture={'project-2.gif'} projectUrl={'https://github.com/DxnielKS/pacman-mdp'} />
        </ClickyCard>
        <ClickyCard type="secondary">
          <Project projectPicture={'project-5.png'} projectUrl={'https://turingmachines.netlify.app/'} />
        </ClickyCard>
        <ClickyCard type="tertiary">
          <Project projectPicture={'tourbi.png'} projectUrl={'https://github.com/DxnielKS/tour-bi'} />
        </ClickyCard> */}