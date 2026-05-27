import express from "express";
import { logger } from "@repo/logger";
import cors from "cors";
import cookieParser from "cookie-parser";

import * as trpcExpress from "@trpc/server/adapters/express";
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi";
import { apiReference } from "@scalar/express-api-reference";

import { serverRouter, createContext } from "@repo/trpc/server";

import { env } from "./env";

export const app = express();
const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: "Make My Form",
  version: "1.0.0",
  baseUrl: env.BASE_URL.concat("/api"),
});

// if (env.NODE_ENV !== "prod") {
//   app.use(
//     cors({
//       origin: "*",
//     }),
//   );
// } else {
const allowedOrigins = [
  env.FRONTEND_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1 || env.NODE_ENV !== "prod") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  }),
);
// }

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "MakeMyForm is up and running..." });
});

app.get("/health", (req, res) => {
  return res.json({ message: "MakeMyForm server is healthy", healthy: true });
});

logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`);
app.get("/openapi.json", (req, res) => {
  return res.json(openApiDocument);
});

logger.debug(`docs: ${env.BASE_URL}/docs`);
app.use("/docs", apiReference({ url: "/openapi.json" }));

app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

export default app;
