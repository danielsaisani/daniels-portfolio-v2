"use client"
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Button} from "@nextui-org/react";
import React from "react";

export default function Page() {

  return (
      <section>
          <h1 className="font-medium text-2xl mb-8 tracking-tighter">my work</h1>
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
      </section>
);
}
