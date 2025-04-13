"use client"

import React, { useEffect, useState } from "react";
import { Image } from "@nextui-org/react";
import { LottieAnimation } from "./components/ui/lottie";
import { motion, AnimatePresence } from "framer-motion";


export default function Page() {
  const [displayedText, setDisplayedText] = useState('');
  const [typingSpeed1] = useState(20);
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
      {isFullStackTypingComplete &&
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10">
            <motion.div
              key={1}
              style={{ position: "relative" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center col-span-1 rounded-2xl">
              <Image
                className="rounded-2xl"
                src={'/static/selfies/daniel-on-amsterdam-stage.jpg'}
                alt={'me on stage'}
              />
            </motion.div>
            <motion.div
              key={2}
              style={{ position: "relative" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
              className="flex items-center justify-center col-span-2 bg-light rounded-2xl">
              <LottieAnimation width={100} height={100} type={'building'} />
            </motion.div>
            <motion.div
              key={3}
              style={{ position: "relative" }}

              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
              className="flex items-center justify-center col-span-3 bg-light rounded-2xl h-[10rem]">
              <LottieAnimation width={100} height={100} type={'building'} />
            </motion.div>
            <motion.div
              key={4}
              style={{ position: "relative" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
              className="flex items-center justify-center col-span-1 bg-light rounded-2xl h-[14rem]">
              <LottieAnimation width={100} height={100} type={'building'} />
            </motion.div>
            <motion.div
              key={5}
              style={{ position: "relative" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
              className="flex items-center justify-center col-span-1 bg-light rounded-2xl h-[14rem]">
              <LottieAnimation width={100} height={100} type={'building'} />
            </motion.div>
            <motion.div
              key={6}
              style={{ position: "relative" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
              className="flex items-center justify-center col-span-1 bg-light rounded-2xl h-[14rem]">
              <LottieAnimation width={100} height={100} type={'building'} />
            </motion.div>
          </div>
        </AnimatePresence>}
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
