"use client";

import { GossipsType } from "@/utils/Gossip/getGossips";
import { ReactionsType } from "@/utils/Reaction/getReactions";
import { Badge } from "../ui/badge";
import Share from "./Share";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
import PostFooter from "./Footer/PostFooter";

export default function SingleGossip({
	gossip,
	reactions,
}: {
	gossip: GossipsType;
	reactions: ReactionsType[];
}) {
	return (
		<div
			key={gossip.id}
			className="relative container grid gap-3 px-0 md:px-6 py-7 max-w-2xl mx-auto"
			// className="relative container grid gap-3 border-2 border-black dark:border-slate-300 rounded-2xl px-6 py-7 max-w-2xl mx-auto "
		>
			<div
				className="absolute md:m-10 top-0 right-0 opacity-10 text-9xl select-none"
				style={{ zIndex: -1 }}
			>
				{gossip.backgroundEmoji}
			</div>
			<div
				className="absolute m-10 left-0 bottom-0 opacity-10 text-9xl select-none"
				style={{ zIndex: -1 }}
			>
				{gossip.backgroundEmoji}
			</div>
			<h1 className="gossip-title text-5xl font-bold">{gossip.title}</h1>
			<div className="flex justify-between first-letter items-center md:block">
				<Badge className="w-fit h-fit" variant={"secondary"}>
					{new Date(gossip.createdAt).toLocaleString("en-US", {
						hour12: true,
						day: "numeric",
						month: "short",
						year: "numeric",
						hour: "2-digit",
						timeZone: "Asia/Kolkata",
					})}
				</Badge>

				<Share id={gossip.id} title={gossip.title} />
			</div>

			{!!gossip.images?.length && (
				<div className="gossip-images flex gap-3 flex-wrap m-auto outline-dashed rounded-md">
					<Carousel>
						<CarouselContent>
							{gossip.images?.map((image: any, idx: number) => (
								<CarouselItem key={image.info.id}>
									<Image
										src={image.info.secure_url}
										width={image.info.width}
										height={image.info.height}
										alt={`${gossip.title} image ${idx}`}
										className="gossip-image w-full m-auto"
									/>
								</CarouselItem>
							))}
						</CarouselContent>
						{gossip.images?.length > 1 && (
							<>
								<CarouselPrevious />
								<CarouselNext />
							</>
						)}
					</Carousel>
				</div>
			)}
			<div
				className="gossip-message"
				dangerouslySetInnerHTML={{ __html: gossip.content }}
			></div>

			<PostFooter gossip={gossip} reactions={reactions} />
		</div>
	);
}
