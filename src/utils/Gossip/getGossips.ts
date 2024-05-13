"use server";

import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export type GossipsType = {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
	backgroundEmoji: string;
	totalReactions: number;
	reactions?: any[];
	images?: any[];
	views?: any[];
};

export type GossipsResponseType = {
	gossipsPerPage: Number,
	totalGossipsPages: Number,
	data: GossipsType[],
}

export async function getGossips({ pageNumber }: { pageNumber: number }): Promise<GossipsResponseType>{
	const totalGossips = await prisma.post.count();
	const gossipsPerPage = 2;
	const totalGossipsPages = Math.ceil(totalGossips / gossipsPerPage);

	if (pageNumber < 1) {
		return {
			gossipsPerPage,
			totalGossipsPages,
			data: [],
		};
	}

	if (pageNumber > totalGossipsPages) {
		return {
			gossipsPerPage,
			totalGossipsPages,
			data: [],
		};
	}

	const skip = (pageNumber - 1) * gossipsPerPage;
	const data: GossipsType[] = await prisma.post.findMany({
		skip: skip,
		take: gossipsPerPage,
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
		orderBy: {
			createdAt: "desc",
		},
	});

	// const views = await prisma.view.count({
	// 	where: {
	// 		postId: data.map((post) => post.id),
	// 	},
	// });

	if (!data) {
		return {
			gossipsPerPage: 0,
			totalGossipsPages: 0,
			data: [],
		};
	}

	const response = {
		gossipsPerPage,
		totalGossipsPages,
		data,
	};

	return response;
}