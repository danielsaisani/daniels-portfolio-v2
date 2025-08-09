"use client"

import React, { useState } from "react";
import { TypingText } from "./ui/text";
import BulletJournalText from "./ui/BulletJournalText";
import { motion } from "framer-motion";

const Hero: React.FC = () => {
    const [isHeaderTypingComplete, setisHeaderTypingComplete] = useState(false);
    const [isBioTypingComplete, setisBioTypingComplete] = useState(false);

    return (

        <div className={'flex flex-col gap-4 animate-fadeIn h-screen'}>

            <h1 className="font-semibold text-2xl tracking-tighter inline-flex items-center">
                <TypingText
                    text={"hello hello! I'm Danny"}
                    typingSpeed={10}
                    onComplete={() => setisHeaderTypingComplete(true)}
                />
            </h1>

            <p className="tracking-tighter">
                {isHeaderTypingComplete && (
                    <TypingText
                        text={"currently a software engineer @ cisco, ex-swe @ terra yc w21 and comp sci grad @ king's college london"}
                        typingSpeed={10}
                        caretClassName="bg-white align-middle ml-[3px] inline-block"
                        onComplete={() => setisBioTypingComplete(true)}
                    />
                )}
            </p>
            {isBioTypingComplete && (
                <motion.div className="mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <BulletJournalText text="[ ] An open task" />
                    <BulletJournalText text="[X] A completed task" />
                    <BulletJournalText text="o you've been confused by the presence of this bullet point, but then you remember a disclaimer I left on a previous blog, and now.. you understand" />
                    <BulletJournalText text="- A standard note">
                        <BulletJournalText text="- An indented note" >
                            <BulletJournalText text="- Another indented note" />
                        </BulletJournalText>
                    </BulletJournalText>
                    <BulletJournalText text="!- An important note" />
                </motion.div>
            )}

            {/* TODO: Add NPB Landing Page As Project + Outcomes */}
            {/* TODO: Add Tiktok Bot As Project */}
            {/* TODO: Add Path Finder As Project */}
            {/* TODO: Add Turing Machine Visualiser As Project */}


        </div>

    );
};

export default Hero;