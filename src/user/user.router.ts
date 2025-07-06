import * as userController from "./user.controller";
import express from "express";
import { validateUserData, hashPassword } from "./user.middleware";

const userRouter = express.Router();

/**
 *用户注册
 */
userRouter.post("/users", validateUserData, hashPassword, userController.store);
/**
 * 导出路由
 */
export default userRouter;
