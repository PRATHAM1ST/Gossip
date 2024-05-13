"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type RequestType = {
	email: string;
};

export async function getUserConfirmation({ email }: RequestType) {
	const result = await prisma.user.findUnique({
		where: {
			email: email,
		},
	});

	if (!result) {
		return {
			userExists: false,
		};
	}

	return {
		userExists: true,
		userId: result.id,
	};
}
