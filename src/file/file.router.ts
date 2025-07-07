import express from "express";
import { authGuard } from "../auth/auth.middleware";
import { fileInterceptor } from "./file.middleware";
import * as fileController from "./file.controller";

const router = express.Router();

/**
 * 上传文件
 */
router.post("/files", authGuard, fileInterceptor, fileController.store);

/**
 * 获取文件服务
 */
router.get("/files/:fileId/serve", fileController.serve);

export default router;
