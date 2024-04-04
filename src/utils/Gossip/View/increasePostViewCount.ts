"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sha1 = require("sha1");

export type ViewType = {
	postId: string;
	userEmail: string;
};

export async function increasePostViewCount({ postId, userEmail }: ViewType) {

	const user = await prisma.user.findUnique({
		where: {
			email: userEmail,
		},
	});
	
	if (!user) {
		return {
			success: false,
			message: "User not found",
		};
	}
	const userId = user.id;

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
