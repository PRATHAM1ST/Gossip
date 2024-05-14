"use server";

import { PrismaClient } from "@prisma/client";
import { GossipsType } from "./getGossips";

const prisma = new PrismaClient();

export type SingleGossipType = GossipsType | null;

export const getSingleGossip = async (id: string) => {
	try {
		return await prisma.post.findUnique({
			where: {
				id: id,
			},
			select: {
				id: true,
				title: true,
				content: true,
				createdAt: true,
				backgroundEmoji: true,
				totalReactions: true,
				reactions: true,
				views: true,
				images: true,
			},
		});
	} catch (err) {
		return null;
	}
};
