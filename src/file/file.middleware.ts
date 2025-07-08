import { Request, Response, NextFunction } from "express";
import multer from "multer";
import Jimp from "jimp";
import { imageResizer } from "./file.service";

/**
 * 创建一个Muler
 */
const fileUpload = multer({
  dest: "uploads/",
});

/**
 * 文件拦截器
 */
export const fileInterceptor = fileUpload.single("file");

/**
 * 文件处理中间件
 */
export const fileProcessor = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { path } = request.file;
  let image: Jimp;
  try {
    image = await Jimp.read(path);
  } catch (error) {
    return next(error);
  }
  const exif = image["_exif"];
  const { tags, imageSize } = exif;
  const metadata = JSON.stringify(tags);
  request.fileMetaData = { ...imageSize, metadata };
  imageResizer(image, request.file);
  next();
};
