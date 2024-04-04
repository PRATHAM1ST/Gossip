"use server";

import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
const sha1 = require("sha1");

export type RequestType = {
	userEmail: string;
	postId: string;
	reactionId: string;
};

export async function addPostReaction({
	userEmail,
	postId,
	reactionId,
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

	const getUniqueId = sha1(userId + postId);

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
