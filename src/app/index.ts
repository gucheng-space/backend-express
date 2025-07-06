import express from "express";
import { defaultErrorHandler } from "./app.middleware";
import postRouter from "../post/post.router";
import userRouter from "../user/user.router";
import authRouter from "../auth/auth.router";

/**
 * 创建应用
 */
const app = express();

/**
 * 处理 JSON
 */
app.use(express.json());

/**
 * 路由
 */
app.use(postRouter, userRouter, authRouter);

/**
 * 错误处理
 */
app.use(defaultErrorHandler);

/**
 * 导出应用
 */
export default app;
