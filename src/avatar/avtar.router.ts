import express from "express";
import { authGuard } from "../auth/auth.middleware";
import { avatarInterceptor, avatarProcessor } from "./avatar.middleware";
import * as avatarController from "./avatar.controller";

const router = express.Router();

/**
 * 头像上传
 */
router.post(
  "/avatar",
  authGuard,
  avatarInterceptor,
  avatarProcessor,
  avatarController.store
);
/**
 * 头像服务
 */
router.get("/users/:userId/avatar", avatarController.serve);

/**
 * 导出路由
 */
export default router;
