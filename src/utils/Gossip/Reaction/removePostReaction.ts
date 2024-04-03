"use server";

import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export type RequestType = {
	userId: string;
	postId: string;
};

export async function removePostReaction({ userId, postId }: RequestType) {
	const getUniqueId = userId + postId;

	try {
		await prisma.postReaction.delete({
			where: {
				id: getUniqueId,
			},
		});
	} catch (err: any) {
		return {
			success: false,
			message: err.message,
		};
	}

	return {
		success: true,
		message: "Reaction removed",
	};
}
