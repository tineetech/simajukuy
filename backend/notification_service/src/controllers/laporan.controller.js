import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class LaporanController {
  async getLaporans (req, res) {
    try {
      const dataGet = await prisma.laporan.findMany({
        include: {
          user: true
        }
      })

      const sanitizedData = dataGet;

      res.json({ status: 200, message: 'success get data', data: sanitizedData.data })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async createLaporan (req, res) {
    try {
      const { 
        user_id,
        image,
        description,
        type_verification,
        status,
        notes
      } = req.body

      const laporanCreate = await prisma.laporan.create({
        data: {
          image,
          description: description ?? '',
          type_verification,
          status: status ?? 'pending',
          notes: notes ?? null,
          user: {
            connect: { user_id: parseInt(user_id) },
          },
        }
      })
      
      if (!laporanCreate) {
        return res.status(400).json({ message: "Failed create laporan" });
      }

      res.json({ status: 200, message: 'success create data', data: laporanCreate })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async updateLaporan (req, res) {
    try {
      const {
        image,
        description,
        type_verification,
        status,
        notes
       } = req.body

      const getData = await prisma.laporan.findFirst({
        where: { id: parseInt(req.params.id) }
      })

      const dataUpdate = await prisma.laporan.update({
        where: { id: parseInt(req.params.id) },
        data: {
          image: image ?? getData.image,
          description: description ?? getData.description,
          type_verification: type_verification ?? getData.type_verification,
          status: status ?? getData.status,
          notes: notes ?? getData.notes,
        }
      })

      if (!dataUpdate) {
        return res.status(400).json({ message: "Failed Update laporan" });
      }

      res.json({ status: 200, message: 'success update data', data: dataUpdate })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async deleteLaporan (req, res) {
    try {
      const laporan = await prisma.laporan.delete({
        where: { id: parseInt(req.params.id) }
      })

      if (!laporan) {
        return res.status(400).json({ message: "Failed Delete laporan" });
      }

      res.json({ status: 200, message: 'success remove data', data: laporan })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }
}
