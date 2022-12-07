import { userdb } from "../../common/user";

export default async function users(req, res) {
    const data = await userdb.$queryRaw`SELECT * FROM users`;
    res.status(200).json(data)
}

