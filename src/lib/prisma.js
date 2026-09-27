import { PrismaClient } from "@prisma/client";

/**
 * Singleton Prisma client for use in server-side code.
 *
 * In development, Next.js hot-reloading creates new module instances on each
 * reload. Without this pattern, each reload would open a new database
 * connection pool, quickly exhausting PostgreSQL's connection limit.
 *
 * We attach the instance to the Node.js global object in development so it
 * persists across hot-reloads.
 *
 * In production, the module is only loaded once, so a new instance is fine.
 */

const globalForPrisma = globalThis;

const connectionUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: connectionUrl
      ? {
          db: {
            url: connectionUrl,
          },
        }
      : undefined,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
