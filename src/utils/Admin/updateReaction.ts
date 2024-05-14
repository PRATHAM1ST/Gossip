"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateReaction(reactionId: string, description: string, emojie: string) {
    try {
        await prisma.reactionsList.update({
            where: {
                id: reactionId,
            },
            data: {
                emojie,
                description,
            },
        });
        return {
            sucess: true,
            message: "Reaction updated successfully",
        };
    } catch (e: any) {
        return {
            sucess: false,
            message: e.message,
        };
    }
}