import express from "express";
import * as authController from "./auth.controller";
import { validateAuthData } from "./auth.middleware";
const authRouter = express.Router();

/**
 * 登录
 */
authRouter.post("/login", validateAuthData, authController.login);

/**
 * 导出路由
 */
export default authRouter;
