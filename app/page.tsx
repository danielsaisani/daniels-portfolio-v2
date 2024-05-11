"use client"

import React from "react";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Button} from "@nextui-org/react";

export default function Page() {
  return (
      <>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">hey there, i'm Daniel 👾</h1>
      <p className="prose prose-neutral dark:prose-invert">
          I'm a full-stack engineer, innovator and content creator. If you want to be up to date with the stuff I get up to, the things I build and the content I make then you're in the right place!<br/>How..<br/>do..<br/>I..<br/>Even do this? How do you website? I don't know; but what I do know is that you'll enjoy your time here. Thanks for coming ;)
      </p>

      <div className="gap-4 grid grid-cols-12 py-8">

          <Card className="col-span-4 h-[300px]" isHoverable>
              <Image
                  removeWrapper
                  alt="Fiverr logo"
                  className="z-0 w-full h-full object-cover rounded-3xl"
                  src="/static/project-2.gif"
              />
          </Card>

          <Card className="col-span-4 h-[300px]" isHoverable>
              <Image
                  removeWrapper
                  alt="Fiverr logo"
                  className="z-0 w-full h-full object-cover rounded-3xl"
                  src="/static/project-5.png"
              />
          </Card>

          <Card className="col-span-4 h-[300px]">
              <Image
                  removeWrapper
                  alt="Fiverr logo"
                  className="z-0 w-full h-full object-cover rounded-3xl"
                  src="/static/tourbi.png"
              />
          </Card>

          <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-5">
              <Image
                  removeWrapper
                  alt="Fiverr logo"
                  className="z-0 w-full h-full object-cover rounded-3xl"
                  src="/static/tiktok.png"
              />
          </Card>

          <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-7">
              <Image
                  removeWrapper
                  alt="Fiverr logo"
                  className="z-0 w-full h-full object-cover rounded-3xl"
                  src="/static/path-finder.gif"
              />
          </Card>
      </div>
      </>
  );
}
