import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function users(req, res) {
    const id = req.body.id;

    const data = await prisma.$queryRaw`DELETE FROM [dbo].[Course_Request]
    WHERE id = ${id}`;
    res.status(200).json(data)
}

