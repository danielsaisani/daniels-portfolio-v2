"use client"

import React from "react";
import Image from "next/image";

export default function Page() {
  return (
      <div className={'animate-fadeIn'}>
          <h1 className="font-medium text-2xl mb-8 tracking-tighter">hey there, i'm Daniel 👾</h1>
              <p className="prose prose-neutral dark:prose-invert">
                 full-stack software engineer @ terra YC W21 and comp sci grad from KCL
              </p>
            <div className="prose prose-neutral dark:prose-invert">
                <Image className={'rounded-2xl hover:scale-[1.05] duration-200'} src={'/static/selfies/daniel-on-amsterdam-stage.jpg'} alt={'me on stage'} width={200} height={200}/>
            </div>
      </div>
  );
}