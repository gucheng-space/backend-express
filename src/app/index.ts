import express from "express";
import postRouter from "../post/post.router";
import { defaultErrorHandler } from "./app.middleware";

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
app.use(postRouter);

/**
 * 错误处理
 */
app.use(defaultErrorHandler);

/**
 * 导出应用
 */
export default app;
