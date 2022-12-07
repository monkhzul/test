import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function users(req, res) {
    const data = await prisma.$queryRaw`SELECT * FROM Course`;
    res.status(200).json(data)
}

