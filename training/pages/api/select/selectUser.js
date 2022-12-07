import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function users(req, res) {
    const data = await prisma.$queryRaw` select * from [LMS].[dbo].[User]`
    res.status(200).json(data)
}

