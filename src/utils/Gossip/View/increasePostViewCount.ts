"use server"

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sha1 = require("sha1");

export type ViewType = {
	postId: string;
	userId: string;
};

export async function increasePostViewCount({ postId, userId }: ViewType) {
	const getUniqueId = sha1(postId + userId);
	try {
		await prisma.view.create({
			data: {
				id: getUniqueId,
				post: {
					connect: {
						id: postId,
					},
				},
				user: {
					connect: {
						id: userId,
					},
				},
			},
		});

		return {
			success: true,
			message: "View count increased",
		};
	} catch (err: any) {
		return {
			success: false,
			message: err.message,
		};
	}
}
