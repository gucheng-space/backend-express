import { Request, Response, NextFunction } from "express";
import { createFile, getFileById } from "./file.service";
import _ from "lodash";
import { FileModel } from "./file.model";
import fs from "fs";
import path from "path";

/**
 * 上传文件
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { id: userid } = request.user;
  const { post: postid } = request.query;
  const { width, height, metadata } = request.fileMetaData;
  const parsedPostId = parseInt(postid as string, 10);
  const { originalname, mimetype, filename, size: filesize } = request.file;
  try {
    const mes = await createFile({
      originalname,
      mimetype,
      filename,
      filesize,
      userid,
      postid: parsedPostId,
      width,
      height,
      metadata,
    });
    response.status(201).send(mes);
  } catch (error) {
    next(error);
  }
};

/**
 * 文件服务
 */
export const serve = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { fileId } = request.params;
  const { size } = request.query;
  const fileIdNum = parseInt(fileId, 10);
  try {
    const file: FileModel = await getFileById(fileIdNum);
    let fileName = file.filename;
    let root = "uploads";
    let resize = "resize";
    if (size) {
      const imageSizes = ["large", "meduim", "thumbnail"];

      if (!imageSizes.some((item) => item == size)) {
        throw new Error("FILE_NOT_FOUND");
      }

      const filExist = fs.existsSync(
        path.join(root, resize, `${fileName}-${size}`)
      );
      fileName = `${fileName}-${size}`;
      root = path.join(root, resize);
    }

    response.sendFile(fileName, {
      root,
      headers: {
        "Content-Type": file.mimetype,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 文件信息
 */
export const metedata = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { fileId } = request.params;

  try {
    const file: FileModel = await getFileById(parseInt(fileId, 10));
    const data = _.pick(file, [
      "id",
      "filesize",
      "width",
      "height",
      "metadata",
    ]);
    response.send(data);
  } catch (error) {
    next(error);
  }
};
