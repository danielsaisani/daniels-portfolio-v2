"use client";

import Link from 'next/link';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote';
import { TweetComponent } from './tweet';
import React from 'react';
import { LiveCode } from './sandpack';

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
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
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
      <Link href={href} {...rest}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith('#')) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
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

type CodeProps = React.PropsWithChildren<React.HTMLAttributes<HTMLPreElement>>;

function Code({ children, ...props }: CodeProps) {
  // Ensure children is a string, default to empty string if not
  const codeContent = typeof children === 'string' ? children : '';
  return (
    <pre {...props}> {/* Use <pre> for semantic code blocks */}
      <code>{codeContent}</code>
    </pre>
  );
}

// Explicitly type the parameter for better type safety and clarity
function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

// Explicitly type the parameter for better type safety and clarity
function createHeading(level: number) {
  return ({ children }: { children: React.ReactNode }) => {
    // Convert children to string for slugification (handles string or array of strings)
    const text =
      typeof children === 'string'
        ? children
        : Array.isArray(children)
          ? children.join('')
          : '';

    let slug = slugify(text);

    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children
    );
  };
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  Callout,
  ProsCard,
  ConsCard,
  StaticTweet: TweetComponent,
  code: Code, // Using the simplified Code component
  Table,
  LiveCode,
};

interface CustomMDXProps {
  mdxSource: any; // You can replace 'any' with a more specific type if available
  components?: Record<string, React.ComponentType<any>>;
}

export function CustomMDX(props: CustomMDXProps) {
  // The 'props' should contain mdxSource, and optionally 'components' for overrides
  if (!props.mdxSource) {
    // Or return a more specific error/fallback UI
    return <p>Error: MDX content not available.</p>;
  }

  return (
    <MDXRemote
      {...props.mdxSource} // Spread the serialized MDX object (e.g., compiledSource, frontmatter)
      components={{ ...components, ...(props.components || {}) }} // Use the restored full 'components' map
    />
  );
}
