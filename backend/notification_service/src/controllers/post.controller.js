import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PostController {
  async getPosts (req, res) {
    try {
      const dataGet = await prisma.postingan.findMany({
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

  async createPost (req, res) {
    try {
      const { 
        type,
        userId,
        content,
        status,
      } = req.body

      const postCreate = await prisma.postingan.create({
        data: {
          type,
          content,
          status,
          user: {
            connect: { user_id: parseInt(userId) }
          }
        }
      })
      
      if (!postCreate) {
        return res.status(400).json({ message: "Failed create Post" });
      }

      res.json({ status: 200, message: 'success create data', data: postCreate })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async createImagePost (req, res) {
    try {
      const { 
        post_id,
        image,
      } = req.body

      const postCreate = await prisma.postinganImage.create({
        data: {
          post: {
            connect: { id: parseInt(post_id) }
          },
          image
        }
      })
      
      if (!postCreate) {
        return res.status(400).json({ message: "Failed create Post" });
      }

      res.json({ status: 200, message: 'success create data', data: postCreate })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async updatePost (req, res) {
    try {
      const {
        type,
        content,
        status,
      } = req.body

      const dataUpdate = await prisma.postingan.update({
        where: { id: parseInt(req.params.id) },
        data: {
          type,
          content,
          status,
        }
      })

      if (!dataUpdate) {
        return res.status(400).json({ message: "Failed Update post" });
      }

      res.json({ status: 200, message: 'success update data', data: dataUpdate })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async deletePost (req, res) {
    try {
      const post = await prisma.postingan.delete({
        where: { id: parseInt(req.params.id) }
      })

      if (!post) {
        return res.status(400).json({ message: "Failed Delete post" });
      }

      res.json({ status: 200, message: 'success remove data', data: post })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }
}
