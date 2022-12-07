import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export default async function insert(req, res) {
  const question = req.body.question;
  const a = req.body.a;
  const b = req.body.b;
  const c = req.body.c;
  const correctAnswer = req.body.correctAnswer;
  const course_detail_id = req.body.course_detail_id;

  const data = await prisma.$queryRaw`INSERT INTO [dbo].[Course_Detail_Exam]
   ([course_detail_id],[question],[a],[b],[c],[correctAnswer])
  VALUES (${course_detail_id}, ${question},${a},${b},${c},${correctAnswer})`

  res.status(200).json(data)
}
