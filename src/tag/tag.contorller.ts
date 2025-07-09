import { Request, Response, NextFunction } from "express";
import { createTag, getTagByName } from "./tag.service";

/**
 * 创建标签
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { name } = request.body;
  try {
    const tag = await getTagByName(name);

    if (tag) throw new Error("TAG_ALREADY_EXISTS");

    const mes = await createTag({ name });
    response.status(201).send(mes);
  } catch (error) {
    next(error);
  }
};
