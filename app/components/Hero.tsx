"use client"

import React, { useState } from "react";
import TypingText from "./text";

const Hero: React.FC = () => {
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    return (
        <div className={'flex flex-col gap-4 animate-fadeIn h-screen'}>
            <h1 className="font-semibold text-2xl tracking-tighter inline-flex items-center">
                <TypingText
                    text={"hello hello! I'm Daniel"}
                    typingSpeed={10}
                    onComplete={() => setIsTypingComplete(true)}
                />
            </h1>
            <p className="tracking-tighter">
                {isTypingComplete && (
                    <TypingText
                        text={"full-stack software engineer, ex-SWE @ Terra YC W21 and comp sci grad @ King's College London"}
                        typingSpeed={10}
                        caretClassName="bg-white align-middle ml-[3px] inline-block"
                    />
                )}
            </p>
        </div>
    );
};

export default Hero;