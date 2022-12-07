import { PrismaClient } from "@prisma/client"
import { id } from "date-fns/locale";

const prisma = new PrismaClient();

export default async function insert(req, res) {
  const name = req.body.name;
  const type = req.body.type;
  const duration = req.body.duration;
  const courseLevel = req.body.courseLevel;
  const certificate = req.body.certificate;
  const certificateValidDate = req.body.certificateValidDate;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const sysDate = req.body.sysDate;
  const description = req.body.description;
  const course_ID = req.body.course_ID;

  const data = await prisma.$queryRaw`INSERT INTO [dbo].[Course]
   ([name],[type] ,[duration],[courseLevel] ,[startDate],[endDate] ,[sysDate],[description] ,[certificate],[certificateValidDate],[course_ID])
    VALUES (${name},${type}, ${duration}, ${courseLevel}, ${startDate}, ${endDate}, getdate(), ${description}, ${certificate}, ${certificateValidDate}, ${course_ID})`

  if (data) {
    var id = await prisma.$queryRaw`SELECT MAX(id) from Course`
  }
  res.status(200).json(id)
}
