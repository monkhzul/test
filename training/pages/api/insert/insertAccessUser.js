import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export default async function insert(req, res) {
  const last_name = req.body.last_name;
  const user_name = req.body.user_name;
  const erp_code = req.body.erp_code;
  const course_id = req.body.course_id;
  const courseName_ID = req.body.courseName_ID;
  const course_name = req.body.course_name;
  const date_of_completion = req.body.date_of_completion;
  const assessment = req.body.assessment;
  const exam_score = req.body.exam_score;
  const isCertificate = req.body.isCertificate;
  const certificateValidDate = req.body.certificateValidDate;
  const viewed_detail = req.body.viewed_detail;
  const isComplete = req.body.isComplete;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const sysDate = req.body.sysDate;

  const data = await prisma.$queryRaw`INSERT INTO [dbo].[User_Viewed_Course]
  ([last_name],[user_name],[erp_code],[course_id],[courseName_ID],[course_name],[date_of_completion],
  [assessment],[exam_score],[isCertificate],[certificateValidDate],[viewed_detail],[isComplete],[startDate],[endDate],[sysDate])
  VALUES (${last_name},${user_name},${erp_code},${course_id},${courseName_ID},${course_name},${date_of_completion},
  ${assessment},${exam_score},${isCertificate},${certificateValidDate},${viewed_detail},${isComplete},${startDate},${endDate},getdate())`

  res.status(200).json(data)
}
