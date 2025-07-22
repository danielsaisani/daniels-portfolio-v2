import Link from 'next/link';
import { ReactNode } from 'react';

export function Card({
  className = '',
  children,
  ...props
}: {
  className?: string;
  children: ReactNode;
  [key: string]: any;
}) {
  return (
    <div
      className={`aspect-square rounded-2xl shadow-lg transition-transform hover:scale-105 border-2 border-dark p-5 bg-purple/30 ${className}`}
      style={{ minHeight: '180px', minWidth: '180px' }}
      {...props}
    >
      {children}
    </div>
  );
}

export function BlogCard({
  title,
  date,
  href,
  children,
  className = '',
}: {
  title: string;
  date: string;
  href: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <li className="list-none">
      <Link href={href} className="flex flex-col h-full justify-between">
        <Card className={className}>
          <div className="flex flex-col h-full justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">{title}</h3>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
              <span>{date}</span>
              {children}
            </div>
          </div>
        </Card>
      </Link>
    </li>
  );
}

export function ComingSoonCard({
  title,
  children,
  className = '',
}: {
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={`flex flex-col items-center justify-center bg-purple/30 opacity-80 ${className}`}>
      <p className="font-semibold text-center mb-2">{title}</p>
      {children}
    </Card>
  );
}