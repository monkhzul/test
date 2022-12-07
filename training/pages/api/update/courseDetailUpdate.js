import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function users(req, res) {
    const question = req.body.question;
    const a = req.body.a;
    const b = req.body.b;
    const c = req.body.c;
    const correctAnswer = req.body.correctAnswer;
    const id = req.body.id;

    const data = await prisma.$queryRaw`update [LMS].[dbo].CourseDetail
    set question = ${question}, a = ${a}, b = ${b}, c = ${c}, correctAnswer = ${correctAnswer}
    where id = ${id}`;
    res.status(200).json(data)
}

