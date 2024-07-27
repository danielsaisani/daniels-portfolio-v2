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
                <Link href={'/uses'}>
                    <Button className={'outline-0'}>
                        <Image src={'/static/backpack.svg'} alt={'my backpack of gear'} width={20} height={20} />
                    </Button>
                </Link>
    );
}