import { FastifyInstance } from "fastify";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";
import fs from "fs";
import path from "path";

export async function projectRoutes(fastify: FastifyInstance) {

  // =========================
  // GET projects
  // =========================
  fastify.get(
    "/",
    { preHandler: authMiddleware },
    async (request: any) => {
      const userId = request.user.userId;

      return prisma.project.findMany({
        where: { ownerId: userId },
        orderBy: { id: "desc" },
      });
    }
  );

  // =========================
  // CREATE project
  // =========================
  fastify.post(
    "/",
    { preHandler: authMiddleware },
    async (request: any, reply) => {
      const { name } = request.body as { name: string };
      const userId = request.user.userId;

      if (!name || name.trim().length < 3) {
        return reply
          .status(400)
          .send({ message: "Nume proiect invalid" });
      }

      return prisma.project.create({
        data: {
          name: name.trim(),
          ownerId: userId,
        },
      });
    }
  );

  // =========================
  // DELETE project
  // =========================
  fastify.delete(
    "/:id",
    { preHandler: authMiddleware },
    async (request: any, reply) => {
      const projectId = Number(request.params.id);
      const userId = request.user.userId;

      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project || project.ownerId !== userId) {
        return reply.status(404).send({ message: "Proiect inexistent" });
      }

      await prisma.project.delete({
        where: { id: projectId },
      });

      return { message: "Proiect șters" };
    }
  );

  // =========================
  // UPLOAD FILE
  // =========================
  fastify.post(
    "/:id/upload",
    { preHandler: authMiddleware },
    async (request: any, reply) => {
      const projectId = Number(request.params.id);
      const userId = request.user.userId;

      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project || project.ownerId !== userId) {
        return reply.status(404).send({ message: "Proiect inexistent" });
      }

      const file = await request.file();
      if (!file) {
        return reply.status(400).send({ message: "Fișier lipsă" });
      }

      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      const buffer = await file.toBuffer();
      const filePath = path.join(uploadDir, file.filename);

      fs.writeFileSync(filePath, buffer);

      return {
        message: "Fișier uploadat cu succes",
        filename: file.filename,
        url: `/uploads/${file.filename}`,
      };
    }
  );
}
