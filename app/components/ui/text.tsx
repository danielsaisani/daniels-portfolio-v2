import React, { useEffect, useState } from "react";

interface TypingTextProps {
    text: string;
    typingSpeed?: number;
    className?: string;
    onComplete?: () => void;
    caretClassName?: string;
    caretStyle?: React.CSSProperties;
    children?: React.ReactNode;
}

const TypingText: React.FC<TypingTextProps> = ({
    text,
    typingSpeed = 10,
    className = '',
    onComplete,
    caretClassName = '',
    caretStyle = {},
    children,
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    let symbol: React.ReactNode = null;
    let content = text;

    if (text.startsWith('[X] ')) {
        symbol = <span className="mr-2">⊗</span>;
        content = text.substring(4);
    } else if (text.startsWith('[ ] ')) {
        symbol = <span className="mr-2">•</span>;
        content = text.substring(4);
    } else if (text.startsWith('o ')) {
        symbol = <span className="mr-2">○</span>;
        content = text.substring(2);
    } else if (text.startsWith('!- ')) {
        symbol = <span className="mr-2">!-</span>;
        content = text.substring(3);
    } else if (text.startsWith('- ')) {
        symbol = <span className="mr-2">-</span>;
        content = text.substring(2);
    }
    
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (displayedText.length < content.length) {
            timer = setTimeout(() => {
                setDisplayedText(content.slice(0, displayedText.length + 1));
            }, typingSpeed);
        } else {
            setIsTyping(false);
            if (onComplete) {
                onComplete();
            }
        }
        return () => clearTimeout(timer);
    }, [displayedText, content, typingSpeed, onComplete]);
    
    return (
        <div className={className}>
            <div className="flex items-start">
                {symbol ? <span className="w-6 text-center">{symbol}</span> : null}
                <span>
                    {displayedText}
                    {isTyping && (
                        <span
                            className={`w-[2px] h-[1.2em] bg-white ml-[2px] animate-caret ${caretClassName}`}
                            style={caretStyle}
                        ></span>
                    )}
                </span>
            </div>
            {!isTyping && children && <div className="pl-6">{children}</div>}
        </div>
    );
};

export default TypingText;