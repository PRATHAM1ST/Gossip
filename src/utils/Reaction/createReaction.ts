"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type RequestType = {
	emojie: string;
	description: string;
};

export async function createReaction({ emojie, description }: RequestType) {
	try {
		const result = await prisma.reactionsList.create({
			data: {
				emojie,
				description,
			},
		});
		return {
			sucess: true,
			message: "Reaction created successfully",
		};
	} catch (e: any) {
		return {
			sucess: false,
			message: e.message,
		};
	}
}
