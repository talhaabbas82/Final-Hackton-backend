import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler.js";
import { adminRouter } from "./modules/admin/admin.routes.js";
import { aiRouter } from "./modules/ai/ai.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { leaderboardRouter } from "./modules/leaderboard/leaderboard.routes.js";
import { messagesRouter } from "./modules/messages/messages.routes.js";
import { notificationsRouter } from "./modules/notifications/notifications.routes.js";
import { requestsRouter } from "./modules/requests/requests.routes.js";
import { usersRouter } from "./modules/users/users.routes.js";

export const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/requests", requestsRouter);
app.use("/api/v1/messages", messagesRouter);
app.use("/api/v1/leaderboard", leaderboardRouter);
app.use("/api/v1/notifications", notificationsRouter);
app.use("/api/v1/ai", aiRouter);
app.use("/api/v1/admin", adminRouter);

app.use(errorHandler);
