"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const sha1 = require("sha1");

export type RequestType = {
	userEmail: string;
	postId: string;
};

export async function checkUserPostReaction({ userEmail, postId }: RequestType) {

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

	const getUniqueId = sha1(userId + postId);
	const reactionExistsInPost = await prisma.postReaction.findUnique({
		where: {
			id: getUniqueId,
		},
	});

	if (reactionExistsInPost) {
		return {
			success: true,
			message: "Reaction already exists",
			reactionId: reactionExistsInPost.reactionId,
            emojie: reactionExistsInPost.emojie,
			userId: reactionExistsInPost.userId,
		};
	}

	return {
		success: false,
		message: "Reaction not found",
	};
}
