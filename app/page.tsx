"use client"

import React, { useEffect, useState } from "react";
import { Card, Image, Link } from "@nextui-org/react";
import { LottieAnimation } from "./components/ui/lottie";
import Project from "./components/ui/project";
import { ClickyCard } from "./components/ui/clicky-card";


export default function Page() {
  const [displayedText, setDisplayedText] = useState('');
  const [typingSpeed1] = useState(50);
  const [typingSpeed2] = useState(20);
  const [text] = useState("hello hello! I'm Daniel 👾");
  const [fullStackText, setFullStackDisplayedText] = useState('');
  const [fullStackTextOriginal] = useState("full-stack software engineer, ex-SWE @ Terra YC W21 and comp sci grad @ King's College London");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isFullStackTypingComplete, setIsFullStackTypingComplete] = useState(false);

  useEffect(() => {
    let timer;
    if (displayedText.length < text.length) {
      timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, typingSpeed1);
    } else {
      setIsTypingComplete(true);
    }
    return () => clearTimeout(timer);
  }, [displayedText, text, typingSpeed1]);

  useEffect(() => {
    let timer;
    if (fullStackText.length < fullStackTextOriginal.length && isTypingComplete) {
      timer = setTimeout(() => {
        setFullStackDisplayedText(fullStackTextOriginal.slice(0, fullStackText.length + 1));
      }, typingSpeed2);
    } else if (fullStackText.length >= fullStackTextOriginal.length) {
      setIsFullStackTypingComplete(true);
    }
    return () => clearTimeout(timer);
  }, [fullStackText, fullStackTextOriginal, typingSpeed2, isTypingComplete]);

  return (
    <div className={'flex flex-col gap-4 animate-fadeIn h-screen'}>
      <h1 className="font-semibold text-2xl tracking-tighter inline-flex items-center">
        {displayedText}
        <span className="w-[2px] h-[1.2em] bg-white ml-[2px] animate-caret"></span>
      </h1>
      <p className="tracking-tighter">
        {fullStackText}
        <span
          className="w-[2px] h-[1.2em] bg-white inline-block animate-caret"
          style={{
            verticalAlign: 'middle',
            marginLeft: '3px',
            display: 'inline-block'
          }}
        ></span>
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
