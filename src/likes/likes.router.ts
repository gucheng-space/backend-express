import express from "express";
import * as likesController from "./likes.controller";
import { authGuard } from "../auth/auth.middleware";

const router = express.Router();

/**
 * 点赞内容
 */
router.post("/posts/:postId/like", authGuard, likesController.storeUserLike);

/**
 * 取消点赞
 */
router.delete(
  "/posts/:postId/like",
  authGuard,
  likesController.destroyUserLikePost
);

/**
 * 导出路由
 */
export default router;
