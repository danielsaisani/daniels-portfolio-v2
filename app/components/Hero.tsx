"use client"

import React, { useState } from "react";
import TypingText from "./ui/text";
import BulletJournalText from "./ui/BulletJournalText";
import { AnimatePresence, motion } from "framer-motion";

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
                        text={"full-stack software engineer, ex-SWE @ Terra YC W21 and comp sci grad @ King's College London"}
                        typingSpeed={10}
                        caretClassName="bg-white align-middle ml-[3px] inline-block"
                        onComplete={() => setisBioTypingComplete(true)}
                    />
                )}
            </p>
            {isBioTypingComplete && (
                <AnimatePresence>
                    <motion.div className="mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <BulletJournalText text="[ ] An open task" />
                        <BulletJournalText text="[X] A completed task" />
                        <BulletJournalText text="o An event">
                            <BulletJournalText text="o you've been confused by the presence of this bullet point, but then you remember a disclaimer I left on a previous blog, and now.. you understand" />
                        </BulletJournalText>
                        <BulletJournalText text="- A standard note">
                            <BulletJournalText text="- An indented note" >
                                <BulletJournalText text="- Another indented note" />
                            </BulletJournalText>
                        </BulletJournalText>
                        <BulletJournalText text="!- An important note" />
                    </motion.div>
                </AnimatePresence>)}
        </div>

    );
};

export default Hero;