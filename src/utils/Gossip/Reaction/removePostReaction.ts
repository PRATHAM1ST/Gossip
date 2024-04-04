"use server";

import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
const sha1 = require("sha1");

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

	const getUniqueId = sha1(userId + postId);

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
