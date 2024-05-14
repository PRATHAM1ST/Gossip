"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function deletePost(postId: string) {
	try {
		await prisma.report.deleteMany({
			where: {
				postId: postId,
			},
		});

		await prisma.view.deleteMany({
			where: {
				postId: postId,
			},
		});

		await prisma.postReaction.deleteMany({
			where: {
				postId: postId,
			},
		});

		await prisma.post.delete({
			where: {
				id: postId,
			},
		});
		return {
			sucess: true,
			message: "Post deleted successfully",
		};
	} catch (e: any) {
		return {
			sucess: false,
			message: e.message,
		};
	}
}
