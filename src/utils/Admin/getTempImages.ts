"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getTempImages(){
    return await prisma.temp.findMany({});
}