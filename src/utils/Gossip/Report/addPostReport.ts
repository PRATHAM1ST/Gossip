"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type RequestType = {
	userId: string;
	postId: string;
	reason: string;
};

export const addPostReport = async (req: RequestType) => {
	try {
		const { userId, postId, reason } = req;

		await prisma.report.create({
			data: {
				reason,
				post: {
					connect: {
						id: postId,
					},
				},
			},
		});

		return {
			success: true,
			message: "Report added successfully",
		};
	} catch (error: any) {
		return {
			success: false,
			message: error,
		};
	}
};
