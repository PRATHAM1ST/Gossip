"use server";

import { getUniqueId } from "@/utils/getUniqueId";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export type RequestType = {
	userEmail: string;
	postId: string;
};

export async function removePostReaction({ userEmail, postId }: RequestType) {
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

	try {
		await prisma.postReaction.delete({
			where: {
				id: uniqueId,
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
