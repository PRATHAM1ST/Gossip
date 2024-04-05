"use server";

import { PrismaClient } from "@prisma/client";
import { getUniqueId } from "../getUniqueId";

const prisma = new PrismaClient();

export type RequestType = {
	userEmail: string;
	postId: string;
};

export async function checkUserPostReaction({
	userEmail,
	postId,
}: RequestType) {
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

	const uniqueId = getUniqueId({
		userId: userId,
		postId: postId,
	});
	const reactionExistsInPost = await prisma.postReaction.findUnique({
		where: {
			id: uniqueId,
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
