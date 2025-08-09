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

const getTextFromChildren = (children: React.ReactNode): string => {
    let text = '';
    React.Children.forEach(children, (child) => {
        if (typeof child === 'string' || typeof child === 'number') {
            text += child.toString();
        } else if (React.isValidElement(child) && child.props.children) {
            text += getTextFromChildren(child.props.children);
        }
    });
    return text;
};

interface TypingProps {
    children: React.ReactNode;
    typingSpeed?: number;
    className?: string;
    onComplete?: () => void;
    caretClassName?: string;
    caretStyle?: React.CSSProperties;
}

const Typing: React.FC<TypingProps> = ({
    children,
    typingSpeed = 50,
    className = 'pl-6',
    onComplete,
    caretClassName = '',
    caretStyle = {},
}) => {
    const [textLength, setTextLength] = useState(0);
    const fullText = React.useMemo(() => getTextFromChildren(children), [children]);

    useEffect(() => {
        if (textLength < fullText.length) {
            const timer = setTimeout(() => {
                setTextLength(prevLength => prevLength + 1);
            }, typingSpeed);
            return () => clearTimeout(timer);
        } else {
            if (onComplete) {
                onComplete();
            }
        }
    }, [textLength, fullText, typingSpeed, onComplete]);

    const renderTypedChildren = (nodes: React.ReactNode, length: number): [React.ReactNode, number] => {
        let len = length;

        const mapped = React.Children.map(nodes, node => {
            if (len <= 0 || !node) return null;

            if (typeof node === 'string') {
                const nodeLen = node.length;
                const displayNode = node.slice(0, len);
                len -= nodeLen;
                return displayNode;
            }

            if (React.isValidElement(node)) {
                if (!node.props.children) return len > 0 ? node : null;

                const [children, newLen] = renderTypedChildren(node.props.children, len);
                len = newLen;

                if (children === null || (Array.isArray(children) && children.every(c => c === null))) {
                    return null;
                }

                return React.cloneElement(node, { ...node.props, children });
            }
            return null;
        });

        return [mapped, len];
    };

    const [displayedChildren] = renderTypedChildren(children, textLength);
    const isTyping = textLength < fullText.length;

    return (
        <div className={className}>
            {displayedChildren}
            {isTyping && (
                <span
                    className={`w-[2px] h-[1.2em] bg-white ml-[2px] animate-caret ${caretClassName}`}
                    style={caretStyle}
                ></span>
            )}
        </div>
    );
}

export { TypingText, Typing };