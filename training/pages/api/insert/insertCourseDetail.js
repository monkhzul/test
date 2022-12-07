import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export default async function insert(req, res) {
  const courseID = req.body.courseID;
  const name = req.body.name;
  const videoName = req.body.videoName;
  const videoPath = req.body.videoPath;
  const duration = req.body.duration;
  const isExam = req.body.isExam;

  const data = await prisma.$queryRaw`INSERT INTO [dbo].[CourseDetail]
   ([courseID],[name],[videoName],[videoPath],[duration],[isExam])
  VALUES (${courseID}, ${name},${videoName},${videoPath},${duration},${isExam})`

  res.status(200).json(data)
}
