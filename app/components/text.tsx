import React, { useEffect, useState } from "react";

interface TypingTextProps {
    text: string;
    typingSpeed?: number;
    className?: string;
    onComplete?: () => void;
    caretClassName?: string;
    caretStyle?: React.CSSProperties;
}

const TypingText: React.FC<TypingTextProps> = ({
    text,
    typingSpeed = 10,
    className = '',
    onComplete,
    caretClassName = '',
    caretStyle = {},
}) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;
        if (displayedText.length < text.length) {
            timer = setTimeout(() => {
                setDisplayedText(text.slice(0, displayedText.length + 1));
            }, typingSpeed);
        } else if (displayedText.length === text.length && onComplete) {
            onComplete();
        }
        return () => clearTimeout(timer);
    }, [displayedText, text, typingSpeed, onComplete]);

    return (
        <span className={className}>
            {displayedText}
            <span
                className={`w-[2px] h-[1.2em] bg-white ml-[2px] animate-caret ${caretClassName}`}
                style={caretStyle}
            ></span>
        </span>
    );
};

export default TypingText;