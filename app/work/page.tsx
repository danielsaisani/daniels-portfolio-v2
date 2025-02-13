"use client"
import { Card, Image } from "@nextui-org/react";
import React from "react";
import Link from "next/link";
import Project from "../components/ui/project";

export default function Page() {

    return (
        <section className={'flex flex-col gap-4 animate-fadeIn'}>
            <h1 className="font-medium text-2xl tracking-tighter">what I’ve gotten up to</h1>
            <p className="font-light">
                web dev, mobile apps and automations galore
            </p>
            <div className="gap-4 grid grid-cols-12 py-8">

            </div>
        </section>
    );
}
