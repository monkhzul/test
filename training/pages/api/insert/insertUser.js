import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export default async function insert(req, res) {
  const department = req.body.department;
  const lastName = req.body.lastName;
  const firstName = req.body.firstName;
  const birthDate = req.body.birthDate;
  const erp = req.body.erp;
  const position = req.body.position;
  const rank = req.body.rank;
  const userType = req.body.userType;
  const chooseDate = req.body.chooseDate;
  const company = req.body.company;
  const sysDate = req.body.sysDate;

  const data = await prisma.$queryRaw`INSERT INTO [dbo].[User]
  ([lastName] ,[firstName],[erp_code],[department] ,[position],[rank],[date_of_employment]
   ,[birth_day],[user_id],[company],[sysDate])
  VALUES (${lastName},${firstName},${erp},${department},${position},${rank},${chooseDate},${birthDate},${userType},${company},getdate())`
  res.status(200).json(data)
}
