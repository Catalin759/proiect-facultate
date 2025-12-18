import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import staticPlugin from "@fastify/static";
import path from "path";

import { authRoutes } from "./routes/auth";
import { projectRoutes } from "./routes/projects";

const fastify = Fastify({ logger: true });

// CORS
fastify.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// Multipart (upload)
fastify.register(multipart);

// Servește fișierele uploadate
fastify.register(staticPlugin, {
  root: path.join(process.cwd(), "uploads"),
  prefix: "/uploads/",
});

// Health check
fastify.get("/health", async () => {
  return { status: "ok" };
});

// Routes
fastify.register(authRoutes, { prefix: "/auth" });
fastify.register(projectRoutes, { prefix: "/projects" });

const start = async () => {
  try {
    await fastify.listen({ port: 3001 });
    console.log("Server running on http://localhost:3001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
