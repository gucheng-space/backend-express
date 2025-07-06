import { Request, Response, NextFunction } from "express";
import { getUserByName } from "../user/user.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PUBLIC_KEY } from "../app/app.config";
import { TokenPayload } from "./auth.interface";
import { possess } from "./auth.service";

/**
 * 验证用户登录数据
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
  request.body.user = user;

  next();
};

/**
 * 验证用户身份
 */
export const authGuard = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log(" 👮 验证用户身份‍");
  try {
    //提取authorization
    const authorization = request.header("Authorization");
    if (!authorization) throw new Error();
    //提取JWT 令牌
    const token = authorization.replace("Bearer ", "").trim();
    if (!token) throw new Error();
    //验证JWT 令牌
    const decoded = jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] });
    request.user = decoded as TokenPayload;
    next();
  } catch (error) {
    next(new Error("UNAUTHORIZED"));
  }
};

/**
 * 访问控制
 */
interface AccessControlOptions {
  possession?: boolean;
}

export const accessControl = (options: AccessControlOptions) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    console.log(` ⚔ 访问控制`);

    const { possession } = options;
    const { id: userId, name } = request.user;
    if (name === "顾城") return next();

    const resourceIdParam = Object.keys(request.params)[0];
    const resourceType = resourceIdParam.replace("Id", "").trim();
    const resourceId = parseInt(request.params[resourceIdParam], 10);
    if (possession) {
      try {
        const ownResource = await possess({ resourceId, resourceType, userId });
        if (!ownResource) return next(new Error("USER_DOES_NOT_RESOURCE"));
      } catch (error) {
        return next(error);
      }
    }
    next();
  };
};
