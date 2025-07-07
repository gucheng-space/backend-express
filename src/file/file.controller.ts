import { Request, Response, NextFunction } from "express";
import { createFile, getFileById } from "./file.service";
import _ from "lodash";
import { FileModel } from "./file.model";

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
  const fileIdNum = parseInt(fileId, 10);
  try {
    const file: FileModel = await getFileById(fileIdNum);
    response.sendFile(file.filename, {
      root: "uploads",
      headers: {
        "Content-Type": file.mimetype,
      },
    });
  } catch (error) {
    next(error);
  }
};
