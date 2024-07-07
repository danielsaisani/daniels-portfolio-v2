"use client";

import Link from "next/link";
import { Button } from "@nextui-org/button";
import * as process from "node:process";
import Image from "next/image";
import { usePathname } from 'next/navigation';

export default function BottomBar() {
    const pathname = usePathname();
    const isBlogPage = pathname.startsWith('/blog');

    if (isBlogPage) {
        return null;
    }

    return (
        <div className={''}>
            <div className={'absolute bottom-2 left-2'}>
                <Link href={'/uses'}>
                    <Button className={'outline-0'}>
                        <Image src={'/static/backpack.svg'} alt={'my backpack of gear'} width={20} height={20} />
                    </Button>
                </Link>
            </div>
            <div className={'absolute bottom-2 right-2'}>
                <a className={'hover:animate-pulse'} href={'https://leerob.io/'} target={'_blank'}>Thanks to leerob for
                    this portfolio template :)</a>
            </div>
        </div>
    );
}