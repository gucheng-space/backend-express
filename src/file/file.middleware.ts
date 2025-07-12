import { Request, Response, NextFunction } from "express";
import multer, { FileFilterCallback } from "multer";
import Jimp from "jimp";
import { imageResizer } from "./file.service";

/**
 * 文件过滤器
 */
export const fileFilter = (fileTypes: Array<string>) => {
  return (
    request: Request,
    file: Express.Multer.File,
    callblack: FileFilterCallback
  ) => {
    const allowed = fileTypes.some((type) => type === file.mimetype);
    if (allowed) {
      callblack(null, true);
    } else {
      callblack(new Error("FILE_TYPE_NOT_ALLOWED"));
    }
  };
};

const fileUploadFilter = fileFilter(["image/png", "image/jpg", "image/jpeg"]);

/**
 * 创建一个Muler
 */
const fileUpload = multer({
  dest: "uploads/",
  fileFilter: fileUploadFilter,
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
