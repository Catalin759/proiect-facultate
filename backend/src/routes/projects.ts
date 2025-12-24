import { FastifyInstance } from "fastify";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";
import fs from "fs";
import path from "path";

export async function projectRoutes(fastify: FastifyInstance) {
  // =========================
  // GET PROJECTS
  // =========================
  fastify.get(
    "/",
    { preHandler: [authMiddleware] },
    async (request: any) => {
      const userId = request.user.userId;

      return prisma.project.findMany({
        where: { ownerId: userId },
        orderBy: { createdAt: "desc" },
      });
    }
  );

  // =========================
  // CREATE PROJECT
  // =========================
  fastify.post(
    "/",
    { preHandler: [authMiddleware] },
    async (request: any) => {
      const userId = request.user.userId;
      const { name } = request.body as { name: string };

      if (!name || name.length < 3) {
        return { message: "Numele proiectului este prea scurt" };
      }

      return prisma.project.create({
        data: {
          name,
          ownerId: userId,
        },
      });
    }
  );

  // =========================
  // DELETE PROJECT
  // =========================
  fastify.delete(
    "/:id",
    { preHandler: [authMiddleware] },
    async (request: any) => {
      const userId = request.user.userId;
      const projectId = Number(request.params.id);

      await prisma.project.deleteMany({
        where: {
          id: projectId,
          ownerId: userId,
        },
      });

      return { success: true };
    }
  );

  // =========================
  // UPLOAD FILE
  // =========================
  fastify.post(
    "/:id/upload",
    { preHandler: [authMiddleware] },
    async (request: any, reply) => {
      const projectId = Number(request.params.id);
      const data = await request.file();

      if (!data) {
        return reply.status(400).send({ message: "Nu a fost trimis niciun fișier" });
      }

      const uploadDir = path.join(process.cwd(), "uploads");

      const fileName = `${Date.now()}-${data.filename}`;
      const filePath = path.join(uploadDir, fileName);

      await new Promise((resolve, reject) => {
        const stream = fs.createWriteStream(filePath);
        data.file.pipe(stream);
        stream.on("finish", resolve);
        stream.on("error", reject);
      });

      return {
        message: "Fișier încărcat cu succes",
        fileName,
        url: `/uploads/${fileName}`,
      };
    }
  );
}
