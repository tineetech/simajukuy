import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UsersController {
  async getUsers (req, res) {
    try {
      const dataGet = await prisma.user.findMany({
        include: {
          koin: true
        }
      })

      const sanitizedData = dataGet.map(({ password, ...user }) => user);

      res.json({ status: 200, message: 'success get data', data: sanitizedData })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async createUsers (req, res) {
    try {
      const { 
        username,
        first_name,
        last_name,
        email,
        phone,
        password,
        role
      } = req.body

      const userCreate = await prisma.user.create({
        data: {
          username,
          first_name,
          last_name,
          email,
          phone,
          password,
          role: role || 'guest',
          status: false
        }
      })
      
      if (!userCreate) {
        return res.status(400).json({ message: "User not found" });
      }

      await prisma.koin.create({
        data: {
          user_id: userCreate.user_id
        }
      })

      res.json({ status: 200, message: 'success create data', data: userCreate })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async updateUsersPublic (req, res) {
    try {
      const { username, firstName, lastName, avatar, phone } = req.body

      const dataUpdate = await prisma.user.update({
        where: { user_id: parseInt(req.params.id) },
        data: {
          username,
          first_name: firstName,
          last_name: lastName,
          avatar,
          phone
        }
      })

      if (!dataUpdate) {
        return res.status(400).json({ message: "User not found" });
      }

      res.json({ status: 200, message: 'success update data', data: dataUpdate })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async deleteUsers (req, res) {
    try {
      const koin = await prisma.koin.delete({
        where: { user_id: parseInt(req.params.id) }
      })

      const user = await prisma.user.delete({
        where: { user_id: parseInt(req.params.id) }
      })

      if (!koin) {
        return res.status(400).json({ message: "Koin foreign not found" });
      }

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }


      res.json({ status: 200, message: 'success remove user', data: user })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }
}
