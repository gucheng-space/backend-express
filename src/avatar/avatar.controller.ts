import { Request, Response, NextFunction } from "express";
import _ from "lodash";
import { createAvatar, findAvatarByUserId } from "./avatar.service";
import path from "path";
import fs from "fs";

/**
 * 上传头像
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { id: userid } = request.user;

  const fileInfo = _.pick(request.file, ["mimetype", "filename", "size"]);
  const avatar = {
    ...fileInfo,
    userid,
  };
  try {
    const mes = await createAvatar(avatar);
    response.status(201).send(mes);
  } catch (error) {
    next(error);
  }
};

/**
 * 头像服务
 */
export const serve = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { userId } = request.params;

  try {
    const avatar = await findAvatarByUserId(parseInt(userId, 10));

    if (!avatar) throw new Error("FILE_NOT_FOUND");

    const { size } = request.query;
    let filename = avatar.filename;
    let root = path.join("uploads", "avatar");
    const resized = "resized";

    if (size) {
      const imageSizes = ["large", "medium", "small"];

      if (!imageSizes.some((item) => item == size)) {
        throw new Error("FILE_NOT_FOUND");
      }
      const fileExist = fs.existsSync(
        path.join(root, resized, `${filename}-${size}`)
      );
      if (!fileExist) {
        throw new Error("FILE_NOT_FOUND");
      }
      if (fileExist) {
        filename = `${filename}-${size}`;
        root = path.join(root, resized);
      }
    }

    response.sendFile(filename, {
      root,
      headers: {
        "Content-Type": avatar.mimetype,
      },
    });
  } catch (error) {}
};
