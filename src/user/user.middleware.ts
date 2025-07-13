import { Request, Response, NextFunction } from "express";
import * as userService from "./user.service";
import bcrypt from "bcrypt";
import _ from "lodash";

/**
 * 验证用户数据
 */
export const validateUserData = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log("👮‍ 验证用户数据");
  const { name, password } = request.body;
  //验证必填数据
  if (!name) return next(new Error("NAME_IS_REQUIRED"));
  if (!password) return next(new Error("PASSWORD_IS_REQUIRED"));
  //验证用户名
  const user = await userService.getUserByName(name);
  if (user) return next(new Error("USER_ALREADY_EXIST"));

  next();
};

/**
 * HASH密码
 */
export const hashPassword = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { password } = request.body;
  request.body.password = await bcrypt.hash(password, 10);
  next();
};

/**
 * 验证更新用户数据
 */
export const vaildateUpdateUserData = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { vaildate, update } = request.body;

  const { id: userId } = request.user;

  try {
    if (!_.has(vaildate, "password")) {
      return next(new Error("PASSWORD_IS_REQUIRED"));
    }
    const user = await userService.getUserById(userId, { password: true });
    const matched = await bcrypt.compare(vaildate.password, user.password);

    if (!matched) {
      return next(new Error("PASSWORD_DOES_NOT_MATCH"));
    }
    //检查是否重名
    if (update.name) {
      const user = await userService.getUserByName(update.name);

      if (user) {
        return next(new Error("USER_ALREADY_EXIST"));
      }
    }
    // 非空限制，补充默认名字
    if (!update.name) update.name = user.name;
    // 检查密码是否重复
    if (update.password) {
      const matched = await bcrypt.compare(update.password, user.password);

      if (matched) {
        return next(new Error("PASSWORD_IS_THE_SAME"));
      }

      request.body.update.password = await bcrypt.hash(update.password, 10);
    }
    // 非空限制，补充默认密码
    if (!update.password) update.password = user.password;
  } catch (error) {
    return next(error);
  }

  next();
};
