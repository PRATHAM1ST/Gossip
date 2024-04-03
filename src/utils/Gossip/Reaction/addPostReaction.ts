"use server";

import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export type RequestType = {
	userId: string;
	postId: string;
	reactionId: string;
};

export async function addPostReaction({
	userId,
	postId,
	reactionId,
}: RequestType) {

	const getUniqueId = userId + postId;

	try{
		const result = await prisma.postReaction.create({
			data: {
				id: getUniqueId,
				user: {
					connect: {
						id: userId,
					},
				},
				post: {
					connect: {
						id: postId,
					},
				},
				reaction: {
					connect: {
						id: reactionId,
					},
				},
			},
		});
		return {
			success: true,
			message: "Reaction added successfully",
			reactionId: reactionId,
			emojie: result.emojie,
		};
	}

	catch (err: any) {
		const result = await prisma.postReaction.update({
			where: {
				id: getUniqueId,
			},
			data: {
				reaction: {
					connect: {
						id: reactionId,
					},
				},
			},
		});
		return {
			success: true,
			message: "Reaction added successfully",
			reactionId: reactionId,
			emojie: result.emojie,
		};
	}
	

	
}
