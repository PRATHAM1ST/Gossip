"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getReportedPosts(){
    return await prisma.report.findMany({});
}