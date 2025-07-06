import { Request, Response, NextFunction } from "express";
import { UserModel } from "./user.model";
import * as userService from "./user.service";

/**
 * 创建用户
 */
export const store = async (
  resquest: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { name, password } = resquest.body;
    const mes = await userService.createUser({ name, password });
    response.status(201).send(mes);
  } catch (error) {
    next(error);
  }
};
