import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { prisma } from "./prisma.js";
import authRouter from "./routes/auth.js";
import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";
import mediaRouter from "./routes/media.js";
import availabilityRouter from "./routes/availability.js";
import customersRouter from "./routes/customers.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { env } from "./env.js";

const app = express();
app.set("trust proxy", env.TRUST_PROXY);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (env.WEB_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Healthy root" });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    environment: env.NODE_ENV,
    storage: env.S3_BUCKET_NAME ? "s3" : "local",
  });
});

if (!env.S3_BUCKET_NAME) {
  app.use(
    "/uploads",
    express.static(env.UPLOAD_DIRECTORY_ABSOLUTE, {
      maxAge: env.isProduction ? "1h" : 0,
    })
  );
}

app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/media", mediaRouter);
app.use("/availability", availabilityRouter);
app.use("/customers", customersRouter);

app.use(errorHandler);

async function startServer() {
  try {
    const server = app.listen(env.PORT, () => {
      console.log(`Backend running on port ${env.PORT}`);
    });

    // 🔥 Prisma ya NO bloquea el arranque
    prisma.$connect()
      .then(() => console.log("Prisma connected"))
      .catch((err) => console.error("Prisma connection failed:", err));

    const shutdown = async (signal: NodeJS.Signals) => {
      console.log(`Received ${signal}, shutting down`);
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Failed to start backend", error);
    await prisma.$disconnect().catch(() => undefined);
    process.exit(1);
  }
}

void startServer();
