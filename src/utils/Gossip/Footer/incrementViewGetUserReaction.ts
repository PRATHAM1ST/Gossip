"use server";

import { getUniqueId } from "@/utils/getUniqueId";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type RequestType = {
    postId: string;
    userEmail: string;
};

export async function incrementViewGetUserReaction({ postId, userEmail }: RequestType) {
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
        await prisma.view.create({
            data: {
                id: uniqueId,
                post: {
                    connect: {
                        id: postId,
                    },
                },
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
    }
    catch (err: any) {
        if (err.code === "P2002") {
            console.log("View already exists");
        }
        else {
            return {
                success: false,
                message: err.message,
            };
        }
    }

    try{
        const userReaction = await prisma.postReaction.findUnique({
            where: {
                id: uniqueId,
            },
        });

        if (userReaction) {
            return {
                success: true,
                message: "Reaction already exists",
                reactionId: userReaction.reactionId,
                emojie: userReaction.emojie,
                userId: userReaction.userId,
            };
        }

        return {
            success: true,
            message: "View count increased and user reaction not found",
        };
        
    } catch (err: any) {
        return {
            success: false,
            message: err.message,
        };
    }
}