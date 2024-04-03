"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type ReactionsType = {
    id: string;
    emojie: string;
    description: string;
};

export async function getReactions() {
	return prisma.reactionsList.findMany({
        select: {
            id: true,
            emojie: true,
            description: true,
        }
    });
}
