"use client"

import React, { useEffect, useState } from "react";

const Hero: React.FC = () => {

    const [displayedText, setDisplayedText] = useState('');
    const [typingSpeed1] = useState(10);
    const [typingSpeed2] = useState(10);
    const [text] = useState("hello hello! I'm Daniel");
    const [fullStackText, setFullStackDisplayedText] = useState('');
    const [fullStackTextOriginal] = useState("full-stack software engineer, ex-SWE @ Terra YC W21 and comp sci grad @ King's College London");
    const [isTypingComplete, setIsTypingComplete] = useState(false);
    const [isFullStackTypingComplete, setIsFullStackTypingComplete] = useState(false);
    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;
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
        let timer: string | number | NodeJS.Timeout | undefined;
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
                <></>}
        </div>
    )
}

export default Hero