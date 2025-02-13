import { Card, Image } from "@nextui-org/react";
import { CardHeader } from "@nextui-org/card";
import React from "react";
import Link from "next/link";

interface ProjectProps {
    projectPicture: string // needs file extension too
    // projectName: string
    projectUrl?: string;
    // projectDescription: string
}

export default function Project(props: ProjectProps) {
    return (

        <Card className="col-span-4 h-[300px] duration-200">
            <Link href={props.projectUrl ? props.projectUrl : "/work"} target={'_blank'}>
                <Image
                    removeWrapper
                    alt={props.projectPicture}
                    className="z-0 w-full h-full object-cover rounded-3xl"
                    src={`/static/${props.projectPicture}`}
                />
            </Link>
        </Card>

    )
}