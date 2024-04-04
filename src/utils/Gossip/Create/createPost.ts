"use server";

import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export type RequestType = {
	title: string;
	content: string;
	backgroundEmoji: string;
	images: Prisma.InputJsonValue[];
};

export async function createPost({
	title,
	content,
	backgroundEmoji,
	images,
}: RequestType) {
	try {
		await prisma.post.create({
			data: {
				title: title,
				content: content,
				backgroundEmoji: backgroundEmoji,
				images: images,
			},
		});

		return {
			sucess: true,
			message: "Post created successfully",
		};
	} catch (e: any) {
		return {
			sucess: false,
			message: e.message,
		};
	}
}
