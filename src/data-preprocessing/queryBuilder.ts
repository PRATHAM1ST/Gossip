import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class QueryBuilder {
    public static async insert(table: string, columns: string[], values: any[]) {
        try {
            await prisma.$executeRaw`INSERT INTO ${table} (${columns.join()}) VALUES (${values})`;
        } catch (e) {
            console.log(`[WARNING]: Query failed - ${e}`);
        }
    }

    public static async insertManyOrUpdate(
        table: string,
        columns: string[],
        values: any[][],
        types: string[],
        conflictColumns: string[],
        conflictAction: string,
        returns: string[] = []
    ) {
        try {
            await prisma.$executeRaw`
                INSERT INTO ${table} (${columns.join()})
                SELECT ${values.map((value, idx) => `unnest($${idx + 1}::${types[idx]}[])`).join()} 
                ON CONFLICT (${conflictColumns.join()}) 
                DO UPDATE SET ${conflictAction} 
                RETURNING ${returns.join()}
            `;
        } catch (e) {
            console.log(`[WARNING]: Query failed - ${e}`);
        }
    }

    public static async insertMany(
        table: string,
        columns: string[],
        values: any[][],
        types: string[]
    ) {
        try {
            await prisma.$executeRaw`
                INSERT INTO ${table} (${columns.join()})
                SELECT ${values.map((value, idx) => `unnest($${idx + 1}::${types[idx]}[])`).join()}
            `;
        } catch (e) {
            console.log(`[WARNING]: Query failed - ${e}`);
        }
    }
}
