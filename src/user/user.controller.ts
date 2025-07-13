import { Request, Response, NextFunction } from "express";
import * as userService from "./user.service";
import _ from "lodash";

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

/**
 * 用户账户
 */
export const show = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { userId } = request.params;
  try {
    const user = await userService.getUserById(parseInt(userId, 10));
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }
    response.send(user);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新用户
 */
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { id: userId, name } = request.user;
  const userDate = _.pick(request.body.update, "name", "password");
  try {
    const mes = await userService.updateUser(userId, userDate);
    response.send(mes);
  } catch (error) {
    next(error);
  }
};
