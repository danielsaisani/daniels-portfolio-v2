"use client"
import {Card, Image} from "@nextui-org/react";
import React from "react";
import {CardHeader} from "@nextui-org/card";

export default function Page() {

  return (
      <section className={'animate-fadeIn'}>
          <h1 className="font-medium text-2xl mb-8 tracking-tighter">my work</h1>
          <div className="gap-4 grid grid-cols-12 py-8">

              <Card className="col-span-4 h-[300px] hover:scale-[1.05] duration-200" isHoverable>
                  <Image
                      removeWrapper
                      alt="Fiverr logo"
                      className="z-0 w-full h-full object-cover rounded-3xl"
                      src="/static/project-2.gif"
                  />
                  <CardHeader content={'hello'}/>
              </Card>

              <Card className="col-span-4 h-[300px] hover:scale-[1.05] duration-200" isHoverable>
                  <Image
                      removeWrapper
                      alt="Fiverr logo"
                      className="z-0 w-full h-full object-cover rounded-3xl"
                      src="/static/project-5.png"
                  />
              </Card>

              <Card className="col-span-4 h-[300px] hover:scale-[1.05] duration-200">
                  <Image
                      removeWrapper
                      alt="Fiverr logo"
                      className="z-0 w-full h-full object-cover rounded-3xl"
                      src="/static/tourbi.png"
                  />
              </Card>

              <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-5 hover:scale-[1.05] duration-200">
                  <Image
                      removeWrapper
                      alt="Fiverr logo"
                      className="z-0 w-full h-full object-cover rounded-3xl"
                      src="/static/tiktok.png"
                  />
              </Card>

              <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-7 hover:scale-[1.05] duration-200">
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
