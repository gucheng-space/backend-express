import express from "express";
import { authGuard } from "../auth/auth.middleware";
import { fileInterceptor, fileProcessor } from "./file.middleware";
import * as fileController from "./file.controller";

const router = express.Router();

/**
 * 上传文件
 */
router.post(
  "/files",
  authGuard,
  fileInterceptor,
  fileProcessor,
  fileController.store
);

/**
 * 获取文件服务
 */
router.get("/files/:fileId/serve", fileController.serve);

/**
 * 文件信息
 */
router.get("/files/:fileId/metedata", fileController.metedata);

export default router;
