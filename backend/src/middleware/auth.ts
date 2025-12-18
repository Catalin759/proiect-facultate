import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
  email: string;
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({ message: "Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    request.user = decoded;
  } catch {
    return reply.status(401).send({ message: "Invalid token" });
  }
}
