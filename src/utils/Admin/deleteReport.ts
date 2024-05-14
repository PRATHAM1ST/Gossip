"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function deleteReport(reportId: string) {
    try {
        await prisma.report.delete({
            where: {
                id: reportId,
            },
        });
        return {
            sucess: true,
            message: "Report deleted successfully",
        };
    } catch (e: any) {
        return {
            sucess: false,
            message: e.message,
        };
    }
}