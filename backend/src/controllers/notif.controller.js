import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class NotifController {
  async getNotifs (req, res) {
    try {
      const dataGet = await prisma.notification.findMany({
        include: {
          user: true
        }
      })

      const sanitizedData = dataGet;

      res.json({ status: 200, message: 'success get data', data: sanitizedData })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async createNotifs (req, res) {
    try {
      const { 
        target,
        target_user_id,
        title,
        description,
        content,
        status_notification
      } = req.body

      const notifCreate = await prisma.notification.create({
        data: {
          target,
          target_user_id: target_user_id ?? null,
          title,
          description: description ?? null,
          content,
          status_notification: status_notification ?? 'normal'
        }
      })
      
      if (!notifCreate) {
        return res.status(400).json({ message: "Failed create Notif" });
      }

      res.json({ status: 200, message: 'success create data', data: notifCreate })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async updateNotif (req, res) {
    try {
      const { 
        target,
        target_user_id,
        title,
        description,
        content,
        status_notification
       } = req.body

      const dataUpdate = await prisma.notification.update({
        where: { id: parseInt(req.params.id) },
        data: {
          target,
          target_user_id: target_user_id ?? null,
          title,
          description: description ?? null,
          content,
          status_notification: status_notification ?? 'normal'
        }
      })

      if (!dataUpdate) {
        return res.status(400).json({ message: "Failed Update notif" });
      }

      res.json({ status: 200, message: 'success update data', data: dataUpdate })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async deleteNotif (req, res) {
    try {
      const notif = await prisma.notification.delete({
        where: { id: parseInt(req.params.id) }
      })

      if (!notif) {
        return res.status(400).json({ message: "Failed Delete notif" });
      }

      res.json({ status: 200, message: 'success remove data', data: notif })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }
}
