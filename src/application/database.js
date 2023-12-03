import { PrismaClient } from "@prisma/client/edge.js";
// import { PrismaClient } from "../../../prisma/generated/client/edge.js";
import { logger } from "./logging.js";

export const prismaClient = new PrismaClient({
  // dawdawdawdaw
  log: [
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});

prismaClient.$on("error", (e) => {
  logger.error(e);
});

prismaClient.$on("info", (e) => {
  logger.info(e);
});

prismaClient.$on("query", (e) => {
  logger.query(e);
});

prismaClient.$on("warn", (e) => {
  logger.warn(e);
});
