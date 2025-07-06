import express from "express";
import * as authController from "./auth.controller";
import { validateAuthData, authGuard } from "./auth.middleware";
const authRouter = express.Router();

/**
 * 登录
 */
authRouter.post("/login", validateAuthData, authController.login);
/**
 * 验证登录
 */
authRouter.post("/auth/validate", authGuard, authController.validate);

/**
 * 导出路由
 */
export default authRouter;
