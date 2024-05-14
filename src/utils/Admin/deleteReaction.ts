"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function deleteReaction (reactionId: string) {
    try {
        await prisma.reactionsList.delete({
            where: {
                id: reactionId,
            },
        });
        return {
            sucess: true,
            message: "Reaction deleted successfully",
        };
    } catch (e: any) {
        return {
            sucess: false,
            message: e.message,
        };
    }
}