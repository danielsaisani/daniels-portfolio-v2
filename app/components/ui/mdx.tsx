"use client";

import Link from 'next/link';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote';
import { TweetComponent } from './tweet';
import React, { Children } from 'react';
import { LiveCode } from './sandpack';
import { highlight } from 'sugar-high';

type TableData = {
  headers: string[];
  rows: (string | number | React.ReactNode)[][];
};

function Table({ data }: { data: TableData }) {
  let headers = data.headers.map((header: string, index: number) => (
    <th key={index}>{header}</th>
  ));
  let rows = data.rows.map((row: (string | number | React.ReactNode)[], index: number) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>{headers}</tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">{rows}</tbody>
      </table>
    </div>
  );
}

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: React.ReactNode;
};

function CustomLink(props: CustomLinkProps) {
  let href = props.href;

  if (href.startsWith('/')) {
    const { href, ...rest } = props;
    return (
      <Link href={href} {...rest} className="text-white">
        {props.children}
      </Link>
    );
  }

  if (href.startsWith('#')) {
    return <a {...props} className="text-white"/>;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} className="text-white"/>;
}

type RoundedImageProps = React.ComponentProps<typeof Image> & {
  alt: string;
};

function RoundedImage(props: RoundedImageProps) {
  return <Image className="rounded-lg" {...props} />;
}

type CalloutProps = {
  emoji: React.ReactNode;
  children: React.ReactNode;
};

function Callout(props: CalloutProps) {
  return (
    <div className="px-4 py-3 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded p-1 text-sm flex items-center text-neutral-900 dark:text-neutral-100 mb-8">
      <div className="flex items-center w-4 mr-4">{props.emoji}</div>
      <div className="w-full callout">{props.children}</div>
    </div>
  );
}

type ProsCardProps = {
  title: string;
  pros: string[];
};

function ProsCard({ title, pros }: ProsCardProps) {
  return (
    <div className="border border-emerald-200 dark:border-emerald-900 bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 my-4 w-full">
      <span>{`You might use ${title} if...`}</span>
      <div className="mt-4">
        {pros.map((pro) => (
          <div key={pro} className="flex font-medium items-baseline mb-2">
            <div className="h-4 w-4 mr-2">
              <svg className="h-4 w-4 text-emerald-500" viewBox="0 0 24 24">
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </g>
              </svg>
            </div>
            <span>{pro}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type ConsCardProps = {
  title: string;
  cons: string[];
};

function ConsCard({ title, cons }: ConsCardProps) {
  return (
    <div className="border border-red-200 dark:border-red-900 bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 my-6 w-full">
      <span>{`You might not use ${title} if...`}</span>
      <div className="mt-4">
        {cons.map((con) => (
          <div key={con} className="flex font-medium items-baseline mb-2">
            <div className="h-4 w-4 mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 text-red-500"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </div>
            <span>{con}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CodeBlock({ children }: { children?: React.ReactNode }) {
  const codeElement = React.Children.only(children) as React.ReactElement;
  const codeString = codeElement.props.children;
  const highlightedCode = highlight(codeString);
  return <div className="bg-gray-900 p-4 rounded-md" dangerouslySetInnerHTML={{ __html: highlightedCode }} />;
}

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function createHeading(level: number) {
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) => {
    const text = Children.toArray(children).join('');
    let slug = slugify(text);
    return React.createElement(
      `h${level}`,
      { id: slug, className: "font-bold text-white" },
      <>{children}</>
    );
  };
}

export let mdxComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="text-white mb-4" {...props} />,
  strong: (props: React.HTMLAttributes<HTMLElement>) => <strong className="font-bold text-white" {...props} />,
  em: (props: React.HTMLAttributes<HTMLElement>) => <em className="italic text-white" {...props} />,
  del: (props: React.HTMLAttributes<HTMLElement>) => <del className="line-through text-gray-400" {...props} />,
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="list-disc list-outside pl-5 mb-4" {...props} />,
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => <ol className="list-decimal list-outside pl-5 mb-4" {...props} />,
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className="mb-2" {...props} />,
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => <blockquote className="border-l-4 border-gray-500 pl-4 italic my-4" {...props} />,
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => <hr className="border-gray-700 my-8" {...props} />,
  pre: CodeBlock,
  code: (props: React.HTMLAttributes<HTMLElement>) => <code className="bg-gray-800 text-pink-400 rounded px-1 py-0.5" {...props} />,
  table: (props: React.HTMLAttributes<HTMLTableElement>) => <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-700" {...props} /></div>,
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => <thead className="bg-gray-800" {...props} />,
  tbody: (props: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody className="divide-y divide-gray-700" {...props} />,
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr className="dark:bg-gray-900" {...props} />,
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" {...props} />,
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => <td className="px-6 py-4 whitespace-nowrap text-sm text-white" {...props} />,
  Callout,
  ProsCard,
  ConsCard,
  StaticTweet: TweetComponent,
  Table,
  LiveCode,
};

interface CustomMDXProps {
  mdxSource: any;
  components?: Record<string, React.ComponentType<any>>;
}

export function CustomMDX(props: CustomMDXProps) {
  if (!props.mdxSource) {
    return <p>Error: MDX content not available.</p>;
  }

  return (
    <MDXRemote
      {...props.mdxSource}
      components={{ ...mdxComponents, ...(props.components || {}) }}
    />
  );
}