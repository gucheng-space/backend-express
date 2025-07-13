import * as userController from "./user.controller";
import express from "express";
import {
  validateUserData,
  hashPassword,
  vaildateUpdateUserData,
} from "./user.middleware";
import { authGuard } from "../auth/auth.middleware";

const userRouter = express.Router();

/**
 *用户注册
 */
userRouter.post("/users", validateUserData, hashPassword, userController.store);

/**
 * 按 ID 获取用户
 */
userRouter.get("/users/:userId", userController.show);

/**
 * 更新用户
 */
userRouter.patch(
  "/users",
  authGuard,
  vaildateUpdateUserData,
  userController.update
);

/**
 * 导出路由
 */
export default userRouter;
