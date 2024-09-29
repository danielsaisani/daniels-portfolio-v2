"use client"
import { Card, Image } from "@nextui-org/react";
import React from "react";
import Link from "next/link";
import Project from "../components/Project";

export default function Page() {

    return (
        <section className={'flex flex-col gap-4 animate-fadeIn'}>
            <h1 className="font-medium text-2xl tracking-tighter">what I’ve gotten up to</h1>
            <p className="font-light">
                web dev, mobile apps and automations galore
            </p>
            <div className="gap-4 grid grid-cols-12 py-8">

                <Project projectPicture={'project-2.gif'} projectUrl={'https://github.com/DxnielKS/pacman-mdp'} />

                <Project projectPicture={'project-5.png'} projectUrl={'https://turingmachines.netlify.app/'} />

                <Project projectPicture={'tourbi.png'} projectUrl={'https://github.com/DxnielKS/tour-bi'} />



                <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-5 hover:scale-[1.05] duration-200">
                    <Link href={'https://www.tiktok.com/@clipscartel'} target={'_blank'}>
                        <Image
                            removeWrapper
                            alt="tiktok incubator"
                            className="z-0 w-full h-full object-cover rounded-3xl"
                            src="/static/tiktok.png"
                        />
                    </Link>
                </Card>



                <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-7 hover:scale-[1.05] duration-200">
                    <Link href={'https://github.com/DxnielKS/path-finder'} target={'_blank'}>
                        <Image
                            removeWrapper
                            alt="path finder"
                            className="z-0 w-full h-full object-cover rounded-3xl"
                            src="/static/path-finder.gif"
                        />
                    </Link>
                </Card>

            </div>
        </section>
    );
}
