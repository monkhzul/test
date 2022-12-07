import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export default async function insert(req, res) {
  const user_name = req.body.user_name;
  const erp_code = req.body.erp_code;
  const last_name = req.body.last_name;
  const course_name = req.body.course_name;
  const course_id = req.body.course_id;
  const courseName_ID = req.body.courseName_ID;
  const course_type = req.body.course_type;
  const state = req.body.state;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const sysDate = req.body.sysDate;

  const data = await prisma.$queryRaw`INSERT INTO [dbo].[Course_Request]
  ([user_name],[last_name],[erp_code],[course_id],[course_name],[courseName_ID],[course_type],[state],[startDate],[endDate],[sysDate])
  VALUES (${user_name},${last_name},${erp_code},${course_id},${course_name},${courseName_ID},${course_type},${state},${startDate},${endDate},getdate())`

  res.status(200).json(data)
}
