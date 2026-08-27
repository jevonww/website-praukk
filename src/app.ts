import express from "express";
import path from "path";
import apiRouter from "@/routes";
import { notFoundHandler } from "@/middlewares/not-found.middleware";
import { errorHandler } from "@/middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
