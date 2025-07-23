
import React from 'react';

interface BulletJournalTextProps {
  text: string;
  children?: React.ReactNode;
}

const BulletJournalText: React.FC<BulletJournalTextProps> = ({ text, children }) => {
  let symbol = null;
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
  } else if (text.startsWith('- ')) {
    symbol = <span className="mr-2">-</span>;
    content = text.substring(2);
  } else if (text.startsWith('!- ')) {
    symbol = <span className="mr-2">!-</span>;
    content = text.substring(3);
  }

  return (
    <div>
      <div className="flex items-start">
        {symbol && <span className="w-6 text-center">{symbol}</span>}
        <span>{content}</span>
      </div>
      {children && <div className="pl-6">{children}</div>}
    </div>
  );
};

export default BulletJournalText;
