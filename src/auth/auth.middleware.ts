import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import { getUserByName } from "../user/user.service";
import bcrypt from "bcrypt";

/**
 * 验证用户数据
 */
export const validateAuthData = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log("👮‍ 验证用户登录数据");
  const { name, password } = request.body;
  //验证必填数据
  if (!name) return next(new Error("NAME_IS_REQUIRED"));
  if (!password) return next(new Error("PASSWORD_IS_REQUIRED"));
  //验证用户名
  const user = await getUserByName(name, { password: true });
  if (!user) return next(new Error("USER_DOES_NOT_EXIST"));
  // 验证密码
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) return next(new Error("PASSWORD_DOES_NOT_MATCH"));

  next();
};
