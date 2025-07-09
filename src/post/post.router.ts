import express from "express";
import * as postController from "./post.controller";
import { requestUrl } from "../app/app.middleware";
import { accessControl, authGuard } from "../auth/auth.middleware";

const router = express.Router();

/**
 * 内容列表
 */
router.get("/posts", requestUrl, postController.index);

/**
 * 创建内容
 */
router.post("/posts", authGuard, postController.store);

/**
 * 更新文章
 */
router.patch(
  "/posts/:postId",
  authGuard,
  accessControl({ possession: true }),
  postController.upodate
);

/**
 * 删除文章
 */
router.delete(
  "/posts/:postId",
  authGuard,
  accessControl({ possession: true }),
  postController.destroy
);

/**
 * 添加标签内容
 */
router.post(
  "/posts/:postId/tag",
  authGuard,
  accessControl({ possession: true }),
  postController.storePostTag
);

/**
 * 删除内容标签
 */
router.delete(
  "/posts/:postId/tag",
  authGuard,
  accessControl({ possession: true }),
  postController.destroyPostTag
);

/**
 * 导出路由
 */
export default router;
