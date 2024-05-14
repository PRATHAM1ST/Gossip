"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getReportedPosts(){
    return await prisma.report.findMany({
        select:{
            id: true,
            createdAt: true,
            reason: true,
            postId: true,
            post: {
                select: {
                    id: true,
                    title: true,
                    content: true,
                }
            }
        }
    });
}