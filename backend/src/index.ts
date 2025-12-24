import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import staticPlugin from "@fastify/static";
import path from "path";
import fs from "fs";

import { authRoutes } from "./routes/auth";
import { projectRoutes } from "./routes/projects";

const fastify = Fastify({ logger: true });

// ==========================
// CORS
// ==========================
fastify.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// ==========================
// UPLOADS FOLDER (IMPORTANT)
// ==========================
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ==========================
// STATIC FILES (DOWNLOAD)
// ==========================
fastify.register(staticPlugin, {
  root: uploadDir,
  prefix: "/uploads/",
});

// ==========================
// MULTIPART (UPLOAD)
// ==========================
fastify.register(multipart);

// ==========================
// ROUTES
// ==========================
fastify.get("/health", async () => {
  return { status: "ok" };
});

fastify.register(authRoutes, { prefix: "/auth" });
fastify.register(projectRoutes, { prefix: "/projects" });

// ==========================
// START SERVER
// ==========================
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001;
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log(`Server running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
